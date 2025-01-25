//@ts-check
const { slugify } = require("../../utils/index.js");
/**
 * @param {string} content
 * @param {boolean} active
 * @param {string} id
 * @return {string}
 */

const panelMarkup = (content, active = false, id = "") => {
  return `
        <div class="tab-pane fade ${active ? "show active" : ""}" 
             id="nav-${slugify(id)}" 
             role="tabpanel" 
             aria-labelledby="nav-${slugify(id)}-tab" 
             tabindex="0">
          ${content ? content : ""}
        </div>
      `;
};

module.exports = {
  panelMarkup,
};