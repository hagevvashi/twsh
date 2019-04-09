import authenticate from '../lib/authenticate';
import login from '../lib/login';
import localStorage from '../lib/local-storage';

export default async (): Promise<void> => {
  const authResult = await authenticate();
  const authError = authResult.error;
  if (authError) {
    process.stdout.write(`${authError}\n`);
    return;
  }
  const { screenName } = authResult;
  const { error } = await login(screenName);
  if (error) {
    process.stdout.write(`${error}\n`);
    return;
  }
  localStorage.setItem('current_user', screenName);
};
