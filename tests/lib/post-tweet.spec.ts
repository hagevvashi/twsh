// import { Socket } from 'net';
import * as http from "http";
import { dataCallback } from "oauth";
import { PostResult } from "../../types/post-result";
import twitterOauth from "../../src/lib/twitter-oauth";
import postTweet from "../../src/lib/post-tweet";

jest.mock("http", () => ({
  ClientRequest: jest.fn((url, callback) => {
    callback();
  }),
  IncomingMessage: jest.fn((): null => null),
  Socket: jest.fn((): null => null),
}));

describe("post-tweet module's test", () => {
  it("If twitter api returns some error, object that post-tweet returns has error parameter which is not null.", async () => {
    const twitterOauthPostSpy: jest.SpyInstance = jest.spyOn(
      twitterOauth,
      "post"
    );

    twitterOauthPostSpy.mockImplementation(
      (
        url: string,
        accessToken: string,
        accessTokenString: string,
        postBody: {},
        postContentType?: string,
        callback?: dataCallback
      ): http.ClientRequest =>
        new http.ClientRequest(url, (response: http.IncomingMessage): void => {
          const statusCode = 404;
          const data = {
            error: "Page Not Found",
          };
          if (!callback) {
            throw new Error("Something went wrong.");
          }
          callback({ statusCode, data }, "Page Not Found", response);
        })
    );

    const tweetContent = "tweetContent";
    const accessToken = "accessToken";
    const accessTokenSecret = "accessTokenSecret";

    const postResult: PostResult = await postTweet(
      tweetContent,
      accessToken,
      accessTokenSecret
    );

    // something is wrong
    const postError = postResult.error;

    expect(postError).not.toBe(null);
  });

  it('If twitter api does not return error but return data type of which is "string", post-tweet returns parsed data.', async () => {
    const twitterOauthPostSpy: jest.SpyInstance = jest.spyOn(
      twitterOauth,
      "post"
    );

    twitterOauthPostSpy.mockImplementation(
      (
        url: string,
        accessToken: string,
        accessTokenString: string,
        postBody: {},
        postContentType?: string,
        callback?: dataCallback
      ): http.ClientRequest =>
        new http.ClientRequest(url, (response: http.IncomingMessage): void => {
          const data =
            '{"created_at": "Thu Mar 14 04:34:58 +0000 2019", "id": 123456789, "id_string": "1234356789"}';
          if (!callback) {
            throw new Error("Something went wrong.");
          }
          callback({ statusCode: 999 }, data, response);
        })
    );

    const tweetContent = "tweetContent";
    const accessToken = "accessToken";
    const accessTokenSecret = "accessTokenSecret";

    const postResult: PostResult = await postTweet(
      tweetContent,
      accessToken,
      accessTokenSecret
    );

    const { data } = postResult;
    expect(data.created_at).toBe("Thu Mar 14 04:34:58 +0000 2019");
  });

  it('If twitter api does not return error but return data type of which is not "string", post-tweet returns data as it is.', async () => {
    const twitterOauthPostSpy: jest.SpyInstance = jest.spyOn(
      twitterOauth,
      "post"
    );

    const retVal = Buffer.alloc(123);

    twitterOauthPostSpy.mockImplementation(
      (
        url: string,
        accessToken: string,
        accessTokenString: string,
        postBody: {},
        postContentType?: string,
        callback?: dataCallback
      ): http.ClientRequest =>
        new http.ClientRequest(url, (response: http.IncomingMessage): void => {
          const data: Buffer = retVal;
          if (!callback) {
            throw new Error("Something went wrong.");
          }
          callback({ statusCode: 999 }, data, response);
        })
    );

    const tweetContent = "tweetContent";
    const accessToken = "accessToken";
    const accessTokenSecret = "accessTokenSecret";

    const postResult: PostResult = await postTweet(
      tweetContent,
      accessToken,
      accessTokenSecret
    );

    const { data } = postResult;
    expect(data).toBe(retVal);
  });

  // it('If verify is called with unverified token, it returns TwitterError.', async () => {
  //   const twitterOauthGetSpy = jest.spyOn(twitterOauth, 'get');

  //   twitterOauthGetSpy.mockImplementation(
  //     (
  //       url: string,
  //       accessToken: string,
  //       accessTokenString: string,
  //       callback: dataCallback
  //     ): http.ClientRequest => {
  //       const data: string = '';

  //       return new http.ClientRequest(
  //         url,
  //         (): void => {
  //           const statusCode = 200;
  //           callback(
  //             { statusCode, data },
  //             data,
  //             new http.IncomingMessage(new Socket())
  //           );
  //         }
  //       );
  //     }
  //   );

  //   const { statusCode, data }: TwitterError = await verify(
  //     'accessToken',
  //     'accessTokenSecret'
  //   );
  //   expect(typeof statusCode).toBe('number');
  //   expect(typeof data).toBe('string');
  // });
});
