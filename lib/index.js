var util = require('util'),
    io = require('socket.io'),
    redis = require('redis'),
    games = require('./games');

var GameRoom = module.exports = function(http, opt) {
    io.call(this, http, opt);
    
    opt = opt || {};
    
    this.pub = opt.pub || redis.createClient();
    this.sub = opt.sub || redis.createClient();
    this.cmd = opt.cmd || redis.createClient();
    
    this.sub.subscribe('gameroom');
    this.sub.on('message', this.handleRedis.bind(this));

    var sio = this;

    this.sockets.on('connection', function (socket) {
        socket.gameroom = sio;
        socket.login = socket.id;
        socket.emit('identity', socket.login);

        // Handle events
        socket.on('login', sio.onLogin);
        socket.on('create', sio.onCreate);
        socket.on('join', sio.onJoin);
        socket.on('leave', sio.onLeave);
        socket.on('message', sio.onMessage);
        socket.on('disconnect', sio.onDisconnect);
    });
};

util.inherits(GameRoom, io);

GameRoom.prototype.handleRedis = require('./handlers/handleRedis');
GameRoom.prototype.onLogin = require('./handlers/login');
GameRoom.prototype.onCreate = require('./handlers/create');
GameRoom.prototype.onJoin = require('./handlers/join');
GameRoom.prototype.onLeave = require('./handlers/leave');
GameRoom.prototype.onDisconnect = require('./handlers/disconnect');
GameRoom.prototype.onMessage = require('./handlers/message');
