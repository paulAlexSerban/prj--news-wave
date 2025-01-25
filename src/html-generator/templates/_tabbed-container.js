//@ts-check
const { slugify } = require("../../utils/index.js");
const { accordionMarkup } = require("./_accordion.js");
/**
 * @param {Array} panelsData
 * @returns {string}
 */
const tabbedContainerMarkup = (panelsData = []) => {
  const tabs = panelsData.map((panel, index) => {
    const { type } = panel;
    return `<button
                      class="nav-link ${index === 0 ? "active" : ""}"
                      id="nav-${slugify(type)}-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-${slugify(type)}"
                      type="button"
                      role="tab"
                      aria-controls="nav-${slugify(type)}"
                      aria-selected="${index === 0 ? "true" : "false"}">${type}
                      </button>`;
  });

  const panels = panelsData.map((panel, index) => {
    const { type, feed } = panel;

    return `<div class="tab-pane fade ${index === 0 ? "show active" : ""}"
                 id="nav-${slugify(type)}"
                 role="tabpanel"
                 aria-labelledby="nav-${slugify(type)}-tab"
                 tabindex="0">
              ${accordionMarkup(type, feed)}
            </div>
          `;
  });

  return `<nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          ${tabs.join("")}
        </div>
      </nav>
        <div class="tab-content" id="nav-tabContent">
          ${panels.join("")}
      </div>
    `;
};

module.exports = {
  tabbedContainerMarkup,
};
