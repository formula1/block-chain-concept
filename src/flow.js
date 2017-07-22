var Network = require("./network");
var Entry = require("./entry");
var Application = require("./application");
var Chain = require("./Chain");
var Block = require("./Block");
var Application = require("./Application");
var WorkManager = require("./WorkManager");




module.exports = function(application, chain, network){
  application.on("entry", makeEntry);
  chain.on("verified", finishedVerification);
  network.on("message", handleNetworkMessage);

  function makeEntry(application, methodName, values){
    var entry = Entry.create(application.name, methodName, values, application.user);
    Application.validateEntry(application, entry);
    return Network.broadcast(network, {
      event: "entry",
      data: entry
    });
  }

  function finishedVerification(block){
    Network.broadcast(network, {
      event: "block",
      data: block,
    });
    Chain.addBlock(chain, block);
    application.update(chain);
  }

  function handleNetworkMessage({ event, data }){
    switch(event){
      case "entry":
        return handleNewEntry(
          application, workManager, network, chain, data
        );
      case "block":
        return handleNewVerifiedBlock(
          application, workManager, network, chain, data
        );
    }
  }
};

function handleNewEntry(application, workManager, network, chain, data){
  if(Chain.hasEntry(chain, data)){
    return;
  }
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

function handleNewVerifiedBlock(application, workManager, network, chain, data){
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
  Application.dispatchUpdate(application, chain);
  Network.broadcast(network, {
    event: "block",
    data: data,
  });
}

function requestProofOfLongerChain(network, block){

}
