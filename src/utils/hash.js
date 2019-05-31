const crypto = require("crypto");

module.exports = {
  getGuid: () => crypto.randomBytes(16).toString("hex")
};
