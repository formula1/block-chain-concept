

module.exports.cloneKeys = function(keys, original){
  return keys.reduce((obj, key)=>{
    obj[key] = original[key];
    return obj;
  }, {});
};

module.exports.toHashableValue = toHashableValue;

function toHashableValue(values){
  if(typeof values !== "object"){
    return values.toString();
  }
  if(Array.isArray(values)){
    return JSON.stringify(values.sort());
  }
  var keys = Object.keys(values);
  keys.sort();
  return `{${keys.map(function(key){
    return `"${key}":"${toHashableValue(values[key]).replace("\"", "\\\"")}"`;
  }).join("")}}`;
}

module.exports.countSame = function(list, compare){
  return list.reduce(function(counts, item, i){
    if(!Object.keys(counts).some(function(index){
      if(compare(item, list[index])){
        counts[index]++;
        return true;
      }
    })){
      counts[i] = 1;
    }
  }, {});
};
