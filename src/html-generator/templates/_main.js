//@ts-check
/**
 * @param {string} sections
 * @return {string}
 */

const mainMarkup = (sections) =>
    sections
      ? `
  <main class="row mt-5">
    <div class="col">  ${sections}</div>
  </main>`
      : "";

module.exports = {
    mainMarkup,
    };