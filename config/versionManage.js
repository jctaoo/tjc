const { installDependency, addScript } = require("../packageConfig");

function configureVersionManage() {
  // TODO: show tip for first release
  // # npm run script
  // npm run release -- --first-release
  // # global bin
  // standard-version --first-release
  // # npx
  // npx standard-version --first-release
  installDependency("standard-version", true);
  addScript("version:major", "standard-version -r major");
  addScript("version:minor", "standard-version -r minor");
  addScript("version:patch", "standard-version -r patch");
  addScript("version:pre", "standard-version --prerelease");
  addScript("version:alpha", "standard-version --prerelease alpha");
}

module.exports.configureVersionManage = configureVersionManage;
