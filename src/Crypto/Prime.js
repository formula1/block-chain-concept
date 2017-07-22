var bigInt = require("big-integer");
var binarysearch = require("binary-search-promises");
var Lock = require("lock");

module.exports = class PrimeHandler{
  constructor(){
    this.list = [2];
    this.lock = Lock();
  }

  cloneCurrent(){
    return Promise.resolve(this.list.slice());
  }

  isPrime(num){
    if(typeof num === "number" && Math.round(num) !== num){
      return Promise.reject(new Error("Number needs to be an integer"));
    }
    var _this = this;
    num = bigInt(num);
    return Promise.all([
      this.cloneCurrent(),
      squareRoot(num),
    ]).then(function([list, sqRoot]){
      return _this.getLastPrime(list).then(function(last){
        return Promise.all([
          significantDigitOfDiff(num, last),
          significantDigitOfDiff(sqRoot, last),
          last,
        ]);
      }).then(function([sig, sigRoot, last]){
        if(sig === 0){
          return true;
        }
        if(sigRoot === 0){
          return false;
        }
        if(sig < 0){
          return binarysearch(
            list, num, significantDigitOfDiff
          ).then(function(results){
            return results.found;
          });
        }
        if(sigRoot < 0){
          return isNumberPrime(list, num);
        }
        return this.createPrimesUntil(last, sqRoot);
      }).then(function(newList){
        list = list.concat(newList);
        _this.updateList(list);
        return isNumberPrime(list, num);
      });
    });
  }

  createPrimesUntil(newList){
    var _this = this;
    return new Promise(function(res){
      _this.lock("create", function(release){
        return _this.cloneCurrent().then(function(list){
          _this.getLastPrime(list).then(function(){
            return createPrimesUntil(last, sqRoot, list).then(function(){
              release(function(){

              })
            });
          });
        });
      });
    });
  }

  getLastPrime(list){
    return Promise.resolve(list[list.length - 1]);
  }
}

function createPrimesUntil(prev, max, list, netList){
  if(!netList) netList = [];
  return addOne(prev).then(function(curr){
    return Promise.all([
      isNumberPrime(list, curr),
      significantDigitOfDiff(curr, max),
    ]).then(function([boo, diff]){
      if(boo){
        netList.push(curr);
      }
      if(diff < 0){
        return createPrimesUntil(curr, max, netList);
      } else{
        return netList;
      }
    });
  });
}

function isNumberPrime(list, num){
  return squareRoot(num).then(function(sqRoot){
    return Promise.all(list.map(function(div){
      return significantDigitOfDiff(div, sqRoot).then(function(sigNum){
        switch(sigNum){
          case 1: return false;
          case 0: return false;
          case -1: return true;
        }
      });
    }));
  }).then(function(results){
    return Promise.all(list.filter(function(div, i){
      return results[i];
    }).map(function(div){
      return isModZero(num, div);
    }));
  }).then(function(results){
    return !results.some(function(isNotPrime){
      return isNotPrime;
    });
  });
}

function addOne(num){
  return Promise.resolve(bigInt(num).add(1));
}

function squareRoot(num){
  return Promise.resolve(bigInt(num).pow(0.5));
}

function significantDigitOfDiff(a, b){
  return Promise.resolve(
    bigInt(a).diff(b)
  ).then(function(diff){
    return Promise.all([
      diff.gt(0),
      diff.equals(0),
    ]).then(function(results){
      if(results[0]) return 1;
      if(results[1]) return 0;
      return -1;
    });
  });
}

function isModZero(a, b){
  return Promise.resolve(bigInt(a).mod(b)).then(function(remainder){
    return bigInt(remainder).equals(0);
  });
}
