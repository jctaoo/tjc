const { join } = require("path");
const {
  lstatSync,
  readdirSync,
  appendFileSync,
  existsSync,
  writeFile,
} = require("fs");
const { getProjectName } = requrie("../index.js");

/**
 * @returns {string}
 */
function getProjectEntry() {
  return join(process.cwd(), getProjectName());
}

/**
 * @returns {boolean}
 */
function checkProjectEntry() {
  const entry = getProjectEntry();
  return lstatSync(entry).isDirectory() && readdirSync(entry).length === 0;
}

/**
 * @param {string} name
 * @param {string} content
 */
function writeFile(name, content) {
  const path = join(getProjectEntry(), name);
  return writeFile(path, content);
}

/**
 * @param {Array<string>} list list of gitignroe patterns
 * @param {string} description
 */
function addGitIgnorePattern(list, description) {
  const entry = getProjectEntry();
  const ignoreFilePath = join(entry, ".gitignore");

  const content = `\n${description.trim()}\n${list.join("\n")}`;

  if (existsSync(ignoreFilePath)) {
    appendFileSync(ignoreFilePath, content);
  } else {
    writeFile(".gitignore", content.trim());
  }
}

module.exports.getProjectEntry = getProjectEntry;
module.exports.writeFile = writeFile;
module.exports.addGitIgnorePattern = addGitIgnorePattern;
module.exports.checkProjectEntry = checkProjectEntry;
