const { installDependency, addScript } = require("./packageConfig");
const { writeFile } = require("./utils");

function getPrettierIgnoreContent() {
  return `# package.json is formatted by package managers, so we ignore it here
  package.json`;
}

/**
 * @param {string} sourceCodePath
 */
function configurePrettier(sourceCodePath) {
  installDependency("prettier", true);
  addScript("fix:prettier", `prettier \"${sourceCodePath}\" --write`);
  addScript("test:prettier", `prettier \"${sourceCodePath}\" --list-different`);

  writeFile(".prettierignore", getPrettierIgnoreContent());
}

module.exports.configurePrettier = configurePrettier;
