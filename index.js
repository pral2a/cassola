var colors = require('colors');


var express = require('express');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var cassolaires = 0;
var cassolades = 0;

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    cassolaires++;
    console.log(colors.bold.yellow("cassolaire connectat, ja'n som " + cassolaires));

    io.sockets.emit('cassolaires', cassolaires);
    socket.on('cassola pic', function (msg) {
        cassolades++;
        console.log(colors.bold.red("pic " + cassolades + " rebut i emès...  "));
        var broadcastMsg = {
            cassolades: cassolades,
            tipus: msg.tipus
        }
        socket.broadcast.emit('cassola pic', broadcastMsg);
    });

    socket.on('disconnect', function () {
        cassolaires--;
        io.sockets.emit('cassolaires', cassolaires);
    });
});

http.listen(3000, function () {
    console.log(colors.rainbow("esperant cassolaires al *:3000"));
});