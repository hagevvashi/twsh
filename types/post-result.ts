import * as http from "http";

export type PostResult = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: { statusCode: number; data?: any } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any | Buffer;
  response: http.IncomingMessage | undefined;
};
