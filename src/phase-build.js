//@ts-check
const fs = require("fs");

const config = require("./config.js");
const { readCacheFiles } = require("./cacher-reader/index.js");
const { generateHTML } = require("./html-generator/index.js");

const { dist } = config.paths;

const init = async () => {
  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist);
  }
  try {
    const cacheFilesJson = await readCacheFiles();
    await generateHTML(cacheFilesJson);
  } catch (error) {
    console.error(`[ error ] ${error}`);
  }
};

init();
