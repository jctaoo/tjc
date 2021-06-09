const { installDependency } = require("./packageConfig");
const { writeFile } = require("./utils");

const baseRollupConfig = (isBrowser, outDir) =>
`
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sourcemap from "rollup-plugin-sourcemaps";
import json from "@rollup/plugin-json";

/** @type {import('rollup').RollupOptions} */
const config = {
  input: "./src/index.js",
  output: [
    ${
      isBrowser
        ? `
      {
        file: "${outDir}/main.umd.js",
        name: camelCase("testLibrary"),
        format: "umd",
        sourcemap: true,
      },
    `.trim()
        : ""
    }
    { file: "${outDir}/main.js", exports: 'auto', format: "commonjs", sourcemap: true },
    { file: "${outDir}/module.js", format: 'esm', sourcemap: true },
  ],
  plugins: [json(), commonjs(), resolve(), sourcemap()],
};

export default config;
`.trim();

const typeScriptBaseRollupConfig = (isBrowser, declaration, outDir) =>
  `
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sourcemap from "rollup-plugin-sourcemaps";
import json from "@rollup/plugin-json";
import camelCase from "lodash.camelcase";
import typescript from "@rollup/plugin-typescript";

/** @type {import('rollup').RollupOptions} */
const config = {
  input: "./src/index.ts",
  output: [
    ${
      isBrowser
        ? `
      {
        file: "${outDir}/main.umd.js",
        name: camelCase("testLibrary"),
        format: "umd",
        sourcemap: true,
      },
    `.trim()
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
 */
function configureRollup(useTypeScript, isBrowser, outDir, declaration) {
  installDependency("rollup", true);
  installDependency("@rollup/plugin-commonjs", true);
  installDependency("@rollup/plugin-json", true);
  installDependency("@rollup/plugin-node-resolve", true);
  installDependency("rollup-plugin-sourcemaps", true);

  const rollupConfig = useTypeScript
    ? baseRollupConfig(isBrowser, outDir)
    : typeScriptBaseRollupConfig(isBrowser, declaration, outDir);

  writeFile("rollup.config.js", JSON.stringify(rollupConfig));

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
