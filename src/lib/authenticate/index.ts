import TwitterError from '../../type/twitter-error';
import { askPin } from '../ask';
import localStorage from '../local-storage';
import getRequestToken from './get-request-token';
import authorize from './authorize';

interface authData {
  accessToken: string;
  accessTokenSecret: string;
}

export default async (): Promise<{
  error: TwitterError | null;
  screenName: string | null;
}> => {
  const { err, requestToken, requestTokenSecret } = await getRequestToken();
  if (err) {
    return { error: err, screenName: null };
  }

  const pin: string = await askPin(requestToken);
  const oauthResult: {
    error: TwitterError | null;
    accessToken: string;
    accessTokenSecret: string;
    result: { screen_name: string };
  } = await authorize(requestToken, requestTokenSecret, pin);
  const { error, accessToken, accessTokenSecret, result } = oauthResult;

  if (error) {
    return { error, screenName: null };
  }

  const screenName = result.screen_name;
  const authData: authData = {
    accessToken,
    accessTokenSecret
  };
  const savedAuthData: string = localStorage.getItem('user_auth_data');
  const userAuthData: { [screenName: string]: authData } = savedAuthData
    ? JSON.parse(savedAuthData)
    : {};
  userAuthData[screenName] = authData;
  const userAuthString: string = JSON.stringify(userAuthData);
  localStorage.setItem('user_auth_data', userAuthString);
  process.stdout.write(`successfully saved the token of ${screenName}\n`);

  const retVal: { error: TwitterError | null; screenName: string } = {
    error: null,
    screenName
  };
  return retVal;
};
