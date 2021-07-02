import debug from 'debug';
import { getSession } from 'next-auth/client';
import { getTagsForPaymentPlan, tagPaymentPlan } from '../../../../../lib/tags';

const log = debug('mhawk-tags-by-id');

const getController = async function postController(req, res) {
  try {
    const result = await getTagsForPaymentPlan(req.query.id);
    return res.status(200).json(result);
  } catch (error) {
    log(error);
    return res.status(500).end();
  }
};

const postController = async function postController(req, res) {
  try {
    const result = await tagPaymentPlan(req.query.id, req.body.tag_id);
    return res.status(200).send(result);
  } catch (error) {
    log(error);
    return res.status(500).end();
  }
};

export default async function handler(req, res) {
  const { method } = req;

  const session = await getSession({ req });
  const hasSession = !!session;
  if (!hasSession) {
    return res.status(401).end();
  }

  switch (method) {
    case 'GET':
      return getController(req, res);
    case 'POST':
      return postController(req, res);
    default:
      return res.status(400).end();
  }
}
