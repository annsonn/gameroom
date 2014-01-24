var util = require('util'),
    io = require('socket.io'),

    login = require('./login'),
    create = require('./create'),

    games = require('./games');

var GameRoom = module.exports = function(http, opt) {
    io.call(this, http, opt);

    var sio = this;

    this.sockets.on('connection', function (socket) {
        socket.login = socket.id;
        socket.emit('identity', socket.login);

        // Handle events
        socket.on('login', login);
        socket.on('create', create);
    });

};

util.inherits(GameRoom, io);
