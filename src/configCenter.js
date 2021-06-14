class ConfigCenter {
  static shard = new ConfigCenter();

  /**
   * @type string
   * @private
   */
  #_projectName;

  /**
   * @type number
   * @private
   */
  #_indent;

  /**
   * @type string
   * @private
   */
  #_decription;

  get projectName() {
    return this.#_projectName;
  }

  set projectName(value) {
    this.#_projectName = value;
  }

  get indent() {
    return this.#_indent;
  }

  set indent(value) {
    this.#_indent = value;
  }

  get decription() {
    return this.#_decription;
  }

  set decription(value) {
    this.#_decription = value;
  }
}

module.exports.ConfigCenter = ConfigCenter;
