const { addPackageConfigField } = requrie("./packageConfig.js");

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
