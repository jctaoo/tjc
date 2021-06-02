const axios = require("axios").default;

const github = axios.create({
  baseURL: "https://api.github.com/",
  headers: { Accept: "application/vnd.github.v3+json" },
});

async function getAllLicenses(defaultId) {
  const result = await github.get("/licenses");
  let list = [];
  let defaultName;

  if (result.status === 200 && Array.isArray(result.data)) {
    list = result.data.map((item) => item["name"]);
    if (defaultId) {
      defaultName = result.data.find((item) => item["key"] === defaultId)?.name;
    }
  }

  return {
    defaultName,
    list,
  };
}

module.exports = { getAllLicenses };
