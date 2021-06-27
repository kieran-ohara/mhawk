// import debug from 'debug';
import { query } from './mysql';

// const log = debug('mhawk-tags');

const getTags = async () => {
  const constructedQuery = 'SELECT name, slug, created_at, updated_at FROM tags';
  const result = await query(constructedQuery);
  return result;
};

const getTagsForPaymentPlan = async (id) => {
  const constructedQuery = `SELECT
    tags.name,
    tags.slug,
    tags.created_at,
    tags.updated_at
    FROM payment_plan_tags
  INNER JOIN tags ON payment_plan_tags.tag_id = tags.id
  WHERE payment_plan_tags.payment_plan_id = ?`;

  const result = await query(constructedQuery, [id]);
  return result;
};
export {
  getTags,
  getTagsForPaymentPlan,
};
