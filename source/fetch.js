const path = require('path');
const fs = require('fs');
const Parser = require('rss-parser');
const utils = require('./utils');
// const { createFile } = utils;
const parser = new Parser();

// const source = process.argv[2];

// const sourcesPath = path.resolve(__dirname, `sources`, `${source}.json`);
// const cachePath = path.resolve(__dirname, '..', 'cache', `${source}-cache.json`);

// const sources = JSON.parse(fs.readFileSync(sourcesPath));
// const cache = JSON.parse(fs.readFileSync(cachePath));

const fetchRSS = async (url) => {
    try {
        const feed = await parser.parseURL(url);
        return feed;
    } catch (error) {
        console.log({ error });
    }
};

const sortItems = (feed) => {
    const derivedFeed = { ...feed };
    const { items } = derivedFeed;
    items.forEach((key) => {
        const itemsWithDate = items.filter((item) => item.lastBuildDate || item.pubDate || item.isoDate);
        derivedFeed.items = itemsWithDate.sort((a, b) => {
            const aDate = new Date(a.lastBuildDate || a.pubDate || a.isoDate);
            const bDate = new Date(b.lastBuildDate || b.pubDate || b.isoDate);
            return bDate - aDate;
        });
    });

    return derivedFeed;
};

const keepOnlyLastWeekItems = (feed) => {
    const week = 7 * 24 * 60 * 60 * 1000;
    const now = new Date();
    const lastWeek = new Date(now.getTime() - week);
    const derivedFeed = { ...feed };
    const prevItemsState = [...derivedFeed.items];
    derivedFeed.items = derivedFeed.items.filter((item) => item.lastBuildDate || item.pubDate || item.isoDate);
    derivedFeed.items = derivedFeed.items.filter((item) => {
        const itemDate = new Date(item.lastBuildDate || item.pubDate || item.isoDate);
        return itemDate > lastWeek;
    });
    if (derivedFeed.items.length < 5) {
        derivedFeed.items = prevItemsState.slice(0, 5);
    }

    if (derivedFeed.items.length > 10) {
        derivedFeed.items = derivedFeed.items.slice(0, 10);
    }

    return derivedFeed;
};

const cleanItemsContent = (feed) => {
    const derivedFeed = { ...feed };
    const { items } = derivedFeed;
    items.forEach((item) => {
        feed[key].items = items.map((item) => {
            return {
                ...item,
                content: '',
                'content:encoded': '',
                contentSnippet: '',
                'content:encodedSnippet': '',
                summary: '',
            };
        });
    });

    return derivedFeed;
};

const getSources = () => {
    const sourcePath = path.resolve(__dirname, `sources`, `v2.json`);
    const sourcesJSON = fs.readFileSync(sourcePath);
    const sources = JSON.parse(sourcesJSON);
    return sources;
};

const init = async () => {
    const promises = [];
    const sources = getSources();
    sources.forEach((source) => {
        promises.push(
            fetchRSS(source.feed_url).then((feed) => {
                console.log(`[ info ] Fetched ${source.title}`);
                console.log(`[ info ] ${source.title} has ${feed?.items?.length} items`);
                const date = new Date();
                return {
                    ...source,
                    feed,
                    date,
                };
            })
        );
    });

    const feedCache = await Promise.all(promises).then((feeds) => {
        const feedCache = feeds.map((rawFeed) => {
            const feed = rawFeed.feed;
            const sortedItems = sortItems(feed);
            const lastWeekItems = keepOnlyLastWeekItems(sortedItems);
            const cleanContent = cleanItemsContent(lastWeekItems);
            return {
                ...rawFeed,
                feed: {
                    items: [...lastWeekItems.items],
                },
            };
        });
        return feedCache;
    });
    const feedCacheString = JSON.stringify(feedCache, null, 2);
    const feedCachePath = path.resolve(__dirname, '..', 'cache', `feed-cache.json`);
    fs.writeFileSync(feedCachePath, feedCacheString);

    // Promise.all(promises).then((feeds) => {
    //     feeds.forEach((feed) => {
    //         console.log(`[ info ] Generating ${feed.title}`);
    //         cache.type = sections[0].title;
    //         cache.feed = {
    //             ...cache.feed,
    //             ...cleanItemsContent(keepOnlyLastWeekItems(sortItems(feed))),
    //         };

    //         const cacheString = JSON.stringify(cache, null, 2);
    //         createFile(cachePath, cacheString);
    //     });
    // });
};

init();
