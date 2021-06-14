const { FrontEndFramework } = require("../enums");
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

// TODO: Support jest env

/**
 * @param {boolean} isBrowser
 * @param {boolean} isTypeScript
 * @param {Array<string>} ignorePatterns
 * @param {boolean} usingPrettier
 * @param {FrontEndFramework} frontEndFramework
 */
function getESLintConfig(
  isBrowser,
  isTypeScript,
  ignorePatterns,
  usingPrettier,
  frontEndFramework
) {
  const config = isTypeScript ? eslintConfigTS : eslintConfig;

  config.env[isBrowser ? "browser" : "node"] = true;
  config.ignorePatterns = [
    ...new Set([...config.ignorePatterns, ...ignorePatterns]),
  ];

  if (usingPrettier) {
    config.extends.push("prettier");
    if (isTypeScript) {
      config.extends.push("prettier/@typescript-eslint");
    }
  }

  if (isBrowser) {
    switch (frontEndFramework) {
      case FrontEndFramework.REACT: {
        config.extends.push("plugin:react/recommended");
        break;
      }
      case FrontEndFramework.VUE2: {
        config.extends = [
          "plugin:vue/essential",
          "eslint:recommended",
          ...(isTypeScript ? ["@vue/typescript/recommended"] : []),
          ...(usingPrettier
            ? ["@vue/prettier", "@vue/prettier/@typescript-eslint"]
            : []),
        ];
        break;
      }
      case FrontEndFramework.VUE3: {
        config.extends = [
          "plugin:vue/vue3-essential",
          "eslint:recommended",
          ...(isTypeScript ? ["@vue/typescript/recommended"] : []),
          ...(usingPrettier
            ? ["@vue/prettier", "@vue/prettier/@typescript-eslint"]
            : []),
        ];
        break;
      }
    }
  }

  return config;
}

/**
 * @param {boolean} isBrowser
 * @param {boolean} isTypeScript
 * @param {Array<string>} ignorePatterns
 * @param {boolean} usingPrettier
 * @param {FrontEndFramework} frontEndFramework
 */
function configureESLint(
  isBrowser,
  isTypeScript,
  ignorePatterns,
  usingPrettier,
  frontEndFramework
) {
  const config = getESLintConfig(...arguments);
  const content = JSON.stringify(config, null, 2);

  if (isBrowser) {
    switch (frontEndFramework) {
      case FrontEndFramework.REACT: {
        installDependency("eslint-plugin-react", true);
        break;
      }
      case FrontEndFramework.VUE2:
      case FrontEndFramework.VUE3: {
        installDependency("eslint-plugin-vue", true);
        if (usingPrettier) {
          installDependency("@vue/eslint-config-prettier", true);
        }
        if (isTypeScript) {
          installDependency("@vue/eslint-config-typescript", true);
        }
        break;
      }
    }
  }
  installDependency("eslint", true);

  // TODO: Support vue
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
