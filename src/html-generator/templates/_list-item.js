//@ts-check
/**
 * @param {object} item
 * @return {string}
 */
const itemMarkup = (item) => {
  const { title, link, pubDate, isoDate, lastBuildDate } = item;

  const publishDate = new Date(pubDate || isoDate || lastBuildDate);
  const day = publishDate.getDate();
  const month = publishDate.getMonth() + 1;
  const year = publishDate.getFullYear();
  const isToday =
    new Date(publishDate).toDateString() === new Date().toDateString();

  return `
  <li class="list-group-item d-flex justify-content-between">
      <a class="link-secondary" rel="noopener" target="_blank" href="${link}" title="${title}">
        ${isToday ? `[ TODAY ] ` : ''}${title}
      </a>
      <time datetime="${publishDate}" class="ps-2 small">${day}-${month}-${year}</time>
   </li>
  `;
};

module.exports = { itemMarkup };
