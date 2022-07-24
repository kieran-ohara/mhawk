const path = require("path");

module.exports = {
  target: "node",
  entry: {
    main: "./cli/payment-plan-end-notification.js",
    dollar: "./cli/daily-dollar.js",
    index: "./cli/index.js",
  },
  output: {
    filename: "./cli/[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
};
