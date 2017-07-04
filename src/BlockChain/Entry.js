var { createHash } = require("../Crypto/Hash");
var { cloneKeys, toHashableValue } = require("../util");
var User = require("./User");

const HASH_KEYS = ["applicationName", "method", "values", "publicKey"];

module.exports = {
  create(applicationName, method, values, user){
    var ret = {};
    ret.applicationName = applicationName;
    ret.method = method;
    ret.values = values;
    ret.publicKey = user.publicKey;

    ret.hash = createHash(toHashableValue(cloneKeys(HASH_KEYS, ret)));
    ret.signature = User.signHash(user, ret.hash);
    return ret;
  },
  validate(entry){
    var hash = createHash(toHashableValue(cloneKeys(HASH_KEYS, this)));
    if(hash !== entry.hash){
      throw new Error("Invalid Hash");
    }
    User.validateSignature(
      entry.publicKey, entry.signature, entry.hash
    );
  }
};
