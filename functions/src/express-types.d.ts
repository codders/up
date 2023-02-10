export interface Request {
  headers: {
    authorization: string;
    referer: string;
    origin: string;
  };
  cookies: {
    __session: string;
  };
  user: {
    uid: string;
    [key: string]: any;
  };
  body: {
    [key: string]: any;
  };
  method: string;
  path: string;
  params: any;
  originalUrl: string;
}

export interface Response {
  status: (code: number) => Response;
  send: (message: { [key: string]: any } | string) => void;
  redirect: (code: number, location: string) => Response;
}
