const { Client } = require("@elastic/elasticsearch");

const { ES_USERNAME, ES_PASSWORD, ES_ENDPOINT, ES_INDEX } = process.env;

const indexName = ES_INDEX;

const client = new Client({
  node: ES_ENDPOINT,
  auth: {
    username: ES_USERNAME,
    password: ES_PASSWORD,
  },
});

export { client, indexName };
