import debug from 'debug';
import { getPaymentPlans, addPaymentPlans } from '../../../lib/payment-plans';

const log = debug('mhawk-payment-plans');

const getController = async function getController(req, res) {
  try {
    const content = await getPaymentPlans((params) => {
      if (req.query.has_end_date === 'true') {
        log('has end date');
        return `WHERE ${params.plansTableName}.end_date IS NOT NULL`;
      }
      if (req.query.has_end_date === 'false') {
        log('does not has');
        return `WHERE ${params.plansTableName}.end_date IS NULL`;
      }
      return '';
    });
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
