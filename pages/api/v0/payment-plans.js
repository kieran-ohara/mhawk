import debug from 'debug';
import { getPaymentPlans, addPaymentPlans } from '../../../lib/payment-plans';

const log = debug('mhawk-payment-plans');

const getController = async function getController(req, res) {
  try {
    const content = await getPaymentPlans((params) => {
      if (req.query.has_end_date === 'true') {
        return `WHERE ${params.plansTableName}.end_date IS NOT NULL`;
      }
      if (req.query.has_end_date === 'false') {
        return `WHERE ${params.plansTableName}.end_date IS NULL`;
      }
      if (req.query.payments_for_month) {
        const date = new Date(req.query.payments_for_month);
        const offset = date.getTimezoneOffset();
        const dateWithOffset = new Date(date.getTime() - (offset * 60 * 1000));
        const dateAsString = dateWithOffset.toISOString().split('T')[0];
        return `
        WHERE (DATE('${dateAsString}') BETWEEN ${params.plansTableName}.start_date AND ${params.plansTableName}.end_date)
        OR (${params.plansTableName}.start_date >= '${dateAsString}' AND ${params.plansTableName}.end_date IS NULL)
        `;
      }
      return '';
    });
    res.status(200).json(content);
  } catch (error) {
    log(error);
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
