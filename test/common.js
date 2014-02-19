var Client = require('socket.io-client'),
    merge = require('merge'),
    redis = require('node-redis-mock').createClient();

exports.connectSocket = function(server, opts) {
    var addr = server.address() || server.listen().address();

    return Client('ws://' + addr.address + ':' + addr.port, opts);
};

exports.connectSocketAndIdentify = function(server, opts) {
    var client = exports.connectSocket(server, opts);
    
    client.on('identity', function(id) {
        client.login = id;
    });
    
    return client;
};

exports.mockOptions = function(extra) {
    return merge({
        pub: redis,
        sub: redis,
        cmd: redis
    }, extra);
};