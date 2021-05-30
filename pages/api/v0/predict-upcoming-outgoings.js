import debug from 'debug';
import { MonzoClient, getLoginForUserId } from '../../../lib/monzo';
import { daysUntilPayDay } from '../../../lib/user';

const log = debug('mhawk-payment-plans');

const {
  DD_SOURCE_ACCOUNT,
} = process.env;

const getController = async function getController(req, res) {
  try {
    const now = new Date();

    const from = new Date();
    const monthsOffset = 1;
    from.setMonth(now.getMonth() - monthsOffset);

    const to = new Date(from.valueOf());
    to.setDate(from.getDate() + await daysUntilPayDay());

    const uri = `/transactions?account_id=${DD_SOURCE_ACCOUNT}&since=${from.toISOString()}&before=${to.toISOString()}`;
    log(`URI: ${uri}`);

    const userDetails = await getLoginForUserId(1);
    const monzo = new MonzoClient(userDetails);
    const transactionsResults = await monzo.get(uri);

    res.status(200).json(transactionsResults.data);
  } catch (error) {
    log(error);
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
