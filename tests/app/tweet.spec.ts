import * as askModule from "../../src/lib/ask";
import login from "../../src/lib/login";
import localStorage from "../../src/lib/local-storage";
import tweet from "../../src/app/tweet";
import postTweet from "../../src/lib/post-tweet";

jest.mock("../../src/lib/login");
jest.mock("../../src/lib/post-tweet");

describe("action's test (Integration test)", () => {
  it("When tweet method is called and localStorage's getItem method called with 'current_user' returns null, 'screen_name: null hasn't been authed yet.' and 'first, you must oauth' are displayed as standard output.", async () => {
    const currentUser = null;
    const getItemSpy: jest.SpyInstance = jest.spyOn(localStorage, "getItem");
    getItemSpy.mockImplementation(() => currentUser);

    const standardOutputSpy: jest.SpyInstance = jest
      .spyOn(process.stdout, "write")
      .mockImplementation((): boolean => true);

    await tweet();

    expect(process.stdout.write).toHaveBeenCalledTimes(2);
    expect(process.stdout.write).toHaveBeenNthCalledWith(
      1,
      `screen_name: ${currentUser} hasn't been authed yet.\n`
    );

    expect(process.stdout.write).toHaveBeenNthCalledWith(
      2,
      "first, you must oauth."
    );

    getItemSpy.mockRestore();
    standardOutputSpy.mockRestore();
  });

  it("When tweet method is called and localStorage's getItem method called with 'current_user' returns truthy value and login module returns error, that error is displayed as standard output.", async () => {
    const errorMessage = "something error";

    const currentUser = "current_user";
    const getItemSpy: jest.SpyInstance = jest.spyOn(localStorage, "getItem");
    getItemSpy.mockImplementation(() => currentUser);
    const standardOutputSpy: jest.SpyInstance = jest
      .spyOn(process.stdout, "write")
      .mockImplementation((): boolean => true);

    (login as jest.Mock).mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          error: new Error(errorMessage),
          accessToken: "access_token",
          accessTokenSecret: "access_token_secret",
        })
      )
    );

    await tweet();

    expect(process.stdout.write).toHaveBeenCalledTimes(2);
    expect(process.stdout.write).toHaveBeenNthCalledWith(
      1,
      `${new Error(errorMessage)}\n`
    );

    expect(process.stdout.write).toHaveBeenNthCalledWith(
      2,
      `screen_name: ${currentUser}\n`
    );

    (login as jest.Mock).mockRestore();
    getItemSpy.mockRestore();
    standardOutputSpy.mockRestore();
  });

  it("When tweet method is called and localStorage's getItem method called with 'current_user' returns truthy value and login module does't return error, you will tweet as #currentUser, and both askTweet and postTweet are called.", async () => {
    const currentUser = "current_user";
    const getItemSpy: jest.SpyInstance = jest.spyOn(localStorage, "getItem");
    getItemSpy.mockImplementation(() => currentUser);

    const standardOutputSpy: jest.SpyInstance = jest
      .spyOn(process.stdout, "write")
      .mockImplementation((): boolean => true);

    const askTweetSpy: jest.SpyInstance = jest
      .spyOn(askModule, "askTweet")
      .mockImplementation(async (): Promise<string> => "tweet_content");

    (login as jest.Mock).mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          error: null,
          accessToken: "access_token",
          accessTokenSecret: "access_token_secret",
        })
      )
    );

    (postTweet as jest.Mock).mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          error: null,
        })
      )
    );

    await tweet();

    expect(process.stdout.write).toHaveBeenCalledTimes(1);
    expect(standardOutputSpy).toBeCalledWith(
      `you will tweet as ${currentUser}\n`
    );
    expect(askTweetSpy).toHaveBeenCalledTimes(1);
    expect(postTweet).toHaveBeenCalledTimes(1);

    (login as jest.Mock).mockRestore();
    (postTweet as jest.Mock).mockRestore();
    getItemSpy.mockRestore();
    standardOutputSpy.mockRestore();
    askTweetSpy.mockRestore();
  });

  it("When tweet method is called and localStorage's getItem method called with 'current_user' returns truthy value and login module does't return error, you will tweet as #currentUser, and both askTweet and postTweet are called.", async () => {
    const currentUser = "current_user";
    const getItemSpy: jest.SpyInstance = jest.spyOn(localStorage, "getItem");
    getItemSpy.mockImplementation(() => currentUser);

    const standardOutputSpy: jest.SpyInstance = jest
      .spyOn(process.stdout, "write")
      .mockImplementation((): boolean => true);

    const askTweetSpy: jest.SpyInstance = jest
      .spyOn(askModule, "askTweet")
      .mockImplementation(async (): Promise<string> => "tweet_content");

    (login as jest.Mock).mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          error: null,
          accessToken: "access_token",
          accessTokenSecret: "access_token_secret",
        })
      )
    );

    const statusCode = 0;
    const data = null;

    (postTweet as jest.Mock).mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          error: { statusCode, data },
        })
      )
    );

    await tweet();

    expect(process.stdout.write).toHaveBeenCalledTimes(2);
    expect(standardOutputSpy).toHaveBeenNthCalledWith(
      1,
      `you will tweet as ${currentUser}\n`
    );

    expect(askTweetSpy).toHaveBeenCalledTimes(1);
    expect(postTweet).toHaveBeenCalledTimes(1);
    expect(standardOutputSpy).toHaveBeenNthCalledWith(
      2,
      `statusCode: ${statusCode}, data: ${data}\n`
    );

    (login as jest.Mock).mockRestore();
    (postTweet as jest.Mock).mockRestore();
    getItemSpy.mockRestore();
    standardOutputSpy.mockRestore();
    askTweetSpy.mockRestore();
  });
});
