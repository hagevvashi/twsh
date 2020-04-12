/**
 * Enumerate error's code
 */
export enum ErrorType {
  NEVER_AUTHED = 101,
  UNAUTHED_SCREEN_NAME = 102,
  VERIFY_FAIL = 103,
}

/**
 * Describe the Error information
 */
export class ErrorInfo {
  private code: number; // error code

  private message: string; // error description

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }

  public getCode(): number {
    return this.code;
  }

  public getMessage(): string {
    return this.message;
  }
}

/**
 * An Error Controller to throw errors and maintain the default error list
 */
export class ErrorController {
  private static ErrorList: ErrorInfo[] = [
    new ErrorInfo(
      ErrorType.NEVER_AUTHED,
      "You have never authed yet. Please authenticate."
    ),
    new ErrorInfo(
      ErrorType.UNAUTHED_SCREEN_NAME,
      "This screen_name hasn't been authed yet. Please authenticate."
    ),
    new ErrorInfo(
      ErrorType.VERIFY_FAIL,
      "Verify failed. Please authenticate again."
    ),
  ];

  /**
   * get error by error's type
   * @param err
   * @returns {ErrorInfo}
   */
  public static getError(err: ErrorType): ErrorInfo {
    return this.ErrorList.find((item) => item.getCode() === err);
  }
}
