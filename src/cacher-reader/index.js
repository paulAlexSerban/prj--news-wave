//@ts-check

const fs = require("fs");
const path = require("path");
const config = require("../config.js");

const cachePath = config.paths.cache;

/**
 * Reads the content of a file as a stream and returns the parsed JSON data.
 * @param {string} filePath - Path to the file.
 * @returns {Promise<any>} Parsed JSON data or an empty array if the file is empty.
 */
const readFileAsJson = (filePath) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath, "utf-8");
    let fileContent = "";

    readStream.on("data", (chunk) => {
      fileContent += chunk;
    });

    readStream.on("end", () => {
      console.log(`[ info ] Parsing ${path.basename(filePath)}`);
      console.log(`[ info ] ${fileContent.length} bytes`);
      if (fileContent.length < 10) {
        return resolve([]);
      }
      try {
        resolve(JSON.parse(fileContent));
      } catch (err) {
        reject(
          new Error(`Failed to parse JSON from ${filePath}: ${err.message}`)
        );
      }
    });

    readStream.on("error", (error) => {
      reject(error);
    });
  });
};

/**
 * Processes all files in a directory sequentially and reads their content as JSON.
 * @param {string} directory - Path to the directory.
 * @returns {Promise<any[]>} An array of parsed JSON data from the files.
 */
const processFilesInDirectory = async (directory) => {
  const allData = [];
  try {
    const files = await fs.promises.readdir(directory);
    for (const file of files) {
      const filePath = path.resolve(directory, file);
      try {
        const data = await readFileAsJson(filePath);
        allData.push(data);
      } catch (err) {
        console.error(`[ error ] Error processing file ${file}:`, err.message);
      }
    }
  } catch (err) {
    throw new Error(`Failed to read directory ${directory}: ${err.message}`);
  }
  return allData;
};

/**
 * Main function to read and parse all cache files.
 * @returns {Promise<any[]>} An array of parsed JSON data from the cache files.
 */
const readCacheFiles = async () => {
  try {
    return await processFilesInDirectory(cachePath);
  } catch (err) {
    console.error(`[ error ] Failed to read cache files:`, err.message);
    throw err;
  }
};

module.exports = {
  readCacheFiles,
};
