module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/payments/finite',
        permanent: true,
      },
    ];
  },
};
