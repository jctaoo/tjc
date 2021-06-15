const {ScriptBuildType} = require("../enums");
const {ScriptLanguage} = require("../enums");
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
  configureBrowser,
  configureNodejs,
  getModuleTypeScriptConfig,
} = require("./tsConfig");
const { writeFile } = require("./utils");
const { join } = require("path");

/**
 * @callback configureLibFunc
 * @param {string} outDir
 * @param {boolean} declaration
 */
/**
 * @callback VoidFunc
 */

/**
 * @callback configureScriptConfig If call neither configureBrowser nor configureNodejs, the default options will be nodejs.
 * @param {Object} config tsconfig / jsconfig
 * @param {{
 *  configureLib: configureLibFunc,
 *  configureBrowser: VoidFunc,
 *  configureJest: VoidFunc,
 *  configureNodejs: VoidFunc,
 * }} configureFunctions
 */
/**
 * @param {ScriptBuildType} buildType
 * @param {ScriptLanguage} scriptLanguage
 * @param {{ target: string, module: string }} scriptConfigOptions
 * @param {configureScriptConfig} configureScriptConfig
 * @param {string} outDir
 * @param {boolean} isMonoRepo
 * @param {string} libraryName
 */
function configureBuild(
  buildType,
  scriptLanguage,
  scriptConfigOptions,
  configureScriptConfig,
  outDir,
  isMonoRepo,
  libraryName
) {
  const useTypeScript = scriptLanguage === ScriptLanguage.TYPE_SCRIPT;

  // configure script config (tsconfig / jsconfig)
  const { module, target } = scriptConfigOptions;
  const baseConfig = isMonoRepo
    ? getMonoTypeScriptConfig(target, module)
    : getBaseTypeScriptConfig(target, module);
  let configOutDir;
  let isBrowser = false;
  let isNode = false;

  let tsConfig = baseConfig;

  configureScriptConfig(baseConfig, {
    configureLib: (outDir, declaration) => {
      configOutDir = outDir;
      tsConfig = configureLib(tsConfig, outDir, declaration);
    },
    configureBrowser: () => {
      isBrowser = true;
      tsConfig = configureBrowser(tsConfig);
    },
    configureNodejs: () => {
      isNode = true;
      tsConfig = configureNodejs(tsConfig);
    },
    configureJest: () => {
      configureJest(baseConfig);
    },
  });
  const userScriptConfig = tsConfig;
  const userScriptConfigContent = JSON.stringify(userScriptConfig, null, 2);

  if (useTypeScript) {
    installDependency("typescript", true);

    if (buildType === ScriptBuildType.TSC) {
      writeFile(
        "tsconfig.module.json",
        JSON.stringify(getModuleTypeScriptConfig(), null, 2)
      );
    }

    writeFile("tsconfig.json", userScriptConfigContent);
  } else {
    const jsConfig = {
      ...userScriptConfig,
      compilerOptions: {
        ...userScriptConfig.compilerOptions,
        incremental: undefined,
        traceResolution: undefined,
        typeRoots: undefined,
        types: undefined
      }
    };
    const jsConfigContent = JSON.stringify(jsConfig, null, 2)
    // jsconfig is tsconfig. Just see ms's docs
    writeFile("jsconfig.json", jsConfigContent);
  }

  // configure build command
  isNode = !isBrowser && !isNode ? true : isNode;

  if (buildType === ScriptBuildType.ROLLUP) {
    // TODO: outDir may be undefined
    configureRollup(
      useTypeScript,
      isBrowser,
      outDir,
      useTypeScript,
      libraryName
    );
    // assuming main is ${outdir}/main.js (commonjs)
    addPackageConfigField("main", join(outDir, "main.js"));
    addPackageConfigField("module", join(outDir, "module.js"));
    if (useTypeScript)
      addPackageConfigField("typings", join(outDir, "types/src/index.d.ts"));

    addScript("build", "rollup -c rollup.config.js");
    addScript("build:watch", "rollup -c rollup.config.js -w");
  } else if (useTypeScript && buildType === ScriptBuildType.TSC) {
    // assuming main is ${outdir}/main/src/index.js (commonjs)
    addPackageConfigField("main", join(outDir, "main/src/index.js"));
    addPackageConfigField("module", join(outDir, "module/src/index.js"));
    addPackageConfigField("typings", join(outDir, "main/src/index.d.ts"));

    addScript("build", "tsc -p tsconfig.json");
    addScript("build:watch", "tsc -p tsconfig.module.json -w");
  }
}

module.exports.configureBuild = configureBuild;
