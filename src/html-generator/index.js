//@ts-check
const path = require("path");
const templates = require("./templates/index.js");
const config = require("../config.js");
const { createFile } = require("../utils/index.js");
const { dist } = config.paths;
const { date } = config;

const {
  documentMarkup,
  headMarkup,
  headerMarkup,
  footerMarkup,
  mainMarkup,
  sectionMarkup,
  tabbedContainerMarkup,
} = templates;

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

  await createFile(path.resolve(dist, "index.html"), document);
};

module.exports = {
  generateHTML,
};
