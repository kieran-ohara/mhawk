/* eslint-disable dot-notation */

import axios from 'axios';
import debug from 'debug';
import url from 'url';
import { query } from './mysql';

const log = debug('mhawk-monzo');

const {
  MONZO_CLIENT_ID,
  MONZO_CLIENT_SECRET,
  MONZO_REDIRECT,
} = process.env;

const addLogin = async (opts) => {
  const result = await query(
    'INSERT INTO monzo_login SET ? ON DUPLICATE KEY UPDATE ?',
    [opts, opts],
  );
  log(`addLogin result ${result}`);
  return result.insertId;
};

const exchangeCode = (grantType, code) => {
  const params = {
    grant_type: grantType,
    client_id: MONZO_CLIENT_ID,
    client_secret: MONZO_CLIENT_SECRET,
  };
  if (grantType === 'authorization_code') {
    params['redirect_uri'] = MONZO_REDIRECT;
    params['code'] = code;
  }
  if (grantType === 'refresh_token') {
    params['refresh_token'] = code;
  }
  return axios.post(
    'https://api.monzo.com/oauth2/token',
    new url.URLSearchParams(params),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
};

const getLoginForUserId = async (userId) => {
  log(`Get login for user ID ${userId}`);
  const result = await query('SELECT * FROM monzo_login');
  if (result.length !== 1) {
    throw Error(`Unexpected length returned ${result.length}`);
  }
  const newLogin = await exchangeCode('refresh_token', result[0]['refresh_token']);
  addLogin(newLogin.data);
  return newLogin.data;
};

class MonzoClient {
  constructor(loginData) {
    this.loginData = loginData;
  }

  /* eslint-disable */
  post(uri, params) {
    /* eslint-enable */
    return axios.post(
      `https://api.monzo.com${uri}`,
      new url.URLSearchParams(params),
      {
        headers: {
          Authorization: `Bearer ${this.loginData.access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  }

  /* eslint-disable */
  get(uri) {
    /* eslint-enable */
    return axios({
      method: 'get',
      url: `https://api.monzo.com${uri}`,
      headers: {
        Authorization: `Bearer ${this.loginData.access_token}`,
      },
    });
  }
}

export {
  addLogin,
  exchangeCode,
  getLoginForUserId,
  MonzoClient,
};
