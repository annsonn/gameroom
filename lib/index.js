var util = require('util'),
    io = require('socket.io'),

    login = require('./login'),
    create = require('./create'),
    join = require('./join'),
    leave = require('./leave'),
    message = require('./message'),

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
        socket.on('join', join);
        socket.on('leave', leave);
        socket.on('message', message);
    });

};

util.inherits(GameRoom, io);
