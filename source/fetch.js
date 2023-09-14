const path = require('path');
const fs = require('fs');
const Parser = require('rss-parser');
const utils = require('./utils');
const { createFile } = utils;
const parser = new Parser();

const source = process.argv[2];

const sourcesPath = path.resolve(__dirname, `sources`, `${source}.json`);
const cachePath = path.resolve(__dirname, '..', 'cache', `${source}-cache.json`);

const sources = JSON.parse(fs.readFileSync(sourcesPath));
const cache = JSON.parse(fs.readFileSync(cachePath));

const fetchRSS = async (url) => {
    try {
        const feed = await parser.parseURL(url);
        return feed;
    } catch (error) {
        console.log({ error });
    }
};

const sortItems = (feed) => {
    Object.keys(feed).forEach((key) => {
        const { items } = feed[key];
        const itemsWithDate = items.filter((item) => item.lastBuildDate || item.pubDate || item.isoDate);
        feed[key].items = itemsWithDate.sort((a, b) => {
            const aDate = new Date(a.lastBuildDate || a.pubDate || a.isoDate);
            const bDate = new Date(b.lastBuildDate || b.pubDate || b.isoDate);
            return bDate - aDate;
        });
    })

    return feed;
};

const init = async () => {
    const promises = [];
    const { sections } = sources;
    sections.forEach((section) => {
        const { items } = section;
        items.forEach((item) => {
            promises.push(fetchRSS(item.url).then((feed) => ({ [item.title]: feed  })));
        });
    });

    Promise.all(promises).then((feeds) => {
        feeds.forEach((feed) => {

            cache.type = sections[0].title;
            cache.feed = {
                ...cache.feed,
                ...sortItems(feed),
            }

            const cacheString = JSON.stringify(cache, null, 2);
            createFile(cachePath, cacheString);
        });
    });
};

init();
