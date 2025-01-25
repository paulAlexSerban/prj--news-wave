//@ts-check
const { logo, githubLogo } = require("./_logos.js");
/**
 * @param {string} title
 * @param {string} repoUrl
 * @return {string}
 */

const headerMarkup = (title, repoUrl) => {
  return `
<header class="row p-3 bg-dark text-white">
    <a href="/" class="col-1 d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
    ${logo()}
    </a>
    <h2 class="col-10 d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">${title}</h2>
    
    <a href="${repoUrl}" class="col-1 d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none justify-content-end">
    ${githubLogo()}
    </a>
</header>
`;
};

module.exports = {
  headerMarkup,
};
