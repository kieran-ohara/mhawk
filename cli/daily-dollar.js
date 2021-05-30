import debug from 'debug';
import { MonzoClient, getLoginForUserId } from '../lib/monzo';
import { closePool } from '../lib/mysql';
import { daysUntilPayDay } from '../lib/options';

const log = debug('mhawk-daily-dollar');

const {
  DD_SOURCE_ACCOUNT,
  NOTIFY_ACCOUNT,
} = process.env;

(async () => {
  log(await daysUntilPayDay());
  const userDetails = await getLoginForUserId(1);

  const monzo = new MonzoClient(userDetails);
  const balanceResult = await monzo.get(`/balance?account_id=${DD_SOURCE_ACCOUNT}`);
  const balance = (balanceResult.data.balance / 1000).toFixed(2);

  await monzo.post('/feed', {
    type: 'basic',
    account_id: NOTIFY_ACCOUNT,
    'params[title]': `Daily Dollar: £${balance}`,
    'params[image_url]': 'https://www.kieranbamforth.me/public/mhawk/mhawk.jpeg',
  });

  log(balance);
  closePool();
})();
