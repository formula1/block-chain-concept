var Network = require("../Network");
var Entry = require("../Entry");
var Application = require("./Application");
var Chain = require("../Chain");
var WorkManager = require("./WorkManager");
var Block = require("../Block");
var User = require("./User");
var Persistance = require("../System/Persistance");

module.exports = {
  create: function(user){
    var workManager = WorkManager.create();
    var chainPersistance = Persistance.create("/chain");
    return chainPersistance.get().then(function(chain){
      if(!chain){
        chain = Chain.create();
        chainPersistance.set(chain);
      }
      var network = Network.create(user, chain);
      var ret = {
        user,
        workManager,
        network,
        chain,
      };
      return synchronizeChainWithNetwork(ret).then(function(){
        return ret;
      });
    });
  },
  makeApplicationEntry: function(system, applicationName, methodName, values){
    var { user, network, chain } = system;
    Application.validateEntry(applicationName, chain, methodName, values);
    var entry = Entry.create(applicationName, methodName, values, user);
    return Network.broadcast(network, {
      event: "entry",
      data: entry
    });
  },
  finishedVerification: function(system, block){
    var { network } = system;
    Network.broadcast(network, {
      event: "block",
      data: block,
    });
  },
  handleNetworkMessage: function(system, { event, data }){
    switch(event){
      case "entry":
        return handleNewEntry(
          system, data
        );
      case "block":
        return handleNewVerifiedBlock(
          system, data
        );
    }
  },
};

function handleNewEntry(system, data){
  var { workManager, network, chain } = system;
  if(Chain.hasEntry(chain, data)){
    return;
  }

  Application.validateEntry(
    chain, data.applicationName, data.methodName, data.values
  );

  Entry.validate(data);
  Chain.addEntry(chain, data);
  if(!workManager.current){
    WorkManager.startNew(workManager, chain);
  }
  Network.broadcast(network, {
    event: "entry",
    data: data
  });
}

function handleNewVerifiedBlock(system, data){
  var { workManager, network, chain, chainPersistance } = system;

  if(Chain.hasBlock(chain, data)){
    return;
  }
  Block.verify(data);
  try{
    Chain.verifyBlock(chain, data);
  }catch(e){
    return requestProofOfLongerChain(network, chain, data);
  }
  Chain.addBlock(chain, data);
  if(WorkManager.hasProcessingConfict(workManager, data)){
    WorkManager.startNew(workManager, chain);
  }
  chainPersistance.set(chain);
  Application.dispatchUpdate(chain);
  Network.broadcast(network, {
    event: "block",
    data: data,
  });
}

function synchronizeChainWithNetwork(system){
  var { network, chain } = system;
  var lastHash = chain.list[chain.list.length - 1];
  return Network.request(
    "/chain-after-hash", { hash: lastHash }
  ).then(function(results){
  }).then(function(hashs){
    return hashs.reduce(function(p, hash){
      return p.then(function(){
        return Network.request(
          "/block", { hash: hash }
        );
      }).then(function(results){
        Block
      });
      return .then(function(results){
    });
  });
}


function requestProofOfLongerChain(network, block){

}
