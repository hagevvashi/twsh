import { prompt } from 'inquirer';

export const askTweet = async (): Promise<string> => {
  const question: { type: string; name: string; message: string } = {
    type: 'text',
    name: 'tweetContent',
    message: 'type tweets you want to post'
  };

  const { tweetContent }: { tweetContent: string } = await prompt(question);
  return tweetContent;
};

export const askPin = async (requestToken: string): Promise<string> => {
  const question = {
    type: 'text',
    name: 'pin',
    message: `open this url\nhttps://twitter.com/oauth/authorize?oauth_token=${requestToken}\nthen type the pin.`
  };

  const { pin }: { pin: string } = await prompt(question);
  return pin;
};

export const askScreenName = async (): Promise<string> => {
  const question = {
    type: 'text',
    name: 'screenName',
    message: 'type screen_name'
  };

  const { screenName }: { screenName: string } = await prompt(question);
  return screenName;
};
