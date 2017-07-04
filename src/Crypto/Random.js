


// define the characters to pick from
var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz*&-%/!?*+=()";

// create a key for symmetric encryption
// pass in the desired length of your key

module.exports.generateKey = function generateKey(keyLength){
  var randomstring = "";

  for(var i=0; i < keyLength; i++){
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum+1);
  }
  return randomstring;
};
