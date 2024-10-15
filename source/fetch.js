const path = require("path");
const fs = require("fs");
const Parser = require("rss-parser");
const utils = require("./utils");
const { createFile } = utils;

const source = process.argv[2];
const sourcesPath = path.resolve(__dirname, "sources", `${source}.json`);
const cachePath = path.resolve(
  __dirname,
  "..",
  "cache",
  `${source}-cache.json`
);

const sources = JSON.parse(fs.readFileSync(sourcesPath));
const cache = JSON.parse(fs.readFileSync(cachePath));

const parser = new Parser();
const MAX_ITEMS = 10;
const MIN_ITEMS = 5;
const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

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

/**
 * Sorts feed items by date in descending order.
 * @param {Object} feed - RSS feed object.
 * @returns {Object} Sorted feed object.
 */
const sortItems = (feed) => {
  Object.values(feed).forEach((section) => {
    section.items = section.items
      .filter((item) => item.lastBuildDate || item.pubDate || item.isoDate)
      .sort(
        (a, b) =>
          new Date(b.lastBuildDate || b.pubDate || b.isoDate) -
          new Date(a.lastBuildDate || a.pubDate || a.isoDate)
      );
  });
  return feed;
};

/**
 * Filters items that are within the last week and limits the items to a range.
 * @param {Object} feed - RSS feed object.
 * @returns {Object} Feed with filtered items.
 */
const keepOnlyLastWeekItems = (feed) => {
  const lastWeek = new Date(Date.now() - ONE_WEEK_IN_MS);
  Object.values(feed).forEach((section) => {
    const prevState = section.items;
    section.items = section.items.filter((item) => {
      const itemDate = new Date(
        item.lastBuildDate || item.pubDate || item.isoDate
      );
      return itemDate > lastWeek;
    });

    // Fallback to previous state if fewer than MIN_ITEMS are found
    if (section.items.length < MIN_ITEMS) {
      section.items = prevState.slice(0, MIN_ITEMS);
    }
    // Limit to MAX_ITEMS
    section.items = section.items.slice(0, MAX_ITEMS);
  });
  return feed;
};

/**
 * Cleans up unnecessary content from feed items.
 * @param {Object} feed - RSS feed object.
 * @returns {Object} Cleaned feed object.
 */
const cleanItemsContent = (feed) => {
  Object.values(feed).forEach((section) => {
    section.items = section.items.map((item) => ({
      ...item,
      content: "",
      "content:encoded": "",
      contentSnippet: "",
      "content:encodedSnippet": "",
      summary: "",
    }));
  });
  return feed;
};

/**
 * Initializes the feed processing, fetching RSS, and saving cache.
 */
const init = async () => {
  const { sections } = sources;
  const promises = sections.flatMap((section) =>
    section.items.map((item) =>
      fetchRSS(item.url).then((feed) => {
        if (feed) {
          console.log(
            `[ info ] Fetched ${item.title}: ${feed.items.length} items`
          );
          return { [item.title]: feed };
        } else {
          console.warn(
            `[ warning ] Skipping ${item.title} due to fetch failure`
          );
          return null;
        }
      })
    )
  );

  try {
    const feeds = await Promise.all(promises);

    feeds.filter(Boolean).forEach((feed) => {
      cache.type = sections[0].title; // Assuming single type for simplicity
      cache.feed = {
        ...cache.feed,
        ...cleanItemsContent(keepOnlyLastWeekItems(sortItems(feed))),
      };
    });

    const cacheString = JSON.stringify(cache, null, 2);
    createFile(cachePath, cacheString);
    console.log(`[ success ] Cache updated successfully at ${cachePath}`);
  } catch (error) {
    console.error(`[ error ] Failed during feed processing: ${error.message}`);
  }
};

init();
