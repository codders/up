declare namespace express {
  interface Request {
    headers: {
      authorization: string;
    },
    cookies: {
      __session: string;
    },
    user: {
      uid: string,
      [key: string]: any
    },
    body: {
      [key: string]: any
    },
    method: string,
    path: string,
    params: any
  }
  interface Response {
    status: (code: number) => Response
    send: (message: { [key: string]: any } | string) => void
  }
}
