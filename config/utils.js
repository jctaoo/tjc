const { join } = require("path");
const {
  lstatSync,
  readdirSync,
  appendFileSync,
  existsSync,
  writeFile,
} = require("fs");

/**
 * @param {string} projectName
 * @returns {string}
 */
function getProjectEntry(projectName) {
  return join(process.cwd(), projectName);
}

/**
 * @param {string} projectName
 * @returns {boolean}
 */
function checkProjectEntry(projectName) {
  const entry = getProjectEntry(projectName);
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
 * @param {string} projectName
 */
function addGitIgnorePattern(list, description, projectName) {
  const entry = getProjectEntry(projectName);
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
