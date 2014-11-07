$(document).ready(function () {

    var pics = {
        llarg: new Howl({
            urls: ['pic.mp3'],
        }),
        curt: new Howl({
            urls: ['pic.mp3'],
        })
    }

    var socket = io();
    var cassolades = 0;

    $('form').submit(function () {

        var msg = {
            tipus: "llarg"
        };

        socket.emit('cassola pic', msg);

        soPic(msg.tipus, true);

        cassolades++;

        $('h2').text(cassolades);
        return false;
    });

    socket.on('cassola pic', function (msg) {
        cassolades = msg.cassolades;
        $('h2').text(cassolades);
        soPic(msg.tipus, false);
    });





    socket.on('cassolaires', function (msg) {
        $('h1').text(msg);
    });

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    function soPic(tipus, dins) {
        if (!dins) {
            pics[tipus].volume(getRandom(0.2, 0.5));
            pics[tipus].pos3d(getRandom(0, 1.0), 0, 0);
        } else {
            pics[tipus].volume(1.0);
            pics[tipus].pos3d(0, 0, 0.5);
        }
        pics[tipus].play();
    }

});