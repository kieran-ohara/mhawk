import debug from 'debug';
import { getMonthlyPaymentsForDate } from '../../../lib/payment-plans';

const log = debug('mhawk-forecast');

const getController = async function getController(req, res) {
  try {
    let date = new Date();
    if (req.query.date) {
      date = new Date(req.query.date);
    }

    const result = await getMonthlyPaymentsForDate(date);
    const sumOutgoings = result.reduce((acc, item) => acc + item.monthly_price, 0);
    const grossMonth = 2756;

    res.status(200).json({
      date,
      net_month: grossMonth - sumOutgoings,
      gross_month: grossMonth,
      sum: sumOutgoings,
      items: result,
    });
  } catch (error) {
    log(`error: ${error}`);
    res.status(500).json({ error });
  }
};

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      getController(req, res);
      break;
    default:
      res.status(400);
      break;
  }
}
