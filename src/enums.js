/**
 * @enum {Symbol}
 */
module.exports.FrontEndFramework = {
  REACT: Symbol("react"),
  VUE2: Symbol("vue2"),
  VUE3: Symbol("vue3")
};

/**
 * @enum {Symbol}
 */
const ScriptBuildType = {
  ROLLUP: Symbol("rollup"),
  TSC: Symbol("TSC"),
};

/**
 * @enum {Symbol}
 */
const ScriptLanguage = {
  TYPE_SCRIPT: Symbol("typescript"),
  JAVA_SCRIPT: Symbol("javascript"),
};

module.exports.ScriptBuildType = ScriptBuildType;
module.exports.ScriptLanguage = ScriptLanguage;
