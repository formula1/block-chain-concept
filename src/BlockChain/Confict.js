

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
    var counts = comparisons.reduce(function(curCounts, comparison, i){
      if(!Object.keys(curCounts).some(function(curCountIndex){
        if(compareLists(comparison, comparisons[curCountIndex])){
          curCounts[curCountIndex]++;
          return true;
        }
      })){
        comparisons[i] = 1;
      }
      return comparisons;
    }, {});

    // sort the unique comparisonIndexes by count descending
    var countIndexes = Object.keys(counts).sort(function(a, b){
      return counts[b] - counts[a];
    });

    // return the largest comparison
    return comparisons[countIndexes[0]];
  },
  ensureSameBlock(blocks){

  }
}

/*

We are a given a list of lists of hashes
- Some of them will have portions of the other
- Some of them will be the "short version" and others the "long version"

What we care about is the most popular short version

Compare each of the lists



*/

function compareLists(a, b){
  if(a.length !== b.length) return false;
  return !a.some(function(aS, i){
    return aS !== b[i];
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
