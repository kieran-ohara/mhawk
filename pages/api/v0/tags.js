import debug from 'debug';
import { getSession } from 'next-auth/client';
import { getTags } from '../../../lib/tags';

const log = debug('mhawk-payment-plans');

const getController = async function getController(req, res) {
  let content = {};
  try {
    content = await getTags();
  } catch (error) {
    log(error);
    return res.status(500).json({ error });
  }
  return res.status(200).json(content);
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
