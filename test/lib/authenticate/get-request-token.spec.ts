import { oauth1tokenCallback } from 'oauth';
import TwitterError from '../../../src/type/twitter-error';
import twitterOauth from '../../../src/lib/twitter-oauth';
import getRequestToken from '../../../src/lib/authenticate/get-request-token';

describe("This is the getRequestToken module's test.", () => {
  it('If twitter api returns error, getRequestToken returns error what the api returns, requestToken and requestTokenSecret.', async () => {
    const error: TwitterError = { statusCode: 0 };
    const requestToken: string = 'failed_request_oken';
    const requestTokenSecret: string = 'failed_request_token_secret';
    const parsedQueryString: any = { foo: 'bar' };

    const twitterOauthGetOAuthRequestTokenSpy: jest.SpyInstance = jest.spyOn(
      twitterOauth,
      'getOAuthRequestToken'
    );

    twitterOauthGetOAuthRequestTokenSpy.mockImplementation(
      (callback: oauth1tokenCallback): void => {
        callback(error, requestToken, requestTokenSecret, parsedQueryString);
      }
    );

    const retVal: {
      err: TwitterError | null;
      requestToken: string;
      requestTokenSecret: string;
    } = await getRequestToken();
    expect(retVal.err).toBe(error);
    expect(retVal.requestToken).toBe(requestToken);
    expect(retVal.requestTokenSecret).toBe(requestTokenSecret);
  });

  it('If twitter api returns null as error, getRequestToken returns null, requestToken and requestTokenSecret.', async () => {
    const error: null = null;
    const requestToken: string = 'failed_request_oken';
    const requestTokenSecret: string = 'failed_request_token_secret';
    const parsedQueryString: any = { foo: 'bar' };

    const twitterOauthGetOAuthRequestTokenSpy: jest.SpyInstance = jest.spyOn(
      twitterOauth,
      'getOAuthRequestToken'
    );

    twitterOauthGetOAuthRequestTokenSpy.mockImplementation(
      (callback: oauth1tokenCallback): void => {
        callback(error, requestToken, requestTokenSecret, parsedQueryString);
      }
    );

    const retVal: {
      err: TwitterError | null;
      requestToken: string;
      requestTokenSecret: string;
    } = await getRequestToken();
    expect(retVal.err).toBe(error);
    expect(retVal.requestToken).toBe(requestToken);
    expect(retVal.requestTokenSecret).toBe(requestTokenSecret);
  });
});
