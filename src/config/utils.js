const {ConfigCenter} = require("../configCenter");
const { join } = require("path");
const {
  lstatSync,
  readdirSync,
  appendFileSync,
  existsSync,
  writeFileSync: fsWriteFileSync,
} = require("fs");

// TODO:
// TODO: use this https://github.com/toptal/gitignore

/**
 * @returns {string}
 */
function getProjectEntry() {
  return join(process.cwd(), ConfigCenter.shard.projectName);
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
  return fsWriteFileSync(path, content, {});
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

/**
 * @param {string} raw
 * @returns {boolean}
 */
function validEmailString(raw) {
  const regex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return regex.test(raw);
}

module.exports.getProjectEntry = getProjectEntry;
module.exports.writeFile = writeFile;
module.exports.addGitIgnorePattern = addGitIgnorePattern;
module.exports.checkProjectEntry = checkProjectEntry;
module.exports.validEmailString = validEmailString;
