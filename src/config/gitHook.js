const {installDependency} = require("./packageConfig");
const { addPackageConfigField } = require("./packageConfig.js");

/**
 * @param {string} preCommitCommand
 */
function configureGitHook(preCommitCommand) {
  installDependency("yorkie", true);
  addPackageConfigField("gitHooks", {
    "pre-commit": preCommitCommand,
  });
}

module.exports.configureGitHook = configureGitHook;
