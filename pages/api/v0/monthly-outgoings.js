import debug from 'debug';
import { getSession } from 'next-auth/client';
import { getTaxedWage } from '../../../lib/user';
import { getPaymentPlansActiveForMonth } from '../../../lib/payment-plans';

const log = debug('mhawk-forecast');

const getController = async function getController(req, res) {
  try {
    let date = new Date();
    if (req.query.date) {
      date = new Date(req.query.date);
    }

    const result = await Promise.all([
      getPaymentPlansActiveForMonth(date),
      getTaxedWage(),
    ]);
    const [items, grossMonth] = result;
    const sumOutgoings = (items.reduce((acc, item) => acc + item.monthly_price, 0)).toFixed(2);

    return res.status(200).json({
      date,
      net_month: grossMonth - sumOutgoings,
      gross_month: grossMonth,
      sum: sumOutgoings,
      items,
    });
  } catch (error) {
    log(`error: ${error}`);
    return res.status(500).json({ error });
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
    default:
      return res.status(400).end();
  }
}
