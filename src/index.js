const syncLoader = require("./sync-loader");
const asyncLoader = require("./async-loader");

module.exports = {
  ...asyncLoader,
  sync: syncLoader,
};
