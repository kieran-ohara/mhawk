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

const paymentPlanHasTag = async (paymentPlanId, tagId) => {
  const constructedQuery = 'SELECT * FROM payment_plan_tags WHERE payment_plan_id = ? AND tag_id = ?';
  const result = await query(constructedQuery, [paymentPlanId, tagId]);
  if (result.length === 0) {
    return null;
  }
  if (result.length === 1) {
    return result[0].id;
  }
  throw Error('There is more than one tag id!');
};

const tagPaymentPlan = async (paymentPlanId, tagId) => {
  const existingId = await paymentPlanHasTag(paymentPlanId, tagId);
  if (existingId !== null) {
    return existingId;
  }
  const newId = await query(
    'INSERT INTO payment_plan_tags (payment_plan_id, tag_id) VALUES (?, ?)',
    [paymentPlanId, tagId],
  );
  return newId.insertId;
};

const untagPaymentPlan = async (paymentPlanId, tagId) => {
  const existingId = await paymentPlanHasTag(paymentPlanId, tagId);
  if (existingId === null) {
    return;
  }
  await query(
    'DELETE FROM payment_plan_tags WHERE payment_plan_id = ? AND tag_id = ?',
    [paymentPlanId, tagId],
  );
};

export {
  getTags,
  getTagsForPaymentPlan,
  tagPaymentPlan,
  untagPaymentPlan,
};
