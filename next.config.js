module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/monthly-outgoings",
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
