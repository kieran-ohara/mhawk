// import debug from 'debug';
import { query } from './mysql';

// const log = debug('mhawk-tags');

const getTags = async () => {
  const constructedQuery = 'SELECT name, slug, created_at, updated_at FROM tags';
  const result = await query(constructedQuery);
  return result;
};

export { getTags };
