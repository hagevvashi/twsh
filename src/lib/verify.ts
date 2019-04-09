import TwitterError from '../type/twitter-error';
import twitterOauth from './twitter-oauth';

export default (
  accessToken: string,
  accessTokenSecret: string
): Promise<TwitterError | null> =>
  new Promise(resolve => {
    twitterOauth.get(
      'https://api.twitter.com/1.1/account/verify_credentials.json',
      accessToken,
      accessTokenSecret,
      resolve
    );
  });
