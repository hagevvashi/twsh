import PostResult from '../type/post-result';
import twitterOauth from './twitter-oauth';

export default (
  tweetContent: string,
  accessToken: string,
  accessTokenSecret: string
): Promise<PostResult> =>
  new Promise(resolve => {
    twitterOauth.post(
      'https://api.twitter.com/1.1/statuses/update.json',
      accessToken,
      accessTokenSecret,
      { status: tweetContent },
      '',
      (error, data, response): void => {
        if (error) {
          resolve({ error, data, response });
        } else if (typeof data === 'string') {
          const parsedData = JSON.parse(data);
          resolve({ error: null, data: parsedData, response });
        } else {
          resolve({
            error: null,
            data,
            response
          });
        }
      }
    );
  });
