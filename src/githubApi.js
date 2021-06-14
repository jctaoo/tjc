// TODO: 参考 https://github.com/alexjoverm/typescript-library-starter/blob/master/package.json

const axios = require("axios").default;

const github = axios.create({
  baseURL: "https://api.github.com/",
  headers: { Accept: "application/vnd.github.v3+json" },
});

/**
 * @param {string} defaultId
 * @returns {Promise<{ 
 *    data: Map<
 *        string, 
 *        {
 *          key: string, 
 *          name: string, 
 *          spdx_id: string, 
 *          url: string, 
 *          node_id: string
 *        }
 *    >, 
 *    defaultName: string 
 * }>}
 */
async function getAllLicenses(defaultId) {
  const result = await github.get("/licenses");
  let data;
  let defaultName;

  if (result.status === 200 && Array.isArray(result.data)) {
    const entries = result.data.map((item) => [item.name, item]);
    data = new Map(entries);
    if (defaultId) {
      defaultName = result.data.find((item) => item["key"] === defaultId)?.name;
    }
  }
  
  return {
    defaultName,
    data,
  };
}

/**
 * @param {string} key license key from GitHub Api
 * @param {*} author
 */
async function getLicenseContent(key, author) {
  const result = await github.get(`/licenses/${key}`);

  if (result.status === 200) {
    /** @type {string} */
    const template = result.data.body ?? "";

    if (!!template) {
      return template
        .replace("[fullname]", author)
        .replace("[year]", new Date().getFullYear().toString());
    } else {
      return;
    }
  }

  return;
}

module.exports = { getAllLicenses, getLicenseContent };

getAllLicenses("mit")