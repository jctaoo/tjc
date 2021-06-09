const {
  installDependency,
  addScript,
  addPackageConfigField,
} = require("./packageConfig");
const { configureRollup } = require("./rollup");
const {
  getMonoTypeScriptConfig,
  getBaseTypeScriptConfig,
  configureLib,
  configureJest,
  configureMonorepo,
  configureBrowser,
  configureNodejs,
  getModuleTypeScriptConfig,
} = require("./tsConfig");
const { writeFile } = require("./utils");
const { join } = require("path");

/**
 * @enum {Symbol}
 */
const ScriptBuildType = {
  ROLLUP: Symbol("rollup"),
  TSC: Symbol("TSC"),
};

/**
 * @enum {Symbol}
 */
const ScriptLanguage = {
  TYPE_SCRIPT: Symbol("typescript"),
  JAVA_SCRIPT: Symbol("javascript"),
};

/**
 * @callback configureLibFunc
 * @param {string} outDir
 * @param {boolean} declaration
 */
/**
 * @callback configureScriptConfig If call neither configureBrowser nor configureNodejs, the default options will be nodejs.
 * @param {Object} config tsconfig / jsconfig
 * @param {{
 *  configureLib: configureLibFunc,
 *  configureBrwoser: () => void,
 *  configureJest: () => void,
 *  configureMonorepo: () => void,
 *  configureNodejs: () => void,
 * }} configureFunctions
 * @returns {Object} your script config
 */
/**
 * @param {ScriptBuildType} buildType
 * @param {ScriptLanguage} scriptLanguage
 * @param {{ target: string, module: string }} scriptConfigOptions
 * @param {configureScriptConfig} configureScriptConfig
 */
function configureBuild(
  buildType,
  scriptLanguage,
  scriptConfigOptions,
  configureScriptConfig
) {
  const useTypeScript = scriptLanguage === ScriptLanguage.TYPE_SCRIPT;

  // configure script config (tsconfig / jsconfig)
  const { module, target } = scriptConfigOptions;
  const baseConfig = isMonorepo
    ? getMonoTypeScriptConfig(target, module)
    : getBaseTypeScriptConfig(target, module);
  let configOutDir;
  let isBrowser = false;
  let isNode = false;

  const userScriptConfig = configureScriptConfig(baseConfig, {
    configureLib: (outDir, declaration) => {
      configOutDir = outDir;
      configureLib(baseConfig, outDir, declaration);
    },
    configureBrwoser: () => {
      isBrowser = true;
      configureBrowser.bind(null, baseConfig);
    },
    configureNodejs: () => {
      isNode = true;
      configureNodejs.bind(null, baseConfig);
    },
    configureJest: configureJest.bind(null, baseConfig),
    configureMonorepo: configureMonorepo.bind(null, baseConfig),
  });
  const userScriptConfigContent = JSON.stringify(userScriptConfig);

  if (useTypeScript) {
    installDependency("typescript", true);
    writeFile("tsconfig.module.json", JSON.stringify(getModuleTypeScriptConfig()));
    writeFile("tsconfig.json", userScriptConfigContent);
  } else {
    writeFile("jsconfig.json", userScriptConfigContent); // jsconfig is tsconfig. Just see ms's docs
  }

  // configure build command
  isNode = !isBrowser && !isNode ? true : isNode;

  if (buildType === ScriptBuildType.ROLLUP) {
    // TODO: outDir may be undefined
    configureRollup(useTypeScript, isBrowser, outDir, useTypeScript);
    // assuming main is ${outdir}/main.js (commonjs)
    addPackageConfigField("main", join(outDir, "main.js"));
    addPackageConfigField("module", join(outDir, "module.js"));
    if (useTypeScript)
      addPackageConfigField("typings", join(outDir, "types/src/index.d.ts"));

    addScript("build", "rollup -c rollup.config.js");
    addScript("watch:build", "rollup -c rollup.config.js -w");
  } else if (useTypeScript && buildType === ScriptBuildType.TSC) {
    // assuming main is ${outdir}/main/src/index.js (commonjs)
    addPackageConfigField("main", join(outDir, "main/src/index.js"));
    addPackageConfigField("module", join(outDir, "module/src/index.js"));
    addPackageConfigField("typings", join(outDir, "main/src/index.d.ts"));

    addScript("build", "tsc -p tsconfig.json");
    addScript("watch:build", "tsc -p tsconfig.module.json -w");
  }
}

module.exports.configureTypeScript = configureBuild;
