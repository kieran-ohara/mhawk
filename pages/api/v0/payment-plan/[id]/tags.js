import debug from 'debug';
import { getTagsForPaymentPlan } from '../../../../../lib/tags';

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

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getController(req, res);
    default:
      return res.status(400);
  }
}
