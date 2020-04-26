import { OAuth } from "oauth";
import { consumerKey, consumerSecret } from "./config";

export type TwitterError = {
  statusCode: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
};

export default new OAuth(
  "https://twitter.com/oauth/request_token",
  "https://twitter.com/oauth/access_token",
  consumerKey,
  consumerSecret,
  "1.0A",
  null,
  "HMAC-SHA1"
);
