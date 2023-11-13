const fs = require('fs');
const path = require('path');
const template = require('./templates');
const utils = require('./utils');
const config = require('./config.js');

const { createFile, getDate } = utils;

const {
    documentMarkup,
    headMarkup,
    headerMarkup,
    footerMarkup,
    mainMarkup,
    sectionMarkup,
    tabbedContainerMarkup,
} = template;

const dist = path.resolve(__dirname, '..', 'dist');
const cachePath = path.resolve(__dirname, '..', 'cache');
const date = getDate();

const readCacheFiles = () => {
    return new Promise(async (resolve, reject) => {
      let allData = [];
      try {
        const files = await fs.promises.readdir(cachePath);
        const readStreamPromises = files.map((file) => {
          return new Promise((res, rej) => {
            const filePath = path.resolve(cachePath, file);
            const readStream = fs.createReadStream(filePath, 'utf-8');
            let fileContent = "";
  
            readStream.on('data', (chunk) => {
              fileContent += chunk;
            });
  
            readStream.on('end', () => {
              console.log(`[ info ] Parsing ${file}`);
              console.log(`[ info ] ${fileContent.length} bytes`);
              if(fileContent.length < 10) {
                return res([]);
              }
              res(JSON.parse(fileContent));
            });
  
            readStream.on('error', (error) => {
              rej(error);
            });
          });
        });
  
        allData = await Promise.all(readStreamPromises);
      } catch (error) {
        reject(error);
      }
  
      resolve(allData);
    });
  };

const generateHTML = async (data = []) => {
    console.log(`[ info ] Generating HTML`);
    console.log(`[ info ] ${data.length} panels`);
    const head = headMarkup(config.title);
    const header = headerMarkup(config.title, config.repo);
    const tabbedContainer = tabbedContainerMarkup(data);

    const section = sectionMarkup(tabbedContainer);
    const main = mainMarkup(section);
    const footer = footerMarkup(date, config.author);
    const document = documentMarkup(head, header, main, footer);
    createFile(path.resolve(dist, 'index.html'), document);
};

const mainFunction = async () => {
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

mainFunction();
