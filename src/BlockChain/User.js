
var { generateKey, generatePublicKey, encrypt, decrypt } = require("../Crypto/AsymetricPair");

module.exports  = {
  getRootUser(){
    return {
      privateKey: "Hello World",
      publicKey: generatePublicKey("Hello World"),
    };
  },
  create(){
    var privateKey = generateKey();
    return {
      privateKey: privateKey,
      publicKey: generatePublicKey(privateKey),
    };
  },
  signHash(user, hash){
    return encrypt(user.privateKey, hash);
  },
  validateSignature(publicKey, signature, hash){
    if(decrypt(publicKey, signature) !== hash){
      throw new Error("invalid signature");
    }
  }
};
