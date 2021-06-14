const {writeFile} = require("./utils");
const { addPackageConfigField } = require("./packageConfig");

const browserListRc = `
[production]
> 0.2%
not dead
not op_mini all

[modern]
last 1 chrome version
last 1 firefox version
last 1 safari version

[ssr]
node 12
`.trim();

function configureBrowserList() {
  writeFile(".browserslistrc", browserListRc);
}

module.exports.configureBrowserList = configureBrowserList;
