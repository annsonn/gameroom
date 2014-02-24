module.exports = function(message, fn) {
    var data = {message: message.message, player: this.login};
    var payload = {data: {message: message.message, player: this.login}};
    if (message.room) {
        payload.data.room = message.room;
        payload.rooms = [message.room];
    } else if (message.player) {
        payload.player = message.player;
    }

    this.gameroom.pub.publish('gameroom', payload);

    if (fn) {
        fn(null, data);
    }
};