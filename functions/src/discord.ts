import { defineString } from 'firebase-functions/params';
import * as Undici from 'undici';

const DISCORD_BASE_URL = 'https://discord.com/api/oauth2/authorize';
const oauthClientId = defineString('DISCORD_OAUTH_CLIENT_ID');
const oauthClientSecret = defineString('DISCORD_OAUTH_CLIENT_SECRET');

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
