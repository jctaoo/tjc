const { spawn } = require("child_process");
const { join } = require("path");
const { writeFile, getProjectEntry } = require("./utils");

const dependencies = [];
const scripts = [];
const packageConfigFields = [];

/**
 * @param {string} name
 * @param {boolean} isDev
 */
function installDependency(name, isDev) {
  dependencies.push({
    isDev,
    name,
  });
}

/**
 * @param {string} name
 * @param {string} script
 */
function addScript(name, script) {
  scripts.push({ key: name, content: script });
}

/**
 * @param {string} key
 * @param {string} config
 */
function addPackageConfigField(key, config) {
  packageConfigFields.push({ key, config });
}

function getBasePackageJson(
  projectName,
  description,
  author,
  email,
  gitRepositoryUrl
) {
  return {
    name: projectName,
    version: "0.0.0",
    description: description,
    keywords: [],
    author: `${author} <${email}?`,
    repository: {
      type: "git",
      url: gitRepositoryUrl,
    },
    // TODO: here
    engines: {
      node: ">=12.0.0",
    },
    scripts: {},
  };
}

/**
 * @param {string} command
 */
async function runCommand(command) {
  return new Promise((resolve, reject) => {
    const cp = spawn(installCmd);
    cp.stderr.on("data", (data) => {
      console.error(data.toString());
    });
    cp.stdout.on("data", (data) => {
      console.log(data.toString());
    });
    cp.on("exit", function (code, signal) {
      console.log(
        "child process exited with" + `code ${code} and signal ${signal}`
      );
      resolve();
    });
  });
}

/**
 * @param {"npm" | "yarn" | "pnpm" | "cnpm"} packageUtil
 * @param {{
 *   projectName: string,
 *   description: string,
 *   author: string,
 *   email: string,
 *   gitRepositoryUrl: string
 * }} options
 */
async function commitWorks(packageUtil, options) {
  const installDependencies = dependencies.filter((i) => !i.isDev).join(" ");
  const installCmd =
    packageUtil === "yarn" || packageUtil === "pnpm"
      ? `${packageUtil} add ${installDependencies}`
      : `${packageUtil} install ${installDependencies} --save`;

  const installDevDependencies = dependencies.filter((i) => i.isDev).join(" ");
  const installDevCmd =
    packageUtil === "yarn" || packageUtil === "pnpm"
      ? `${packageUtil} add ${installDevDependencies} -D`
      : `${packageUtil} install ${installDevDependencies} --save-dev`;

  if (!!installDependencies) await runCommand(installCmd);
  if (!!installDevDependencies) await runCommand(installDevCmd);

  const packageConfig = getBasePackageJson(...Object.values(options));
  for (const item of packageConfigFields) {
    packageConfig[item.key] = item.config;
  }
  for (const script of scripts) {
    packageConfig["scripts"][script.key] = script.content;
  }

  // TODO: Json prettier
  const packageConfigPath = join(getProjectEntry(), "package.json");
  writeFile(packageConfigPath, JSON.stringify(packageConfig));
}

module.exports.installDependency = installDependency;
module.exports.addScript = addScript;
module.exports.addPackageConfigField = addPackageConfigField;
module.exports.commitWorks = commitWorks;
