import { createPool } from 'mysql';
import { promisify } from 'util';

import debug from 'debug';

const log = debug('mhawk-sql');

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
} = process.env;

const pool = createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  port: MYSQL_PORT,
});

let poolClosed = false;

const closePool = async () => {
  await pool.end();
  poolClosed = true;
};

const queryInstance = promisify(pool.query).bind(pool);

const query = async (...params) => {
  log(...params);
  if (poolClosed) {
    throw Error('Pool was closed. Unexpected code path.');
  }
  return queryInstance(...params);
};

export { closePool, query };
