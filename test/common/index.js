var Client = require('socket.io-client');

exports.connectSocket = function(server, opts) {
    var addr = server.address() || server.listen().address();

    return Client('ws://' + addr.address + ':' + addr.port, opts);
};