import { OAuth } from 'oauth';
import { consumerKey, consumerSecret } from './config';

export default new OAuth(
  'https://twitter.com/oauth/request_token',
  'https://twitter.com/oauth/access_token',
  consumerKey,
  consumerSecret,
  '1.0A',
  null,
  'HMAC-SHA1'
);
