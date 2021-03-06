const inquirer = require("inquirer");
const { getAllLicenses } = require("./githubApi");
const { gitUsername, gitUserEmail } = require("./readGitConfig");
const fs = require("fs");
const path = require("path");
const {ScriptLanguage} = require("./enums");
const {ScriptBuildType} = require("./enums");
const {FrontEndFramework} = require("./enums");
const { createDirectory } = require("./config/utils");
const { configureJest } = require("./config/jest");
const { configureReadme } = require("./config/readme");
const { configureESLint } = require("./config/eslint");
const { getTemplateCode } = require("./getTemplateCode");
const { configureGitHook } = require("./config/gitHook");
const { configureVersionManage } = require("./config/versionManage");
const { configurePrettier } = require("./config/prettier");
const { configureLicense } = require("./config/license");
const { ConfigCenter } = require("./configCenter");
const { configureEditorConfig } = require("./config/editconfig");
const { validEmailString, getProjectEntry } = require("./config/utils");
const { configureBrowserList } = require("./config/browserlist");
const { commitWorks } = require("./config/packageConfig");
const {
  configureBuild,
} = require("./config/build");

// ## Todolist: Setup new project.
// - [ ]
//
// # TODO: bin in package.json
// # TODO: prettier json
// TODO: rolllup question
// TODO: ci
// TODO: Jest
// TODO: jsx vue compoennt
// TODO: post css
// TODO: 支持前端组件库
// TODO：测试模版
// TODO: e2e
// TODO: ssr
// TODO: path alias
// TODO: wasm

