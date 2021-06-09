/*
 * @Author: your name
 * @Date: 2021-06-05 13:05:08
 * @LastEditTime: 2021-06-06 23:36:02
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /typescript-project-starter/config/utils.js
 */
const { promises: fs } = require("fs");
const { join } = require("path");

/**
 * @returns {string}
 */
function getProjectEntry() {}

/**
 * @param {string} name
 * @param {string} content
 */
async function writeFile(name, content) {
  const path = join(getProjectEntry(), name);
  return fs.writeFile(path, content);
}

/**
 * @param {Array<string>} list list of gitignroe patterns 
 */
 function addGitIgnorePattern(list) {

}

module.exports.getProjectEntry = getProjectEntry;
module.exports.writeFile = writeFile;
module.exports.addGitIgnorePattern = addGitIgnorePattern;