const utils = require('./utils');
const { slugify, getDate } = utils;

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
  <div id="target-${slugify(title)}" class="accordion-collapse collapse" data-bs-parent="#accordion-${parentId}">
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
        const accItem = accordionItemMarkup(key, slugify(type), items.map(itemMarkup).join(''));
        accordionItems.push(accItem);
    });

    return `  <div class="accordion" id="accordion-${slugify(type)}">
    ${accordionItems.join('')}
    </div>`;
};

const sectionMarkup = (children) => `
  <section class="row mt-4">
    ${children}
  </section>
`;

const itemMarkup = (item) => {
    const { title, link, pubDate, isoDate, lastBuildDate  } = item;
    const publishDate = new Date(pubDate || isoDate || lastBuildDate);
    const day = publishDate.getDate();
    const month = publishDate.getMonth() + 1;
    const year = publishDate.getFullYear();
    const isToday = new Date(publishDate).toDateString() === new Date().toDateString();
    return `
<li class="list-group-item d-flex justify-content-between">
    <a class="${
        isToday ? `link-primary` : 'link-info'
    }" rel="noopener" target="_blank" href="${link}" title="${title}">${title}</a>
    <time datetime="${publishDate}" class="ps-2 small">${day}-${month}-${year}</time>
 </li>
`;
};

const headMarkup = (title) => `
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="A place to check news that I am interested in.">
  <title>${title}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" 
        rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" 
        crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" 
          integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" 
          crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" 
          integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+" 
          crossorigin="anonymous"></script>
</head>`;

const logo = () =>
    `
<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" width="50" height="50" class="fs-3">
  <path fill="#ffffff" d="M168 80c-13.3 0-24 10.7-24 24V408c0 8.4-1.4 16.5-4.1 24H440c13.3 0 24-10.7 24-24V104c0-13.3-10.7-24-24-24H168zM72 480c-39.8 0-72-32.2-72-72V112C0 98.7 10.7 88 24 88s24 10.7 24 24V408c0 13.3 10.7 24 24 24s24-10.7 24-24V104c0-39.8 32.2-72 72-72H440c39.8 0 72 32.2 72 72V408c0 39.8-32.2 72-72 72H72zM176 136c0-13.3 10.7-24 24-24h96c13.3 0 24 10.7 24 24v80c0 13.3-10.7 24-24 24H200c-13.3 0-24-10.7-24-24V136zm200-24h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H376c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 80h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H376c-13.3 0-24-10.7-24-24s10.7-24 24-24zM200 272H408c13.3 0 24 10.7 24 24s-10.7 24-24 24H200c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 80H408c13.3 0 24 10.7 24 24s-10.7 24-24 24H200c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/>
</svg>
`;

