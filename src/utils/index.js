//@ts-check

const fs = require("fs");

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

function createFile(fileName, data) {
  try {
    fs.writeFileSync(fileName, data);
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

const getDate = () => {
  const dateObj = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  return `${dateObj.day} / ${dateObj.month} / ${dateObj.year}`;
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
      .sort((a, b) => {
        const lastBuildDateA = a.lastBuildDate || a.pubDate || a.isoDate;
        const lastBuildDateB = b.lastBuildDate || b.pubDate || b.isoDate;
        return (
          new Date(lastBuildDateB).getTime() -
          new Date(lastBuildDateA).getTime()
        );
      });
  });
  return feed;
};

const MAX_ITEMS = 100;
const MIN_ITEMS = 10;
const TWO_WEEKS_IN_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Filters items that are within the last week and limits the items to a range.
 * @param {Object} feed - RSS feed object.
 * @returns {Object} Feed with filtered items.
 */
const keepOnlyLastWeekItems = (feed) => {
  const lastWeek = new Date(Date.now() - TWO_WEEKS_IN_MS);
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

module.exports = {
  slugify,
  createFile,
  getDate,
  sortItems,
  keepOnlyLastWeekItems,
  cleanItemsContent
};
