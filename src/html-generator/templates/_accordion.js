//@ts-check
const { slugify } = require("../../utils/index.js");
const { itemMarkup } = require("./_list-item.js");


/**
 * @param {string} title 
 * @param {string} parentId 
 * @param {string} items 
 * @returns 
 */

const accordionItemMarkup = (title, parentId, items) => `
  <div class="accordion-item">
    <h2 class="accordion-header">
    <button class="accordion-button collapsed" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#target-${slugify(title)}" 
            aria-expanded="false" 
            aria-controls="collapseTwo">
      ${title}
    </button>
    </h2>
    <div id="target-${slugify(
      title
    )}" class="accordion-collapse collapse" data-bs-parent="#accordion-${parentId}">
      <div class="accordion-body">
        <ul class="list-group list-group-flush">${items}</ul>
      </div>
    </div>
  </div>
`;

const accordionMarkup = (type, feedObj) => {
  const accordionItems = [];
  Object.keys(feedObj).forEach((key) => {
    const { items } = feedObj[key];
    const accItem = accordionItemMarkup(
      key,
      slugify(type),
      items.map(itemMarkup).join("")
    );
    console.log(`[ info ] ${key} has ${items.length} items`);
    accordionItems.push(accItem);
  });

  return `<div class="accordion" id="accordion-${slugify(type)}">
    ${accordionItems.join("")}
    </div>`;
};
module.exports = {
  accordionMarkup,
};
