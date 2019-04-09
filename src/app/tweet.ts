import TwitterError from '../type/twitter-error';
import PostResult from '../type/post-result';
import { askTweet } from '../lib/ask';
import localStorage from '../lib/local-storage';
import login from '../lib/login';
import postTweet from '../lib/post-tweet';

export default async (): Promise<void> => {
  const currentUser: string = localStorage.getItem('current_user');

  // has not been oauthed yet
  if (!currentUser) {
    process.stdout.write(
      `screen_name: ${currentUser} hasn't been authed yet.\n`
    );
    process.stdout.write('first, you must oauth.');
    return;
  }

  const { error, accessToken, accessTokenSecret } = await login(currentUser);
  // login failed
  if (error) {
    process.stdout.write(`${error}\n`);
    process.stdout.write(`screen_name: ${currentUser}\n`);
    return;
  }

  // already logged in
  process.stdout.write(`you will tweet as ${currentUser}\n`);
  const tweetContent: string = await askTweet();
  const postResult: PostResult = await postTweet(
    tweetContent,
    accessToken,
    accessTokenSecret
  );

  // something is wrong
  const postError: TwitterError = postResult.error;
  if (postError) {
    const { statusCode, data }: TwitterError = postError;
    process.stdout.write(`statusCode: ${statusCode}, data: ${data}\n`);
  }
};
