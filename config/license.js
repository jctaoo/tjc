const { getLicenseContent } = require("../githubApi");
const { writeFile } = require("./utils");

/**
 * @param {string} key license key from GitHub Api
 * @param {string} author
 */
async function configureLicense(key, author) {
  const content = await getLicenseContent(key, author);

  if (!!content) {
    writeFile("LICENSE", content);
  }

  return;
}

module.exports.configureLicense = configureLicense;
