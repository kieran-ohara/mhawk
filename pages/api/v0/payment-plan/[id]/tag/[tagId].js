import debug from 'debug';
import { getSession } from 'next-auth/client';
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

export default async function handler(req, res) {
  const { method } = req;

  const session = await getSession({ req });
  const hasSession = !!session;
  if (!hasSession) {
    return res.status(401).end();
  }

  switch (method) {
    case 'DELETE':
      return deleteController(req, res);
    default:
      return res.status(400).end();
  }
}
