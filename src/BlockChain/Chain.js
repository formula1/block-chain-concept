
var Block = require("./Block");
var { EXPECTED_NUM_OF_ENTRIES } = require("../constants");

module.exports = {
  create(){
    var initialBlock = Block.createGenesisBlock();
    return {
      unprocessedEntries: [],
      map: {
        [initialBlock.signature]: initialBlock,
      },
      list: [initialBlock.signature],
    };
  },
  hasEntry(chain, entry){
    if(chain.unprocessedEntries.some(function(uEntry){
      return uEntry.signature === entry.signature;
    })) return true;
    if(chain.list.some(function(blockSig){
      return Block.hasEntry(chain.map[blockSig], entry);
    })) return true;
    return false;
  },
  getEntriesToProcess(chain){
    chain.unprocessedEntries.slice(EXPECTED_NUM_OF_ENTRIES);
  },
  hasBlock(chain, block){
    return block.signature in chain.map;
  },
  verifyBlock(chain, block){
    var prevHash = block.prev;
    if(!(prevHash in chain.map)){
      throw new Error("prev hash does not exist");
    }
    var tail = chain.list[chain.list - 1];
    if(tail.signature !== prevHash){
      throw new Error("prev hash was not the last one");
    }
    if(tail.index !== block.index - 1){
      throw new Error("prev hash was not the last one");
    }
  },
  addBlock(chain, block){
    chain.map[block.signature] = block;
    chain.list[block.index] = block.signature;
    chain.unprocessedEntries = chain.unprocessedEntries.filter(function(uE){
      return !block.entries.some(function(bE){
        return bE.signature === uE.signature;
      });
    });
  },
};
