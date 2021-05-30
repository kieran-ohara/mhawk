import debug from 'debug';
import { addPaymentPlansUsingTotal } from '../../../lib/payment-plans';

const log = debug('mhawk-monthly-payments');

const postController = async function postController(req, res) {
  try {
    const content = await addPaymentPlansUsingTotal(req.body);
    res.status(200).json(content);
  } catch (error) {
    log(error);
    res.status(500).end();
  }
};

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      postController(req, res);
      break;
    default:
      res.status(400);
      break;
  }
}
