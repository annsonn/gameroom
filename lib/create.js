var games = require('./games');

module.exports = function(roomName) {
    if (games[roomName]) {
        return this.emit('joined', 'error');
    }

    games[roomName] = [this.login];
    this.join(roomName);
    this.server.in(roomName).emit('joined', {player: this.login, game: roomName});
};