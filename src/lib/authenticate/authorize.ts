import type { TwitterError } from "../../../types/twitter-error";
import twitterOauth from "../twitter-oauth";

export default (
  requestToken: string,
  requestTokenSecret: string,
  pin: string
): Promise<{
  error: TwitterError | null;
  accessToken: string;
  accessTokenSecret: string;
  result: { screen_name: string };
}> =>
  new Promise((resolve): void => {
    twitterOauth.getOAuthAccessToken(
      requestToken,
      requestTokenSecret,
      pin,
      (
        err: TwitterError | null,
        token: string,
        secret: string,
        result: { screen_name: string }
      ): void => {
        resolve({
          error: err,
          accessToken: token,
          accessTokenSecret: secret,
          result,
        });
      }
    );
  });
