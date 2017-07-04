var { createHash } = require("../Crypto/Hash");
var { cloneKeys, toHashableValue } = require("./util");
var bigInt = require("big-integer");
var Entry = require("./Entry");
var User = require("./User");
var { EXPECTED_NUM_OF_ENTRIES } = require("../constants");

const HASH_KEYS = ["index", "publicKey", "prev", "entries", "tree"];

module.exports = {
  createGenesisBlock(){
    var rootUser = User.getRootUser();
    var ret = {
      index: 0,
      publicKey: rootUser.publicKey,
      prev: "",
      entries: [],
      tree: [],
    };
    ret.hash = createHash(toHashableValue(cloneKeys(HASH_KEYS, ret)));
    ret.signature = User.signHash(rootUser, ret.hash);
    return ret;
  },
  create(previousBlock, user, entries){
    var hashTree = createTreeFromEntries(entries);
    var ret = {
      index: previousBlock.index + 1,
      publicKey: user.publicKey,
      prev: previousBlock.hash,
      entries: entries,
      tree: hashTree,
    };
    ret.hash = createHash(toHashableValue(cloneKeys(HASH_KEYS, ret)));
    ret.signature = User.signHash(user, ret.hash);
    return ret;
  },
  validateBlock(block){
    var hash = createHash(toHashableValue(cloneKeys(HASH_KEYS, this)));
    if(hash !== block.hash){
      throw new Error("Invalid hash");
    }
    User.validateSignature(
      block.publicKey, block.signature, block.hash
    );
    if(block.index === 0){
      if(block.entries.length > 0){
        throw new Error("genesis block should not have entries");
      }
      if(block.tree.length > 0){
        throw new Error("genesis block should not have a tree");
      }
    } else{
      block.entries.forEach(Entry.validate);
      var tree = createTreeFromEntries(block.entries);
      if(tree[0] !== block.tree[0]){
        throw new Error("invalid tree");
      }
    }
  },
  hasEntry(block, entry){
    return block.entries.some(function(bEntry){
      return bEntry.signature === entry.signature;
    });
  }
};

function createTreeFromEntries(entries){
  if(entries.length !== EXPECTED_NUM_OF_ENTRIES){
    throw new Error("only " + EXPECTED_NUM_OF_ENTRIES + " allowed");
  }
  entries = entries.sort(function(a, b){
    return bigInt(a.hash).compare(b.hash);
  });
  entries.forEach(Entry.validate);
  return constructTree(entries.map(function(entry){
    return entry.signature;
  }));

}

function constructTree(hashes, ret){
  ret = [
    hashes.reduce(function(net, hash, i){
      if(i === 0){
        return net.concat([hash]);
      }
      net.push(combineBranches(
        hash, net.pop()
      ));
      return net;
    }, [])
  ].concat(ret || []);

  if(hashes.length > 2) return constructTree(ret[0], ret);
  return ret;
}

function combineBranches(a, b){
  return createHash(
    [a, b].sort().join("")
  );
}
