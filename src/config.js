const path = require("path");

const utils = require("./utils/index.js");

const { getDate } = utils;

const dist = path.resolve(__dirname, "..", "dist");
const cache = path.resolve(__dirname, "..", "cache");

const date = getDate();

const config = {
  date,
  title: "News Wave - Daily News Digest",
  repo: "https://github.com/paulAlexSerban/prj--news-wave",
  author: "Paul Serban",
  paths: {
    dist,
    cache,
  },
};

module.exports = config;
