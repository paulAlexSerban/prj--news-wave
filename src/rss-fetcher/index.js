//@ts-check
const Parser = require("rss-parser");
const parser = new Parser();

/**
 * Fetches and parses RSS feed from a URL.
 * @param {string} url - RSS feed URL.
 * @returns {Promise<Object>} Parsed RSS feed object.
 */

const fetchRSS = async (url) => {
  try {
    const feed = await parser.parseURL(url);
    return feed;
  } catch (error) {
    console.error(
      `[ error ] Failed to fetch RSS from ${url}: ${error.message}`
    );
    return null;
  }
};

module.exports = {
  fetchRSS,
};
