import debug from 'debug';
import { getPaymentPlansEndingNextMonth } from '../lib/payment-plans';
import { closePool } from '../lib/mysql';
import { MonzoClient, getLoginForUserId } from '../lib/monzo';

const log = debug('mhawk-payment-plan-end-notification');

const {
  NOTIFY_ACCOUNT,
} = process.env;

(async () => {
  const result = await getPaymentPlansEndingNextMonth();
  if (result.length === 0) {
    log('No results found, exising.');
    return;
  }
  log(`${result.length} results found, exising.`);
  const userDetails = await getLoginForUserId(1);

  let title;
  let body;

  if (result.length === 1) {
    /* eslint-disable */
    const { reference, monthly_price } = result[0];
    title = `Payment plan for "${reference}" is ending this month!`;
    body = `£${monthly_price} per month`;
    /* eslint-enable */
  } else if (result.length > 1) {
    title = `${result.length} payment plans are ending this month!`;
    body = result.map((x) => `${x.reference} (£${x.monthly_price})`).join(', ');
  } else {
    log(`Unknown length in result ${result.length}`);
    closePool();
    return;
  }

  const monzo = new MonzoClient(userDetails);
  await monzo.post('/feed', {
    type: 'basic',
    account_id: NOTIFY_ACCOUNT,
    'params[title]': title,
    'params[image_url]': 'https://www.kieranbamforth.me/public/mhawk/mhawk.jpeg',
    'params[body]': body,
  });

  closePool();
})();
