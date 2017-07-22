var Persistance = require("./System/Persistance");
var User = require("./BlockChain/User");

module.exports.entry = function(){
  var userPersistance = Persistance.create("/user");
  var user = userPersistance.get();
  if(!user){
    user = User.create();
    userPersistance.set(user);
  }

}

if(!module.parent){
  module.exports.entry();
}
