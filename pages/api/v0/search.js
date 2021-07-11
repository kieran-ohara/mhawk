import { getSession } from 'next-auth/client';
import { getPaymentPlansWithIds } from '../../../lib/payment-plans';
const { Client } = require('@elastic/elasticsearch');

const {
  ES_USERNAME,
  ES_PASSWORD,
  ES_ENDPOINT,
  ES_INDEX,
} = process.env;

const client = new Client({
  node: ES_ENDPOINT,
  auth: {
    username: ES_USERNAME,
    password: ES_PASSWORD,
  },
});

export default async (req, res) => {
  const { method } = req;

  if (method !== 'POST') {
    return res.status(400).end();
  }

  const session = await getSession({ req });
  const hasSession = !!session;
  if (!hasSession) {
    return res.status(401).end();
  }

  const { q } = req.body;
  try {
    const result = await client.search({
      index: ES_INDEX,
      body: {
        suggest: {
          ppsuggest: {
            prefix: q,
            completion: {
              field: 'reference',
            },
          },
        },
      },
    });
    const searchResults = result.body.suggest.ppsuggest[0].options;
    if (searchResults.length === 0) {
      return res.status(200).json([]);
    }
    const ids = searchResults.map((x) => {
      // eslint-disable-next-line
      return x._id;
    });
    const paymentPlans = await getPaymentPlansWithIds(ids);
    return res.status(200).json(paymentPlans);
  } catch (error) {
    return res.status(500).json(error);
  }
};
