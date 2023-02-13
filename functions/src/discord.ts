import { defineString } from 'firebase-functions/params';
import * as Undici from 'undici';
import { ProfileDetails } from './up-types';

const DISCORD_BASE_URL = 'https://discord.com/api/oauth2/authorize';
const oauthClientId = defineString('DISCORD_OAUTH_CLIENT_ID');
const oauthClientSecret = defineString('DISCORD_OAUTH_CLIENT_SECRET');
const discordBotToken = defineString('DISCORD_BOT_OAUTH_TOKEN');

export interface DiscordToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  verified: boolean;
  email: string;
  flags: number;
  banner: string;
  accent_color: number;
  premium_type: number;
  public_flags: number;
  display_name: string;
}

export interface DiscordAuth {
  authToken: string;
  user: DiscordUser;
}

interface Guild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: string[];
  permissions_new: string;
}

const getBotGuildId = (): Promise<string> => {
  return Undici.request('https://discord.com/api/users/@me/guilds', {
    headers: {
      Authorization: `Bot ${discordBotToken.value()}`,
    },
  }).then((responseData) => {
    const guildsPromise = responseData.body.json() as Promise<Guild[]>;
    return guildsPromise.then((guilds) => {
      return guilds[0].id;
    });
  });
};

export const generateDiscordAuthUrl = (referer: string): string => {
  const params = {
    client_id: oauthClientId.value(),
    redirect_uri: referer,
    response_type: 'code',
    scope: ['identify', 'connections', 'guilds'].join(' '),
  };
  return (
    DISCORD_BASE_URL +
    '?' +
    Object.entries(params)
      .map(([key, value], _i) => {
        return key + '=' + encodeURIComponent(value);
      })
      .join('&')
  );
};

export const fetchDiscordAccessToken = (
  code: string,
  redirect_uri: string,
): Promise<DiscordToken> => {
  return Undici.request('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: oauthClientId.value(),
      client_secret: oauthClientSecret.value(),
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirect_uri,
      scope: 'identify',
    }).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((responseData) => {
    return responseData.body.json() as Promise<DiscordToken>;
  });
};

export const fetchDiscordUserObject = (
  oauthData: DiscordToken,
): Promise<DiscordUser> => {
  return Undici.request('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${oauthData.token_type} ${oauthData.access_token}`,
    },
  }).then((responseData) => {
    return responseData.body.json() as Promise<DiscordUser>;
  });
};

export interface GuildUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar: string | null;
  avatar_decoration: string | null;
  discriminator: string;
  public_flags: number;
  bot: boolean;
}

export interface GuildMember {
  avatar: string | null;
  communication_disabled_until: string | null;
  flags: number;
  is_pending: boolean;
  joined_at: string;
  nick: string | null;
  pending: boolean;
  premium_since: string | null;
  roles: string[];
  user: GuildUser;
  mute: boolean;
  deaf: boolean;
}

export const extractProfileDataFromGuildMemberRecord = (
  member: GuildMember,
): ProfileDetails => {
  let name = member.user.username;
  if ('display_name' in member.user && member.user.display_name !== null) {
    name = member.user.display_name;
  }
  if ('nick' in member && member.nick !== null) {
    name = member.nick;
  }
  let photoURL;
  if (member.user.avatar !== null) {
    photoURL = `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=64`;
  }
  return { name, photoURL };
};

export const fetchDiscordUserList = () => {
  return getBotGuildId().then((guildId) => {
    return Undici.request(
      `https://discord.com/api/guilds/${guildId}/members?limit=200`,
      {
        headers: {
          Authorization: `Bot ${discordBotToken.value()}`,
        },
      },
    ).then((responseData) => {
      return responseData.body.json() as Promise<GuildMember[]>;
    });
  });
};
