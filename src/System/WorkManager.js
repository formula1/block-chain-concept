var { EventEmitter } = require("events");
var Chain = require("./Chain");
var Block = require("./Block");
var bigInt = require("big-integer");
var { doWork, doesWorkPass } = require("./constants");

module.exports = {
  create(){
    var manager = new EventEmitter();
    manager.current = null;
    manager.counter = 0;
    return manager;
  },
  hasProcessingConfict(manager, data){
    if(!manager.current) return false;
    var curr = manager.current;
    var currHashes = curr.arg.entries.map(function(entry){
      return entry.signature;
    });
    var otherHashes = data.entries.map(function(entry){
      return entry.signature;
    });
    return currHashes.some(function(h){
      return otherHashes.indexOf(h) > -1;
    });
  },
  startNew(manager, chain){
    var entries = Chain.getEntriesToProcess(chain);
    var block = Block.create(chain.tail, manager.user, entries);
    return run(manager, block);
  }
};

function run(manager, arg){
  var id = manager.counter++;
  var work = {
    attempt: bigInt(0),
    id: id,
    arg: arg,
  };

  manager.current = work;
  runLoop(manager, work);
  return id;
}

function runLoop(manager, work){
  return Promise.resolve(work.arg).then(function(arg){
    return doWork(arg, manager.attempt);
  }).then(function(result){
    return doesWorkPass(result);
  }).then(function(boo){
    if(manager.current !== work){
      return;
    }

    if(!boo){
      work.attempt = work.attempt.add(1);
      return runLoop(manager, work);
    }
    manager.emit("verified", work, work.attempt.toString());
  });
}
