import debug from 'debug';
import { addLogin, exchangeCode } from '../../../../lib/monzo';

const log = debug('mhawk-auth-all');

const {
  MONZO_CLIENT_ID,
  MONZO_REDIRECT,
} = process.env;

export default async function handler(req, res) {
  const { method, query } = req;
  const resource = query.all[query.all.length - 1];

  log(`${method} ${resource}`);
  if (method === 'GET' && resource === 'login') {
    const redirectUrl = `https://auth.monzo.com/?client_id=${MONZO_CLIENT_ID}&redirect_uri=${MONZO_REDIRECT}&response_type=code`;
    res.redirect(redirectUrl);
  } else if (resource === 'callback') {
    const { code } = query;
    try {
      const result = await exchangeCode('authorization_code', code);
      addLogin(result.data);
      log(result.data);
      res.redirect('/');
    } catch (error) {
      log(error);
      res.status(500).end();
    }
  } else {
    res.status(404).end();
  }
}
