var Client = require('socket.io-client'),
    redis = require('node-redis-mock').createClient();

exports.connectSocket = function(server, opts) {
    var addr = server.address() || server.listen().address();

    return Client('ws://' + addr.address + ':' + addr.port, opts);
};

exports.mockOptions = {
    pub: redis,
    sub: redis,
    cmd: redis
};