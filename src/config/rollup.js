const camelCase = require("lodash.camelcase");
const { installDependency } = require("./packageConfig");
const { writeFile } = require("./utils");

const baseRollupConfig = (isBrowser, outDir, libraryName) =>
  `
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sourcemap from "rollup-plugin-sourcemaps";
import json from "@rollup/plugin-json";

/** @type {import('rollup').RollupOptions} */
const config = {
  input: "./src/index.js",
  output: [${
    isBrowser
      ? `
    {
      file: "${outDir}/main.umd.js",
      name: ${camelCase(libraryName)},
      format: "umd",
      sourcemap: true,
    },`
      : ""
  }
    { file: "${outDir}/main.js", exports: 'auto', format: "commonjs", sourcemap: true },
    { file: "${outDir}/module.js", format: 'esm', sourcemap: true },
  ],
  plugins: [json(), commonjs(), resolve(), sourcemap()],
};

export default config;
`.trim();

const typeScriptBaseRollupConfig = (
  isBrowser,
  declaration,
  outDir,
  libraryName
) =>
  `
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sourcemap from "rollup-plugin-sourcemaps";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";

/** @type {import('rollup').RollupOptions} */
const config = {
  input: "./src/index.ts",
  output: [${
    isBrowser
      ? `
      {
        file: "${outDir}/main.umd.js",
        name: ${camelCase(libraryName)},
        format: "umd",
        sourcemap: true,
    },`
      : ""
  }
    { file: "${outDir}/main.js", exports: 'auto', format: "commonjs", sourcemap: true },
    { file: "${outDir}/module.js", format: 'esm', sourcemap: true },
  ],
  plugins: [
    json(),
    typescript({ tsconfig: "./tsconfig.json" }),
    commonjs(),
    resolve(),
    sourcemap(),
  ],
};

export default config;
`.trim();

/**
 * Only browser library or node application / library can use rollup config.
 *
 * @param {boolean} useTypeScript
 * @param {boolean} isBrowser
 * @param {string} outDir
 * @param {boolean} declaration
 * @param {string} libraryName
 */
function configureRollup(
  useTypeScript,
  isBrowser,
  outDir,
  declaration,
  libraryName
) {
  installDependency("rollup", true);
  installDependency("@rollup/plugin-commonjs", true);
  installDependency("@rollup/plugin-json", true);
  installDependency("@rollup/plugin-node-resolve", true);
  installDependency("rollup-plugin-sourcemaps", true);

  const rollupConfig = useTypeScript
    ? baseRollupConfig(isBrowser, outDir, libraryName)
    : typeScriptBaseRollupConfig(isBrowser, declaration, outDir, libraryName);

  writeFile("rollup.config.js", rollupConfig);

  installDependency("rollup", true);
  installDependency("rollup-plugin-sourcemaps", true);
  installDependency("@rollup/plugin-commonjs", true);
  installDependency("@rollup/plugin-json", true);
  installDependency("@rollup/plugin-node-resolve", true);
  if (useTypeScript) {
    installDependency("@rollup/plugin-typescript", true);
  }
}

module.exports.configureRollup = configureRollup;
