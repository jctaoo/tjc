const {writeFile} = require("./utils");
const {installDependency} = require("./packageConfig");

const jestConfig = {
  "preset": "ts-jest",
  "testEnvironment": "node"
}

function configureJest(useTypeScript) {
  installDependency("jest", true);

  if (useTypeScript) {
    installDependency("@types/jest", true);
    installDependency("ts-jest", true)
  }

  writeFile("jest.config.json", JSON.stringify(jestConfig, null, 2));
}

module.exports.configureJest = configureJest;
