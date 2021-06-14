const { spawn } = require("child_process");
const fs = require("fs");
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
    author: `${author} <${email}>`,
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
 * @param {Array<string>} args
 */
async function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const cp = spawn(command, args, {
      cwd: getProjectEntry(),
      shell: true,
      stdio: "inherit",
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
 * @return {Promise<void>}
 */
async function installAllDependencies(packageUtil) {
  const installDependencies = dependencies
    .filter((i) => !i.isDev)
    .map((i) => i.name);
  const installDevDependencies = dependencies
    .filter((i) => i.isDev)
    .map((i) => i.name);

  const installSubCommand =
    packageUtil === "yarn" || packageUtil === "pnpm" ? "add" : "install";
  const installDevFlag =
    packageUtil === "yarn" || packageUtil === "pnpm" ? "-D" : "--save-dev";

  if (installDependencies.length > 0) {
    await runCommand(packageUtil, [installSubCommand, ...installDependencies]);
  }
  if (installDevDependencies.length > 0) {
    await runCommand(packageUtil, [
      installSubCommand,
      ...installDevDependencies,
      installDevFlag,
    ]);
  }
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
  const packageConfig = getBasePackageJson(...Object.values(options));
  for (const item of packageConfigFields) {
    packageConfig[item.key] = item.config;
  }
  for (const script of scripts) {
    packageConfig["scripts"][script.key] = script.content;
  }

  // TODO: Json prettier
  writeFile("package.json", JSON.stringify(packageConfig, null, 2));

  // await installAllDependencies(packageUtil);
}

module.exports.installDependency = installDependency;
module.exports.addScript = addScript;
module.exports.addPackageConfigField = addPackageConfigField;
module.exports.commitWorks = commitWorks;
