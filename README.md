gameroom
========

Its a game room to play games in.

[![Build Status](https://travis-ci.org/annsonn/gameroom.png?branch=master)](https://travis-ci.org/annsonn/gameroom)

install
-------

<code>npm install gameroom</code>

usage
------

server side:

```
var GameRoom = require('gameroom')
  , app = require('http').createServer(handler)
  , app.gameroom = new GameRoom(app);

app.listen(80);

app.gameroom.on('connection', function (socket) {
  console.log(socket.id);
});
```

client side:
```
<script src="/socket.io/socket.io.js"></script>
<script> var socket = io(); </script>
```
