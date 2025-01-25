const utils = require("../../utils");
const { slugify, getDate } = utils;
const { logo, githubLogo } = require("./_logos");
const { accordionMarkup } = require("./_accordion");
const { headerMarkup } = require("./_header");
const { headMarkup } = require("./_head");
const { sectionMarkup } = require("./_section");
const { footerMarkup } = require("./_footer");
const { mainMarkup } = require("./_main");
const { documentMarkup } = require("./_document");
const { panelMarkup } = require("./_panel");
const { tabbedContainerMarkup } = require("./_tabbed-container");
const { itemMarkup } = require("./_list-item");




module.exports = {
  documentMarkup,
  headMarkup,
  headerMarkup,
  footerMarkup,
  mainMarkup,
  sectionMarkup,
  accordionMarkup,
  itemMarkup,
  tabbedContainerMarkup,
  panelMarkup,
};
