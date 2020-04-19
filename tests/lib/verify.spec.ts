import { Socket } from "net";
import * as http from "http";
import { dataCallback } from "oauth";
import twitterOauth from "../../src/lib/twitter-oauth";
import verify from "../../src/lib/verify";

jest.mock("http", () => ({
  ClientRequest: jest.fn((url, callback) => {
    callback();
  }),
  IncomingMessage: jest.fn((): null => null),
  Socket: jest.fn((): null => null),
}));

describe("verify module's test", () => {
  it("If verify is called with verified token, it returns null.", async () => {
    const twitterOauthGetSpy = jest.spyOn(twitterOauth, "get");

    twitterOauthGetSpy.mockImplementation(
      (
        url: string,
        accessToken: string,
        accessTokenString: string,
        callback: dataCallback
      ): http.ClientRequest => {
        const data = "";

        return new http.ClientRequest(
          url,
          (response: http.IncomingMessage): void => {
            callback({ statusCode: 999 }, data, response);
          }
        );
      }
    );

    const error = await verify("accessToken", "accessTokenSecret");
    expect(error).toBe(null);
  });

  it("If verify is called with unverified token, it returns TwitterError.", async () => {
    const twitterOauthGetSpy = jest.spyOn(twitterOauth, "get");

    twitterOauthGetSpy.mockImplementation(
      (
        url: string,
        accessToken: string,
        accessTokenString: string,
        callback: dataCallback
      ): http.ClientRequest => {
        const data = "";

        return new http.ClientRequest(url, (): void => {
          const statusCode = 200;
          callback(
            { statusCode, data },
            data,
            new http.IncomingMessage(new Socket())
          );
        });
      }
    );

    const error = await verify("accessToken", "accessTokenSecret");
    if (!error) throw new Error("test fail");
    const { statusCode, data } = error;
    expect(typeof statusCode).toBe("number");
    expect(typeof data).toBe("string");
  });
});
