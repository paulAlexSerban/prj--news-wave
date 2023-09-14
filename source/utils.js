const fs = require('fs');

const slugify = (text) => {
  return text.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
};

function createFile(fileName, data) {
  fs.writeFileSync(fileName, data);
}

const getDate = () => {
  const dateObj = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
  };

  return `${dateObj.day} / ${dateObj.month} / ${dateObj.year}`;
};

module.exports = {
  slugify,
  createFile,
  getDate,
}