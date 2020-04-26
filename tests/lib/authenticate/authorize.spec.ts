import { oauth1tokenCallback } from "oauth";
import twitterOauth from "../../../src/lib/twitter-oauth";
import type { TwitterError } from "../../../src/lib/twitter-oauth";
import authorize from "../../../src/lib/authenticate/authorize";

describe("authorize module's test", () => {
  it("Just returns twitter api's return value asynchronously.", async () => {
    const error = { statusCode: 999 };
    const accessToken = "accessToken";
    const accessTokenSecret = "accessTokenSecret";
    // eslint-disable-next-line @typescript-eslint/camelcase
    const result = { screen_name: "screen_name_a" };

    const twitterOauthGetOAuthAccessTokenSpy: jest.SpyInstance = jest.spyOn(
      twitterOauth,
      "getOAuthAccessToken"
    );

    twitterOauthGetOAuthAccessTokenSpy.mockImplementation(
      (
        requestToken: string,
        requestTokenSecret: string,
        pin: string,
        callback: oauth1tokenCallback
      ): void => {
        callback(error, accessToken, accessTokenSecret, result);
      }
    );

    const requestToken = "requestToken";
    const requestTokenSecret = "requestTokenSecret";
    const pin = "pin";

    const oauthResult: {
      error: TwitterError | null;
      accessToken: string;
      accessTokenSecret: string;
      result: { screen_name: string };
    } = await authorize(requestToken, requestTokenSecret, pin);

    expect(oauthResult.error).toBe(error);
    expect(oauthResult.accessToken).toBe(accessToken);
    expect(oauthResult.accessTokenSecret).toBe(accessTokenSecret);
    expect(oauthResult.result.screen_name).toBe(result.screen_name);
  });
});
