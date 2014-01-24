var games = require('./games');

module.exports = function(roomName) {    
    if (games[roomName] && games[roomName].length > 0) {
        return this.emit('joined', {error: 'room already created'});
    }    
    
    games[roomName] = [this.login];
    this.join(roomName);
    this.server.in(roomName).emit('joined', {player: this.login, game: roomName});
};
