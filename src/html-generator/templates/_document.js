//@ts-check
/**
 * @param {string} head 
 * @param {string} header 
 * @param {string} main 
 * @param {string} footer 
 * @return {string}
 */
const documentMarkup = (head, header, main, footer) => {
  return `
  <!DOCTYPE html>
    <html lang="en">
    ${head}
      <body class="container">
        ${header}
        ${main}
        ${footer}
      </body>
    </html>
  `;
};

module.exports = {
  documentMarkup
}