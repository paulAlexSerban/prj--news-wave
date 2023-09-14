const path = require('path');
const fs = require('fs');
const Parser = require('rss-parser');
const parser = new Parser();

const source = process.argv[2];

const sourcesPath = path.resolve(__dirname, `sources`, `${source}.json`);
const cachePath = path.resolve(__dirname, '..', 'cache', `${source}-cache.json`);
const dist = path.resolve(__dirname, '..', 'dist');

const sources = JSON.parse(fs.readFileSync(sourcesPath));
const cache = JSON.parse(fs.readFileSync(cachePath));

const getDate = () => {
    const dateObj = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
    };

    return `${dateObj.day} / ${dateObj.month} / ${dateObj.year}`;
};

function createFile(fileName, data) {
    fs.writeFileSync(fileName, data);
}

const fetchRSS = async (url) => {
    try {
        const feed = await parser.parseURL(url);
        return feed;
    } catch (error) {
        console.log({ error });
    }
};

const getLastBuildDate = (feed) => {
    const { lastBuildDate, title, pubDate } = feed;

    const lastPublishedItemDate = feed.items[0].isoDate || feed.items[0].pubDate || feed.items[0].lastBuildDate;
    if (!lastBuildDate && !pubDate && !lastPublishedItemDate) {
        console.log('Error: lastBuildDate or pubDate or lastPublishedItemDate not found');
        return {
            lastBuildDate: null,
            title,
        };
    }

    return {
        lastBuildDate: lastBuildDate || pubDate || lastPublishedItemDate,
        title,
    };
};

const sortItems = (feed) => {
    const { items } = feed;
    const itemsWithDate = items.filter((item) => item.lastBuildDate || item.pubDate || item.isoDate);
    feed.items = itemsWithDate.sort((a, b) => {
        const aDate = new Date(a.lastBuildDate || a.pubDate || a.isoDate);
        const bDate = new Date(b.lastBuildDate || b.pubDate || b.isoDate);
        return bDate - aDate;
    });
    return feed;
};

const groupItemsByDate = (feed) => {
    const { items } = feed;
    const groupedItems = {};
    items.forEach((item) => {
        const date = new Date(item.lastBuildDate || item.pubDate || item.isoDate);
        const dateKey = date.toLocaleDateString('en-US', { timeZone: 'UTC' });
        if (!groupedItems[dateKey]) {
            groupedItems[dateKey] = [];
        }
        groupedItems[dateKey].push(item);
    });
    return groupedItems;
};

const init = async () => {
    const promises = [];
    const { sections } = sources;
    sections.forEach((section) => {
        const { items } = section;
        items.forEach((item) => promises.push(fetchRSS(item.url)));
    });

    Promise.all(promises).then((feeds) => {
        feeds.forEach((feed) => {
            if (!feed.items) {
                return;
            }
            const feedWithSortedItems = sortItems(feed);
            const lastBuildDateObj = getLastBuildDate(feedWithSortedItems);
            console.log(new Date(lastBuildDateObj.lastBuildDate));
            cache[lastBuildDateObj.title] = {
                lastBuildDate: new Date(lastBuildDateObj.lastBuildDate).toLocaleString('en-US', { timeZone: 'UTC' }),
                items: groupItemsByDate(feedWithSortedItems),
            };
            const cacheString = JSON.stringify(cache, null, 2);
            createFile(cachePath, cacheString);
        });
    });
};

init();
