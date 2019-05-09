import { LocalStorage } from 'node-localstorage';
import { homedir } from 'os';
import { resolve } from 'path';

const homeDir: string = homedir();

export default new LocalStorage(resolve(homeDir, '.twsh'));
