//@ts-check
/**
 * @param {string} children
 * @return {string}
 */
const sectionMarkup = (children) => {
  return `
  <section class="row mt-4">
    ${children}
  </section>
`;
};
module.exports = {
  sectionMarkup,
};
