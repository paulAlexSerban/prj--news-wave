//@ts-check
/**
 * @param {string} date
 * @param {string} author
 * @return {string}
 */
const footerMarkup = (date, author) => {
  return `
<footer class="row d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <p class="col-10 mb-0 text-muted">© Developed and maintained by ${author} | <a class="text-muted" href="https://paulserban.eu">paulserben.eu</a></p>
    <p class="col-2 mb-0 text-muted justify-content-end">Updated: ${date} </p>
</footer>
`;
};

module.exports = {
  footerMarkup,
};
