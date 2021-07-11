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
  const { q } = req.body;
  try {
    const result = await client.search({
      index: ES_INDEX,
      body: {
        suggest: {
          'pp-suggest': {
            prefix: q,
            completion: {
              field: 'reference',
            },
          },
        },
      },
    });
    return res.status(200).json(result.body);
  } catch (error) {
    return res.status(500).json(error);
  }
};
