import * as http from 'http';

export default interface PostResult {
  error: { statusCode: number; data?: any };
  data: any | Buffer;
  response: http.IncomingMessage;
}
