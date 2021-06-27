import debug from 'debug';
import { untagPaymentPlan } from '../../../../../../lib/tags';

const log = debug('mhawk-payment-plans');

const deleteController = async function postController(req, res) {
  try {
    await untagPaymentPlan(req.query.id, req.query.tagId);
    return res.status(204).end();
  } catch (error) {
    log(error);
    return res.status(500).end();
  }
};

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'DELETE':
      return deleteController(req, res);
    default:
      return res.status(400);
  }
}