const githubLogo = () => `
<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" width="50" height="50" class="fs-3">
 <path fill="#ffffff" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM277.3 415.7c-8.4 1.5-11.5-3.7-11.5-8 0-5.4.2-33 .2-55.3 0-15.6-5.2-25.5-11.3-30.7 37-4.1 76-9.2 76-73.1 0-18.2-6.5-27.3-17.1-39 1.7-4.3 7.4-22-1.7-45-13.9-4.3-45.7 17.9-45.7 17.9-13.2-3.7-27.5-5.6-41.6-5.6-14.1 0-28.4 1.9-41.6 5.6 0 0-31.8-22.2-45.7-17.9-9.1 22.9-3.5 40.6-1.7 45-10.6 11.7-15.6 20.8-15.6 39 0 63.6 37.3 69 74.3 73.1-4.8 4.3-9.1 11.7-10.6 22.3-9.5 4.3-33.8 11.7-48.3-13.9-9.1-15.8-25.5-17.1-25.5-17.1-16.2-.2-1.1 10.2-1.1 10.2 10.8 5 18.4 24.2 18.4 24.2 9.7 29.7 56.1 19.7 56.1 19.7 0 13.9.2 36.5.2 40.6 0 4.3-3 9.5-11.5 8-66-22.1-112.2-84.9-112.2-158.3 0-91.8 70.2-161.5 162-161.5S388 165.6 388 257.4c.1 73.4-44.7 136.3-110.7 158.3zm-98.1-61.1c-1.9.4-3.7-.4-3.9-1.7-.2-1.5 1.1-2.8 3-3.2 1.9-.2 3.7.6 3.9 1.9.3 1.3-1 2.6-3 3zm-9.5-.9c0 1.3-1.5 2.4-3.5 2.4-2.2.2-3.7-.9-3.7-2.4 0-1.3 1.5-2.4 3.5-2.4 1.9-.2 3.7.9 3.7 2.4zm-13.7-1.1c-.4 1.3-2.4 1.9-4.1 1.3-1.9-.4-3.2-1.9-2.8-3.2.4-1.3 2.4-1.9 4.1-1.5 2 .6 3.3 2.1 2.8 3.4zm-12.3-5.4c-.9 1.1-2.8.9-4.3-.6-1.5-1.3-1.9-3.2-.9-4.1.9-1.1 2.8-.9 4.3.6 1.3 1.3 1.8 3.3.9 4.1zm-9.1-9.1c-.9.6-2.6 0-3.7-1.5s-1.1-3.2 0-3.9c1.1-.9 2.8-.2 3.7 1.3 1.1 1.5 1.1 3.3 0 4.1zm-6.5-9.7c-.9.9-2.4.4-3.5-.6-1.1-1.3-1.3-2.8-.4-3.5.9-.9 2.4-.4 3.5.6 1.1 1.3 1.3 2.8.4 3.5zm-6.7-7.4c-.4.9-1.7 1.1-2.8.4-1.3-.6-1.9-1.7-1.5-2.6.4-.6 1.5-.9 2.8-.4 1.3.7 1.9 1.8 1.5 2.6z"/>
</svg>
`;

const headerMarkup = (title, repoUrl) => `
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

const footerMarkup = (date, author) => `
<footer class="row d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <p class="col-10 mb-0 text-muted">© Developed and maintained by ${author} | <a class="text-muted" href="https://paulserban.eu">paulserben.eu</a></p>
    <p class="col-2 mb-0 text-muted justify-content-end">Updated: ${date} </p>
</footer>
`;

const mainMarkup = (sections) =>
    sections
        ? `
<main class="row mt-5">
  <div class="col">  ${sections}</div>
</main>`
        : '';

const documentMarkup = (head, header, main, footer) =>
    `<!DOCTYPE html>
  <html lang="en">
  ${head}
    <body class="container">
      ${header}
      ${main}
      ${footer}
    </body>
  </html>
  `;

const panelMarkup = (content, active = false, id = '') => {
    return `
      <div class="tab-pane fade ${active ? 'show active' : ''}" 
           id="nav-${slugify(id)}" 
           role="tabpanel" 
           aria-labelledby="nav-${slugify(id)}-tab" 
           tabindex="0">
        ${content ? content : ''}
      </div>
    `;
};

const tabbedContainerMarkup = (panelsData = []) => {
    const tabs = panelsData.map((panel, index) => {
        const { type } = panel;
        return `<button
                    class="nav-link ${index === 0 ? 'active' : ''}"
                    id="nav-${slugify(type)}-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-${slugify(type)}"
                    type="button"
                    role="tab"
                    aria-controls="nav-${slugify(type)}"
                    aria-selected="${index === 0 ? 'true' : 'false'}">${type}
                    </button>`;
    });

    const panels = panelsData.map((panel, index) => {
        const { type, feed } = panel;
        return `<div class="tab-pane fade ${index === 0 ? 'show active' : ''}"
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
        ${tabs.length != 0 ? tabs.join('') : ''}
      </div>
    </nav>
      <div class="tab-content" id="nav-tabContent">
        ${panels.length != 0 ? panels.join('') : ''}
    </div>
  `;
};

module.exports = {
    documentMarkup,
    headMarkup,
    headerMarkup,
    footerMarkup,
    mainMarkup,
    sectionMarkup,
    accordionMarkup,
    accordionItemMarkup,
    itemMarkup,
    tabbedContainerMarkup,
    panelMarkup,
};
