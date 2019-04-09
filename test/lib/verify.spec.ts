import { Socket } from 'net';
import * as http from 'http';
import { dataCallback } from 'oauth';
import TwitterError from '../../src/type/twitter-error';
import twitterOauth from '../../src/lib/twitter-oauth';
import verify from '../../src/lib/verify';

jest.mock('http', () => ({
  ClientRequest: jest.fn((url, callback) => {
    callback();
  }),
  IncomingMessage: jest.fn(() => {}),
  Socket: jest.fn(() => {})
}));

describe("verify module's test", () => {
  it('If verify is called with verified token, it returns null.', async () => {
    const twitterOauthGetSpy = jest.spyOn(twitterOauth, 'get');

    twitterOauthGetSpy.mockImplementation(
      (
        url: string,
        accessToken: string,
        accessTokenString: string,
        callback: dataCallback
      ): http.ClientRequest => {
        const data: string = '';

        return new http.ClientRequest(
          url,
          (response: http.IncomingMessage): void => {
            callback(null, data, response);
          }
        );
      }
    );

    const error: TwitterError = await verify(
      'accessToken',
      'accessTokenSecret'
    );
    expect(error).toBe(null);
  });

  it('If verify is called with unverified token, it returns TwitterError.', async () => {
    const twitterOauthGetSpy = jest.spyOn(twitterOauth, 'get');

    twitterOauthGetSpy.mockImplementation(
      (
        url: string,
        accessToken: string,
        accessTokenString: string,
        callback: dataCallback
      ): http.ClientRequest => {
        const data: string = '';

        return new http.ClientRequest(
          url,
          (): void => {
            const statusCode = 200;
            callback(
              { statusCode, data },
              data,
              new http.IncomingMessage(new Socket())
            );
          }
        );
      }
    );

    const { statusCode, data }: TwitterError = await verify(
      'accessToken',
      'accessTokenSecret'
    );
    expect(typeof statusCode).toBe('number');
    expect(typeof data).toBe('string');
  });
});
