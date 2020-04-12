import { ErrorType, ErrorController } from "../../src/lib/error";
import localStorage from "../../src/lib/local-storage";
import login from "../../src/lib/login";
import verify from "../../src/lib/verify";

jest.mock("../../src/lib/verify");

describe("login module's test", () => {
  it(`If authentication has been never done, return "${ErrorController.getError(
    ErrorType.NEVER_AUTHED
  ).getMessage()}"`, async () => {
    const getItemSpy = jest.spyOn(localStorage, "getItem");
    getItemSpy.mockImplementation((): string => "null");
    const { error } = await login("screenName");
    if (!error) throw new Error("test fail");
    const { message } = error;
    expect(message).toBe(
      ErrorController.getError(ErrorType.NEVER_AUTHED).getMessage()
    );
  });

  it(`If verification failed, return "${ErrorController.getError(
    ErrorType.VERIFY_FAIL
  ).getMessage()}"`, async () => {
    const authedScreenName = "authed_screen_name";
    const getItemSpy: jest.SpyInstance = jest.spyOn(localStorage, "getItem");
    const mockAuthData = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      authed_screen_name: {
        accessToken: "accessToken",
        accessTokenSecret: "accessTokenSecret",
      },
    };
    getItemSpy.mockImplementation((): string => JSON.stringify(mockAuthData));

    (verify as jest.Mock).mockResolvedValue(
      new Promise((resolve) => resolve(true))
    );

    const { error } = await login(authedScreenName);
    if (!error) throw new Error("test fail");
    const { message } = error;

    expect(message).toBe(
      ErrorController.getError(ErrorType.VERIFY_FAIL).getMessage()
    );
  });

  it(`If you input unauthed screen_name, you see an error "${ErrorController.getError(
    ErrorType.UNAUTHED_SCREEN_NAME
  ).getMessage()}"`, async () => {
    // notice that 'unauthedScreenName' is camel-case
    const unauthedScreenName = "unauthedScreenName";
    const getItemSpy: jest.SpyInstance = jest.spyOn(localStorage, "getItem");

    // notice that 'unauthed_screen_name' is snake-case
    const mockAuthData: {
      unauthed_screen_name: {
        accessToken: string;
        accessTokenSecret: string;
      };
    } = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      unauthed_screen_name: {
        accessToken: "accessToken",
        accessTokenSecret: "accessTokenSecret",
      },
    };
    getItemSpy.mockImplementation((): string => JSON.stringify(mockAuthData));

    const { error } = await login(unauthedScreenName);
    const { message } = error;
    if (!error) throw new Error("test fail");
    expect(message).toBe(
      ErrorController.getError(ErrorType.UNAUTHED_SCREEN_NAME).getMessage()
    );
  });

  it("If verification succeed, you get error-null and right access-token.", async () => {
    const authedScreenName = "authed_screen_name";
    const getItemSpy: jest.SpyInstance = jest.spyOn(localStorage, "getItem");
    const mockAuthData = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      authed_screen_name: {
        accessToken: "accessToken",
        accessTokenSecret: "accessTokenSecret",
      },
    };
    getItemSpy.mockImplementation((): string => JSON.stringify(mockAuthData));

    (verify as jest.Mock).mockResolvedValue(
      new Promise((resolve) => resolve(null))
    );

    const { error, accessToken, accessTokenSecret } = await login(
      authedScreenName
    );

    expect(error).toBe(null);
    expect(accessToken).toBe("accessToken");
    expect(accessTokenSecret).toBe("accessTokenSecret");
  });
});
