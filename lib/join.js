var games = require('./games');

module.exports = function(roomName, fn) {
    var self = this;
    if (!games[roomName] && fn) {
        return fn({error: 'room does not exist'});
    }

    if (self.rooms && self.rooms.length > 0) {
        //self.onLeave();
    }

    games[roomName].push(self.login);
    self.join(roomName, function() {
        self.in(roomName).emit('joined', {player: self.login, game: roomName});
        
        if (fn) {
            var playerList = games[roomName].map(function(playerLogin) {
                return {player: playerLogin, game: roomName};
            });
            
            fn(null, playerList);
        }
    });

};