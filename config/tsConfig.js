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

function configureLib(config, outDir, declaration) {
  const { baseCompilerOptions } = config;
  if (!typeof baseCompilerOptions === "object") {
    return;
  }
  return {
    ...config,
    baseCompilerOptions: {
      ...baseCompilerOptions,
      outDir,
      declaration: !!declaration,
    },
  };
}

function configureBrowser(config) {
  const { baseCompilerOptions } = config;
  if (!typeof baseCompilerOptions === "object") {
    return;
  }
  /** @type array */
  const oldLib = baseCompilerOptions.lib ?? [];
  const lib = [...oldLib, "DOM", "DOM.Iterable"];
  return {
    ...config,
    baseCompilerOptions: {
      ...baseCompilerOptions,
      types: new Set(lib).values,
    },
  };
}

function configureNodejs(config) {
  const { baseCompilerOptions } = config;
  if (!typeof baseCompilerOptions === "object") {
    return;
  }
  /** @type array */
  const oldTypes = baseCompilerOptions.lib ?? [];
  const types = [...oldTypes, "node"];
  return {
    ...config,
    baseCompilerOptions: {
      ...baseCompilerOptions,
      types: new Set(types).values,
    },
  };
}

function configureJest(config) {
  const { baseCompilerOptions } = config;
  if (!typeof baseCompilerOptions === "object") {
    return;
  }
  /** @type array */
  const oldTypes = baseCompilerOptions.lib ?? [];
  const types = [...oldTypes, "jest"];
  return {
    ...config,
    baseCompilerOptions: {
      ...baseCompilerOptions,
      types: new Set(types).values,
    },
  };
}

function configureMonorepo(config) {
  if (!typeof config === "object") {
    return;
  }
  return {
    ...config,
    include: undefined,
  };
}

exports.getBaseTypeScriptConfig = getBaseTypeScriptConfig;
exports.getMonoTypeScriptConfig = getMonoTypeScriptConfig;
exports.configureLib = configureLib;
exports.configureBrowser = configureBrowser;
exports.configureJest = configureJest;
exports.configureMonorepo = configureMonorepo;
exports.configureNodejs = configureNodejs;
