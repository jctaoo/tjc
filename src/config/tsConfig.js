// TODO: inject useful comments for tsconfig

const baseCompilerOptions = {
  incremental: true,
  rootDir: ".",
  moduleResolution: "node",
  inlineSourceMap: true,
  esModuleInterop: true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,
  resolveJsonModule: true /* Include modules imported with .json extension. */,

  strict: true /* Enable all strict type-checking options. */,

  /* Strict Type-Checking Options */
  // "noImplicitAny": true /* Raise error on expressions and declarations with an implied 'any' type. */,
  // "strictNullChecks": true /* Enable strict null checks. */,
  // "strictFunctionTypes": true /* Enable strict checking of function types. */,
  // "strictPropertyInitialization": true /* Enable strict checking of property initialization in classes. */,
  // "noImplicitThis": true /* Raise error on 'this' expressions with an implied 'any' type. */,
  // "alwaysStrict": true /* Parse in strict mode and emit "use strict" for each source file. */,

  /* Additional Checks */
  noUnusedLocals: false /* Report errors on unused locals. */,
  noUnusedParameters: false /* Report errors on unused parameters. */,
  noImplicitReturns: true /* Report error when not all code paths in function return a value. */,
  noFallthroughCasesInSwitch: true /* Report errors for fallthrough cases in switch statement. */,

  /* Debugging Options */
  traceResolution: false /* Report module resolution log messages. */,
  listEmittedFiles: false /* Print names of generated files part of the compilation. */,
  listFiles: false /* Print names of files part of the compilation. */,
  pretty: true /* Stylize errors and messages using color and context. */,

  /* Experimental Options */
  // "experimentalDecorators": true /* Enables experimental support for ES7 decorators. */,
  // "emitDecoratorMetadata": true /* Enables experimental support for emitting type metadata for decorators. */,

  lib: ["es2020"],
  typeRoots: ["node_modules/@types"],
};

/**
 * ### example
 * ```
 *  "target": "es2017",
 *  "module": "commonjs",
 * ```
 *
 * @param {string} target
 * @param {string} module
 */
function getBaseTypeScriptConfig(target, module) {
  return {
    compilerOptions: {
      ...baseCompilerOptions,
      ...{
        target,
        module,
      },
    },
    include: ["./src/**/*"],
    exclude: ["node_modules/**"],
    compileOnSave: false,
  };
}

/**
 * ### example
 * ```
 *  "target": "es2017",
 *  "module": "commonjs",
 * ```
 *
 * @param {string} target
 * @param {string} module
 */
function getMonoTypeScriptConfig(target, module) {
  return {
    extends: "../../tsconfig.json",
    compilerOptions: {
      ...baseCompilerOptions,
      ...{
        target,
        module,
      },
    },
    include: ["./src/**/*"],
    exclude: ["node_modules/**"],
    compileOnSave: false,
  };
}

function getModuleTypeScriptConfig() {
  return {
    extends: "./tsconfig.json",
    compilerOptions: {
      target: "esnext",
      outDir: "build/module",
      module: "esnext",
    },
    exclude: ["node_modules/**"],
  };
}

function configureLib(config, outDir, declaration) {
  const { compilerOptions } = config;
  if (!typeof compilerOptions === "object") {
    return;
  }
  return {
    ...config,
    compilerOptions: {
      ...compilerOptions,
      outDir,
      declaration: !!declaration,
      declarationDir: "./types",
    },
  };
}

function configureBrowser(config) {
  const { compilerOptions } = config;
  if (!typeof compilerOptions === "object") {
    return;
  }
  /** @type array */
  const oldLib = compilerOptions.lib ?? [];
  const lib = [...oldLib, "DOM", "DOM.Iterable"];
  return {
    ...config,
    compilerOptions: {
      ...compilerOptions,
      lib: Array.from(new Set(lib).values()),
    },
  };
}

function configureNodejs(config) {
  const { compilerOptions } = config;
  if (!typeof compilerOptions === "object") {
    return;
  }
  /** @type array */
  const oldTypes = compilerOptions.types ?? [];
  const types = [...oldTypes, "node"];
  return {
    ...config,
    compilerOptions: {
      ...compilerOptions,
      types: Array.from(new Set(types).values()),
    },
  };
}

function configureJest(config) {
  const { compilerOptions } = config;
  if (!typeof compilerOptions === "object") {
    return;
  }
  /** @type array */
  const oldTypes = compilerOptions.lib ?? [];
  const types = [...oldTypes, "jest"];
  return {
    ...config,
    compilerOptions: {
      ...compilerOptions,
      types: Array.from(new Set(types).values()),
    },
  };
}

function configureRollup(config) {
  const { compilerOptions } = config;
  if (!typeof compilerOptions === "object") {
    return;
  }
  return {
    ...config,
    compilerOptions: {
      ...compilerOptions,
      incremental: undefined,
      module: undefined,
    },
  };
}

module.exports.getBaseTypeScriptConfig = getBaseTypeScriptConfig;
module.exports.getMonoTypeScriptConfig = getMonoTypeScriptConfig;
module.exports.getModuleTypeScriptConfig = getModuleTypeScriptConfig;
module.exports.configureLib = configureLib;
module.exports.configureBrowser = configureBrowser;
module.exports.configureJest = configureJest;
module.exports.configureNodejs = configureNodejs;
module.exports.configureRollup = configureRollup;
