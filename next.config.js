module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/payment-plans/finite',
        permanent: true,
      },
    ];
  },
};