async function main() {
  const answers = await inquirer.prompt([
    {
      name: "name",
      validate(input) {
        const isValid = /^[a-zA-Z\-\_\w]+$/.test(input);
        if (!isValid) {
          return "请输入仅包含 a-z，A-Z, 0-9, 中划线和下划线的项目名";
        }
        return isValid;
      },
      type: "input",
      message: "📦 给新项目起个名字",
    },
    {
      name: "description",
      type: "input",
      message: "💬 简短介绍你的项目",
    },
    {
      name: "gitRepositoryUrl",
      type: "input",
      message: "🚛 Git 仓库地址",
      validate(input) {
        const isValid =
          /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b[-a-zA-Z0-9@:%_\+.~#?&//=]*/.test(
            input
          );
        if (!isValid) {
          return "请填写合法的 URL";
        }
        return isValid;
      },
    },
    {
      name: "isOpensource",
      type: "confirm",
      message: "🍺 是开源项目吗",
    },
    {
      type: "list",
      name: "license",
      message: "📖 要使用什么开源协议?",
      ...(() => {
        const allLicenses = getAllLicenses("mit");
        return {
          choices() {
            const done = this.async();
            allLicenses.then(({ data }) => {
              done(null, Array.from(data.keys()));
            });
          },
          default() {
            const done = this.async();
            allLicenses.then(({ defaultName }) => {
              done(null, defaultName);
            });
          },
          filter(input) {
            const done = this.async();
            allLicenses.then(({ data }) => {
              done(null, data.get(input));
            });
          },
        };
      })(),
      loop: true,
      when(questions) {
        return questions.isOpensource;
      },
    },
    {
      type: "input",
      name: "author",
      message: "👩 作者的大名",
      default() {
        const done = this.async();
        gitUsername().then((name) => {
          if (name) {
            done(null, name);
          } else {
            done(null, undefined);
          }
        });
      },
      validate(input, questions) {
        if (questions.license && !input) {
          return "由于要填充 license，你必须填写 author 字段";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "email",
      message: "📮 作者的邮箱",
      default() {
        const done = this.async();
        gitUserEmail().then((email) => {
          if (email) {
            done(null, email);
          } else {
            done(null, undefined);
          }
        });
      },
      validate(input) {
        if (!!input) {
          return validEmailString(input);
        }
        return true;
      },
    },
    {
      name: "type",
      type: "list",
      message: "⚙️ 是 Application 还是 Library",
      choices: ["Application", "Library"],
    },
    {
      name: "outDir",
      type: "input",
      message: "🚥 你的 Library 的输出路径是 ?",
      default: "./dist",
      when(questions) {
        return questions.type === "Library";
      },
    },
    {
      name: "env",
      type: "list",
      message: "⚙️ 是浏览器还是 Node.js",
      choices: ["浏览器", "Node.js"],
    },
    {
      name: "useTest",
      type: "confirm",
      message: "🔧 要启用单元测试(jest)吗?",
    },
    {
      name: "useE2e",
      type: "confirm",
      message: "🔧 要启用 e2e 测试(jest)吗?",
      when: (questions) => questions.useTest,
    },
    {
      name: "useTs",
      type: "confirm",
      message: "🏎️ 要使用 TypeScript 吗",
    },
    {
      message: "🎁 要使用的包管理工具",
      name: "packageUtil",
      type: "list",
      choices: ["npm", "pnpm", "yarn", "cnpm"],
    },
    {
      message: "⚙️ 要是用 EditorConfig 吗?",
      name: "useEditorConfig",
      type: "confirm",
    },
    {
      message: "🏷️ 选择你喜欢的缩紧空格数",
      name: "indent",
      type: "list",
      choices: [2, 4, 8],
      when: (questions) => questions.name,
    },
    { message: "🪝 要使用 GitHook 吗?", name: "useGitHook", type: "confirm" },
    {
      message: "🌈 要是用 prettier 来美化代码吗?",
      name: "usePrettier",
      type: "confirm",
    },
    {
      message: "📰 要是用版本管理工具吗?",
      name: "useVersionManager",
      type: "confirm",
    },
    { message: "👀 要是用 ESLint 吗?", name: "useLint", type: "confirm" },
  ]);

  ConfigCenter.shard.projectName = answers.name;
  ConfigCenter.shard.indent = answers.indent;
  ConfigCenter.shard.decription = answers.description;

  if (!fs.existsSync(getProjectEntry())) {
    await fs.promises.mkdir(getProjectEntry());
  }

  configureReadme();

  const useBrowser = answers.env === "浏览器";
  const useNodejs = answers.env === "Node.js";
  const useTypeScript = answers.useTs;
  const isLibrary = answers.type === "Library";
  const useRollup = answers.buildUtil === 'rollup';

  // write source code
  await createDirectory("src");
  const code = await getTemplateCode(
    useNodejs ? "node" : "browser",
    isLibrary ? "lib" : "app",
    useTypeScript ? "ts" : "js"
  );
  const codeFileName = `index.${useTypeScript ? "ts" : "js"}`;
  await fs.promises.writeFile(
    path.join(getProjectEntry(), "src", codeFileName),
    code
  );

  // TODO: Support config rollup / tsc
  configureBuild(
    ScriptBuildType.ROLLUP,
    useTypeScript ? ScriptLanguage.TYPE_SCRIPT : ScriptLanguage.JAVA_SCRIPT,
    {
      target: "es2020",
      module: "esNext",
    },
    (
      config,
      { configureBrowser, configureJest, configureLib, configureNodejs }
    ) => {
      if (answers.useTest) configureJest();
      if (useBrowser) configureBrowser();
      if (isLibrary) configureLib(answers.outDir, true);
      if (useNodejs) configureNodejs();
    },
    answers.outDir,
    answers.useMonorepo,
    ConfigCenter.shard.projectName
  );

  if (useBrowser) {
    configureBrowserList();
  }

  if (answers.useEditorConfig) {
    configureEditorConfig(ConfigCenter.shard.indent);
  }

  if (answers.useGitHook) {
    // TODO
    configureGitHook("echo HH");
  }

  if (answers.useTest) {
    async function writeTestTemplate(directory) {
      await createDirectory(directory);
      const testCode = await getTemplateCode(
        useNodejs ? "node" : "browser",
        "test",
        useTypeScript ? "ts" : "js"
      );
      const testCodeFileName = `index.test.${useTypeScript ? "ts" : "js"}`;
      await fs.promises.writeFile(
        path.join(getProjectEntry(), directory, testCodeFileName),
        testCode
      );
    }
    configureJest(useTypeScript, useBrowser, answers.frontendFramework);
    await writeTestTemplate("test")
    if (answers.useE2e) {
      await writeTestTemplate("e2e")
    }
  }

  if (answers.useLint) {
    configureESLint(
      useBrowser,
      useTypeScript,
      [answers.outDir],
      answers.usePrettier,
      answers.frontendFramework
    );
  }

  if (answers.usePrettier) {
    configurePrettier("./src");
  }

  if (answers.isOpensource && answers.license) {
    await configureLicense(answers.license.key, answers.author);
  }

  if (answers.useVersionManager) {
    configureVersionManage();
  }

  await commitWorks(answers.packageUtil, {
    projectName: answers.projectName,
    description: answers.description,
    author: answers.author,
    email: answers.email,
    gitRepositoryUrl: answers.gitRepositoryUrl,
  });
}

main().then();
