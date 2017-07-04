var { EventEmitter } = require("events");
var Peer = require("peer-js");
var Chain = require("./Chain");
var { PEER_JS_API_KEY } = require("./constants");

module.exports = {
  create(user, chain){
    var connections = new Map();
    var peer = new Peer(user.publicKey, { key: PEER_JS_API_KEY });
    var network = new EventEmitter();
    network.connections = connections;
    network.peer = peer;

    peer.on("connection", function(conn){
      registerPeer(network, conn);
    });
    chain.subscribe(function(state){
      var publicKeys = Chain.getPublicKeys(state);
      connectToPeers(network, user, publicKeys);
    });
    return network;
  },
  broadcast(network, data){
    Array.from(network.connections.values()).forEach(function(peer){
      peer.send(data);
    });
  }
};

function connectToPeers(network, user, publicKeys){
  var { peer, activeConnections } = network;
  publicKeys.filter(function(key){
    if(key === user.publicKey) return false;
    if(activeConnections.has(key)) return false;
    return true;
  }).map(function(key){
    var conn = peer.connect(key);
    registerPeer(network, conn);
  });
}

function registerPeer(network, conn){
  var { connections } = network;
  connections.set(conn.id, conn);
  conn.add("close", function(){
    connections.delete(conn);
  });
  conn.on("data", function(data){
    network.emit("message", data);
  });
}
