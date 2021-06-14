const { join } = require("path");
const fs = require("fs");

/**
 * @param {string} platform
 * @param {string} type
 * @param {string} language
 */
async function getTemplateCode(platform, type, language) {
  const templateFileName = `template.${platform}.${type}.${language}.txt`;
  const path = join(__dirname, "template", templateFileName);

  return fs.promises.readFile(path);
}

module.exports.getTemplateCode = getTemplateCode;
