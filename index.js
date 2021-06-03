const inquirer = require("inquirer");
const { getAllLicenses } = require("./githubApi");
const { gitUsername } = require("./readGitConfig");

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
            allLicenses.then(({ list }) => {
              done(null, list);
            });
          },
          default() {
            const done = this.async();
            allLicenses.then(({ defaultName }) => {
              done(null, defaultName);
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
      name: "useMonorepo",
      type: "confirm",
      message: "🌲 要使用 monorepo (lerna) 来管理项目吗",
    },
    {
      name: "type",
      type: "list",
      message: "⚙️  是 Application 还是 Library",
      choices: ["Application", "Library"],
    },
    {
      name: "env",
      type: "list",
      message: "⚙️  是浏览器还是 Node.js",
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
      name: "usTs",
      type: "confirm",
      message: "🏎️  要使用 TypeScript 吗",
    },
  ]);

  console.log(answers);
}

main().then();
