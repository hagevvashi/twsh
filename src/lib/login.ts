import { ErrorType, ErrorController } from "./error";
import localStorage from "./local-storage";
import verify from "./verify";

export default async (
  screenName: string
): Promise<{
  error: Error | null;
  accessToken: string | null;
  accessTokenSecret: string | null;
}> => {
  const savedAuthData = localStorage.getItem("user_auth_data");
  if (!savedAuthData) {
    return {
      error: new Error(
        ErrorController.getError(ErrorType.NEVER_AUTHED).getMessage()
      ),
      accessToken: null,
      accessTokenSecret: null,
    };
  }

  const userAuthData = JSON.parse(savedAuthData);

  try {
    const { accessToken, accessTokenSecret } = userAuthData[screenName];
    const error = await verify(accessToken, accessTokenSecret);

    if (error) {
      return {
        error: new Error(
          ErrorController.getError(ErrorType.VERIFY_FAIL).getMessage()
        ),
        accessToken: null,
        accessTokenSecret: null,
      };
    }

    return { error: null, accessToken, accessTokenSecret };
  } catch (e) {
    return {
      error: new Error(
        ErrorController.getError(ErrorType.UNAUTHED_SCREEN_NAME).getMessage()
      ),
      accessToken: null,
      accessTokenSecret: null,
    };
  }
};
