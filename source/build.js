const fs = require('fs');
const path = require('path');
const template = require('./templates');
const utils = require('./utils');
const config = require('./config.js');
const { get } = require('http');
const { createFile, getDate } = utils;
const dist = path.resolve(__dirname, '..', 'dist');
const date = getDate();

const {
    documentMarkup,
    headMarkup,
    headerMarkup,
    footerMarkup,
    mainMarkup,
    sectionMarkup,
    accordionMarkup,
    accordionItemMarkup,
    itemMarkup,
    tabbedContainerMarkup,
    panelMarkup,
} = template;

const cachePath = path.resolve(__dirname, '..', 'cache');
const cacheFiles = fs.readdirSync(cachePath);

const cacheFilesJson = cacheFiles.map((file) => {
    const filePath = path.resolve(cachePath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
});

const getPanelsData = (data) => {
    return data;
};

const generateHTML = (data = []) => {
    const head = headMarkup(config.title);
    const header = headerMarkup(config.title, config.repo);
    const panels = getPanelsData(data);
    const tabbedContainer = tabbedContainerMarkup(panels);
    const section = sectionMarkup(tabbedContainer);
    const main = mainMarkup(section);
    const footer = footerMarkup(date, config.author);
    const document = documentMarkup(head, header, main, footer);
    createFile(path.resolve(dist, 'index.html'), document);
};

generateHTML(cacheFilesJson);
