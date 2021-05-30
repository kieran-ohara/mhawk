import debug from 'debug';
import { getPaymentPlans, addPaymentPlans } from '../../../lib/payment-plans';

const log = debug('mhawk-payment-plans');

const getController = async function getController(req, res) {
  try {
    const content = await getPaymentPlans();
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const postController = async function postController(req, res) {
  try {
    const content = await addPaymentPlans(req.body);
    res.status(200).json(content);
  } catch (error) {
    log(error);
    res.status(500).end();
  }
};

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      getController(req, res);
      break;
    case 'POST':
      postController(req, res);
      break;
    default:
      res.status(400);
      break;
  }
}
