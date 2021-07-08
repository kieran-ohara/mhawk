import debug from 'debug';
import { query, closePool } from '../lib/mysql';

const { Client } = require('@elastic/elasticsearch');

const log = debug('mhawk-index');

(async () => {
  const plans = await query('SELECT * FROM payment_plans');

  const {
    ES_USERNAME,
    ES_PASSWORD,
    ES_ENDPOINT,
    ES_INDEX,
  } = process.env;

  const client = new Client({
    node: ES_ENDPOINT,
    auth: {
      username: ES_USERNAME,
      password: ES_PASSWORD,
    },
  });

  const now = new Date();
  plans.forEach(async (a) => {
    // eslint-disable-next-line
    const { id, monthly_price, start_date, end_date, reference } = a;
    await client.index({
      id: a.id,
      index: ES_INDEX,
      body: {
        id,
        datetime: now,
        monthly_price,
        start_date,
        end_date,
        reference,
      },
    });
    log(`indexed ${id}`);
  });

  closePool();
})();
