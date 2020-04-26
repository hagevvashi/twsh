import { askScreenName } from "../lib/ask";
import localStorage from "../lib/local-storage";
import login from "../lib/login";

export default async (): Promise<void> => {
  const screenName: string = await askScreenName();
  const { error }: { error: Error | null } = await login(screenName);
  if (error) {
    process.stdout.write(`${error}\n`);
    return;
  }
  localStorage.setItem("current_user", screenName);
};
