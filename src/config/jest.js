const { FrontEndFramework } = require("../enums");
const { writeFile } = require("./utils");
const { installDependency } = require("./packageConfig");

/**
 * @param {boolean} vueSfc
 */
function getJestConfig(vueSfc) {
  return vueSfc
    ? {
        preset: "@vue/cli-plugin-unit-jest/presets/typescript",
        transform: {
          "^.+\\.vue$": "vue-jest",
        },
      }
    : {
        preset: "ts-jest",
        testEnvironment: "node",
      };
}

/**
 * @param {boolean} useTypeScript
 * @param {boolean} isBrowser
 * @param {FrontEndFramework} frontEndFramework
 */
function configureJest(useTypeScript, isBrowser, frontEndFramework) {
  let jestConfig = getJestConfig(false);

  installDependency("jest", true);

  if (useTypeScript) {
    installDependency("@types/jest", true);
    installDependency("ts-jest", true);
  }

  if (isBrowser) {
    if (frontEndFramework) {
      switch (frontEndFramework) {
        case FrontEndFramework.REACT: {
          installDependency("@testing-library/jest-dom", true);
          installDependency("@testing-library/user-event", true);
          installDependency("@testing-library/react", true);
          break;
        }
        case FrontEndFramework.VUE2: {
          installDependency("@vue/cli-plugin-unit-jest", true);
          installDependency("@vue/test-utils", true);
          installDependency("vue-jest", true);
          jestConfig = getJestConfig(true);
          break;
        }
        case FrontEndFramework.VUE3: {
          installDependency("@vue/cli-plugin-unit-jest", true);
          installDependency("@vue/test-utils@next", true);
          installDependency("vue-jest", true);
          jestConfig = getJestConfig(true);
          break;
        }
      }
    } else {
      installDependency("@testing-library/jest-dom", true);
      installDependency("@testing-library/user-event", true);
    }
  }

  writeFile("jest.config.json", JSON.stringify(jestConfig, null, 2));
}

module.exports.configureJest = configureJest;
