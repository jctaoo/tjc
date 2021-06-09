// TODO: USING TESING-LIBRARY

const { installDependency, addScript } = require("./packageConfig");
const { writeFile } = require("./utils");

const eslintConfig = {
  root: true,
  env: {
    es6: true,
  },
  ignorePatterns: ["node_modules"],
  plugins: ["import", "eslint-comments"],
  extends: ["eslint:recommended", "plugin:eslint-comments/recommended"],
  globals: {
    BigInt: true,
    console: true,
    WebAssembly: true,
  },
  rules: {
    "eslint-comments/disable-enable-pair": [
      "error",
      {
        allowWholeFile: true,
      },
    ],
    "eslint-comments/no-unused-disable": "error",
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
        },
      },
    ],
    "sort-imports": [
      "error",
      {
        ignoreDeclarationSort: true,
        ignoreCase: true,
      },
    ],
  },
};

const eslintConfigTS = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  env: {
    es6: true,
  },
  ignorePatterns: ["node_modules"],
  plugins: ["import", "eslint-comments"],
  extends: [
    "eslint:recommended",
    "plugin:eslint-comments/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
  ],
  globals: {
    BigInt: true,
    console: true,
    WebAssembly: true,
  },
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "eslint-comments/disable-enable-pair": [
      "error",
      {
        allowWholeFile: true,
      },
    ],
    "eslint-comments/no-unused-disable": "error",
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
        },
      },
    ],
    "sort-imports": [
      "error",
      {
        ignoreDeclarationSort: true,
        ignoreCase: true,
      },
    ],
  },
};

/**
 * @param {boolean} isBrowser
 * @param {boolean} isTypeScript
 * @param {Array<string>} ignorePatterns
 * @param {boolean} usingPrettier
 */
function getESLintConfig(
  isBrowser,
  isTypeScript,
  ignorePatterns,
  usingPrettier
) {
  const config = isTypeScript ? eslintConfigTS : eslintConfig;

  config.env[isBrowser ? "brwoser" : "node"] = true;
  config.ignorePatterns = [
    ...new Set([...config.ignorePatterns, ...ignorePatterns]),
  ];

  if (usingPrettier) {
    config.extends.push("prettier");
    if (isTypeScript) {
      config.extends.push("prettier/@typescript-eslint");
    }
  }

  return config;
}

/**
 * @param {boolean} isBrowser
 * @param {boolean} isTypeScript
 * @param {Array<string>} ignorePatterns
 * @param {boolean} usingPrettier
 */
function configureESLint(
  isBrowser,
  isTypeScript,
  ignorePatterns,
  usingPrettier
) {
  const config = getESLintConfig(...arguments);
  const content = JSON.stringify(config);

  installDependency("eslint", true);
  installDependency("eslint-plugin-eslint-comments", true);
  installDependency("eslint-plugin-import", true);

  if (usingPrettier) {
    installDependency("eslint-config-prettier", true);
  }

  if (isTypeScript) {
    installDependency("@typescript-eslint/eslint-plugin", true);
    installDependency("@typescript-eslint/parser", true);
  }

  addScript("fix:lint", "eslint src --ext .ts,.js,tsx,.jsx --fix");
  addScript("test:lint", "eslint src --ext .ts,.js,tsx,.jsx");

  writeFile(".eslintrc.json", content);
}

module.exports.configureESLint = configureESLint;
