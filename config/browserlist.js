const { addPackageConfigField } = require("./packageConfig");

function configureBrowserList() {
  addPackageConfigField("browserlist", {
    production: [">0.2%", "not dead", "not op_mini all"],
    development: [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version",
    ],
  });
}

module.exports.configureBrowserList = configureBrowserList;
