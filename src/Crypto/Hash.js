var CryptoJS = require("crypto-js");

module.exports.createHash = createHash;

function createHash(string){
  return CryptoJS.SHA256(string).toString();
}
