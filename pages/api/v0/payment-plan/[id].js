import debug from 'debug';
import { getSession } from 'next-auth/client';
import { updatePaymentPlan, deletePaymentPlan } from '../../../../lib/payment-plans';

const log = debug('mhawk-payment-plans');

const patchController = async function postController(req, res) {
  try {
    await updatePaymentPlan(req.query.id, req.body);
    return res.status(204).end();
  } catch (error) {
    log(error);
    return res.status(500).end();
  }
};

const deleteController = async function postController(req, res) {
  try {
    await deletePaymentPlan(req.query.id);
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
    case 'PATCH':
      return patchController(req, res);
    case 'DELETE':
      return deleteController(req, res);
    default:
      return res.status(400).end();
  }
}
