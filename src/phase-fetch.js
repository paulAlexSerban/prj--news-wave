//@ts-check
const path = require("path");
const fs = require("fs");

const utils = require("./utils");
const { fetchRSS } = require("./rss-fetcher");
const { createFile, cleanItemsContent, keepOnlyLastWeekItems, sortItems } =
  utils;

const source = process.argv[2];
const rssFeedPath = path.resolve(__dirname, "rss-feeds", `${source}.json`);
const cachePath = path.resolve(
  __dirname,
  "..",
  "cache",
  `${source}-cache.json`
);

// Load sources and cache files
const loadJSON = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.error(`[ error ] Failed to load JSON file: ${filePath}`);
    throw error;
  }
};

const sources = loadJSON(rssFeedPath);
const cache = loadJSON(cachePath);

/**
 * Process a single RSS feed and update the cache.
 * @param {string} title - The title of the RSS feed.
 * @param {string} url - The URL of the RSS feed.
 * @param {string} sectionTitle - The title of the section.
 */
const processFeed = async (title, url, sectionTitle) => {
  try {
    const feed = await fetchRSS(url);

    if (feed) {
      console.log(`[ info ] Fetched ${title}: ${feed.items.length} items`);
      cache.type = sectionTitle;
      cache.feed = {
        ...cache.feed,
        ...cleanItemsContent(
          keepOnlyLastWeekItems(sortItems({ [title]: feed }))
        ),
      };
    } else {
      console.warn(`[ warning ] Skipping ${title} due to fetch failure`);
    }
  } catch (error) {
    console.error(
      `[ error ] Failed to fetch RSS for ${title}: ${error.message}`
    );
  }
};

/**
 * Process all RSS feeds sequentially.
 */
const processAllFeeds = async () => {
  const { sections } = sources;

  for (const section of sections) {
    for (const item of section.items) {
      await processFeed(item.title, item.url, section.title);
    }
  }
};

/**
 * Save the updated cache to a file.
 */
const saveCache = () => {
  const cacheString = JSON.stringify(cache, null, 2);
  createFile(cachePath, cacheString);
  console.log(`[ success ] Cache updated successfully at ${cachePath}`);
};

/**
 * Initializes the feed processing.
 */
const init = async () => {
  try {
    await processAllFeeds();
    saveCache();
  } catch (error) {
    console.error(`[ error ] Failed during feed processing: ${error.message}`);
  }
};

init();
