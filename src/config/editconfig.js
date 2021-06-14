const { writeFile } = require("./utils");

/**
 * @param {number} indent
 * @return {string}
 */
const template = (indent) => `
root = true

[*]
indent_style = space
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
max_line_length = 100
indent_size = ${indent}

[*.md]
trim_trailing_whitespace = false
`.trim();

/**
 * @param {number} indent
 */
function configureEditorConfig(indent) {
  writeFile(".editorconfig", template(indent));
}

module.exports.configureEditorConfig = configureEditorConfig;
