import type { TwitterError } from "../../../types/twitter-error";
import authenticate from "../../../src/lib/authenticate";
import authorize from "../../../src/lib/authenticate/authorize";
import getRequestToken from "../../../src/lib/authenticate/get-request-token";
import localStorage from "../../../src/lib/local-storage";

jest.mock("../../../src/lib/authenticate/get-request-token");

jest.mock("../../../src/lib/authenticate/authorize");

jest.mock("../../../src/lib/ask", () => ({
  askPin: jest.fn(async (): Promise<string> => "pin"),
}));

describe("authenticate module's test", () => {
  it("If getRequestToken module fails to return request-token, you get the same error as what the module returns.", async () => {
    (getRequestToken as jest.Mock).mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          err: { statusCode: 0 },
          requestToken: "requestToken",
          requestTokenSecret: "requestTokenSecret",
        })
      )
    );
    const { error }: { error: TwitterError } = await authenticate();
    const { statusCode }: { statusCode: number } = error;
    expect(statusCode).toBe(0);
  });

  it('If getRequestToken module succeed but authorize module fails, you get the same error as what the module "authorize" returns.', async () => {
    (getRequestToken as jest.Mock).mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          err: null,
          requestToken: "requestToken",
          requestTokenSecret: "requestTokenSecret",
        })
      )
    );

    (authorize as jest.Mock).mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          error: { statusCode: 0 },
          accessToken: "accessToken",
          accessTokenSecret: "accessTokenSecret",
          result: null,
        })
      )
    );

    const { error }: { error: TwitterError } = await authenticate();
    const { statusCode }: { statusCode: number } = error;
    expect(statusCode).toBe(0);
  });

  it("If getRequestToken module succeed, authorize module succeed and there has been already some user_auth_data, newly created data is saved, success notification as standard output is displayed and screenName authorize module returns is returned.", async () => {
    // preparation of stub, mock, dummy data...etc
    const authorizedScreenName = "screen_name_a";

    (getRequestToken as jest.Mock).mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          err: null,
          requestToken: "requestToken",
          requestTokenSecret: "requestTokenSecret",
        })
      )
    );

    (authorize as jest.Mock).mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          error: null,
          accessToken: "access_token_after",
          accessTokenSecret: "access_token_secret_after",
          // eslint-disable-next-line @typescript-eslint/camelcase
          result: { screen_name: authorizedScreenName },
        })
      )
    );

    const getItemSpy: jest.SpyInstance = jest.spyOn(localStorage, "getItem");
    getItemSpy.mockImplementation(
      (): string =>
        '{ "screen_name_a": { "accessToken": "access_token_before", "accessTokenSecret": "access_token_secret_before" }}'
    );

    jest.spyOn(localStorage, "setItem").mockImplementation((): null => null);
    jest.spyOn(process.stdout, "write").mockImplementation((): boolean => true);

    type authData = { accessToken: string; accessTokenSecret: string };
    const oneMockAuthData: authData = {
      accessToken: "access_token_after",
      accessTokenSecret: "access_token_secret_after",
    };
    const mockAuthData: {
      [screenName: string]: authData;
    } = {};
    mockAuthData[authorizedScreenName] = oneMockAuthData;
    const mockAuthDataString: string = JSON.stringify(mockAuthData);

    // execute
    const { screenName } = await authenticate();

    expect(localStorage.setItem).toBeCalledWith(
      "user_auth_data",
      mockAuthDataString
    );
    expect(process.stdout.write).toBeCalledWith(
      `successfully saved the token of ${screenName}\n`
    );
    expect(screenName).toBe(authorizedScreenName);

    (process.stdout.write as jest.Mock).mockRestore();
  });

  it("If getRequestToken module succeed, authorize module succeed and there has never been user_auth_data, newly created data is saved, success notification as standard output is displayed and screenName authorize module returns is returned.", async () => {
    // preparation of stub, mock, dummy data...etc
    const authorizedScreenName = "screen_name_a";

    (getRequestToken as jest.Mock).mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          err: null,
          requestToken: "requestToken",
          requestTokenSecret: "requestTokenSecret",
        })
      )
    );

    (authorize as jest.Mock).mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          error: null,
          accessToken: "access_token_after",
          accessTokenSecret: "access_token_secret_after",
          // eslint-disable-next-line @typescript-eslint/camelcase
          result: { screen_name: authorizedScreenName },
        })
      )
    );

    const getItemSpy: jest.SpyInstance = jest.spyOn(localStorage, "getItem");
    getItemSpy.mockImplementation((): null => null);

    jest.spyOn(localStorage, "setItem").mockImplementation((): null => null);
    jest.spyOn(process.stdout, "write").mockImplementation((): boolean => true);

    type authData = { accessToken: string; accessTokenSecret: string };
    const oneMockAuthData: authData = {
      accessToken: "access_token_after",
      accessTokenSecret: "access_token_secret_after",
    };
    const mockAuthData: {
      [screenName: string]: authData;
    } = {};
    mockAuthData[authorizedScreenName] = oneMockAuthData;
    const mockAuthDataString: string = JSON.stringify(mockAuthData);

    // execute
    const { screenName } = await authenticate();

    expect(localStorage.setItem).toBeCalledWith(
      "user_auth_data",
      mockAuthDataString
    );
    expect(process.stdout.write).toBeCalledWith(
      `successfully saved the token of ${screenName}\n`
    );
    expect(screenName).toBe(authorizedScreenName);

    (process.stdout.write as jest.Mock).mockRestore();
  });
});
