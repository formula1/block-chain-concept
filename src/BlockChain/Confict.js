var { countSame } = require("../util");

module.exports = {
  findBestChain(chain, newExtensions){
    // compare all of the new Extensions with eachother (if short that is fine)
    var comparisons = newExtensions.reduce(function(comparisons, a, i){
      if(i === newExtensions.length - 1){
        return comparisons;
      }
      return comparisons.concat(
        newExtensions.slice(i + 1).map(function(b){
          return smallestSameList(a, b);
        })
      );
    });

    // count each of the comparisons to found out the most common
    var counts = countSame(comparisons, function(a, b){
      return compareLists(a, b);
    });

    // sort the unique comparisonIndexes by count descending
    var countIndexes = Object.keys(counts).sort(function(a, b){
      return counts[b] - counts[a];
    });

    // return the largest comparison
    return comparisons[countIndexes[0]];
  },
  ensureSameBlock(blocks){
    var uniqueBlockCount = countSame(blocks, function(a, b){
      if(a.signature !== b.signature) return false;
      if(a.publicKey !== b.publicKey) return false;
      if(a.prev !== b.prev) return false;
      if(a.index !== b.index) return false;
      if(!deepCompare(a.tree, b.tree)) return false;
      return true;
    });

  }
};

/*

We are a given a list of lists of hashes
- Some of them will have portions of the other
- Some of them will be the "short version" and others the "long version"

What we care about is the most popular short version

Compare each of the lists



*/

function countSame(list, comparator){

}

function compareLists(a, b){
  if(a.length !== b.length) return false;
  return !a.some(function(aS, i){
    return aS !== b[i];
  });
}

function deepCompare(a, b){
  if(typeof a !== typeof b){
    return false;
  }
  if(typeof a !== "object"){
    return a === b;
  }
  var keysA = Object.keys(a);
  var keysB = Object.keys(a);
  if(keysA.length !== keysB.length){
    return false;
  }
  return !keysA.some(function(keyA){
    if(keysB.indexOf(keyA) === -1){
      return true;
    }
    return !deepCompare(a[keyA], b[keyA]);
  });
}

function smallestSameList(a, b){
  var min = Math.min(a.length, b.length);
  var net = [];
  for(var i = 0; i < min; i++){
    if(a[i] !== b[i]){
      return net;
    }
    net.push(a[i]);
  }
  return net;
}
