#!/usr/bin/env node

import * as program from 'commander';
import auth from '../app/auth';
import tweet from '../app/tweet';
import changeUser from '../app/change-user';

const { argv } = process;

program.version('1.0.2', '-v, --version');

program
  .command('change_user')
  .description(
    'The change_user command is prepared for changing the user name.'
  )
  .action(changeUser);

program
  .command('auth')
  .description(
    'The auth command is prepared for authentication of the user name.Copy the url and paste to the browser, and copy the displayed pin number on the page.'
  )
  .action(auth);

program
  .command('post')
  .description('The post command is prepared for posting tweet.')
  .action(tweet);

program.parse(argv);
