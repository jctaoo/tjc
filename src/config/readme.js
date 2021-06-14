const {writeFile} = require("./utils");
const { ConfigCenter } = require("../configCenter");

function configureReadme() {
  const readmeContent = `
# ${ConfigCenter.shard.projectName}

${ConfigCenter.shard.decription}
  `.trim();

  writeFile("README.md", readmeContent);
}

module.exports.configureReadme = configureReadme;
