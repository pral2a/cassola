jQuery(document).ready(function ($) {

    recalculaMidesCassola();

    $(document).mousemove(function (event) {

        ratoli = {
            x: event.pageX,
            y: event.pageY
        }

        $('#cullera').css({
            'left': ratoli.x - 134 / 2,
                'top': ratoli.y - 100,
        });

    });

    $('.tanca').click(tanca);

    $('#about').click(tanca);

    $(this).mousedown(copDeCassola);

    $(this).mouseup(deixaCop);

    jQuery(window).resize(recalculaMidesCassola);


    socket.on('cassola pic', function (msg) {
        cassolades = msg.cassolades;
        if (msg.tipus) soPic(msg.tipus, false);
        actualitzaCassolades();
    });

    socket.on('cassolaires', function (msg) {
        console.log("Ja som " + msg + " cassolaires!")
    });

});

var cassola;
var ratoli;
var socket = io();
var cassolades = 0;
var cassoladesTeves = 0;

var pics = {
    llarg: new Howl({
        urls: ['so/pic-llarg.mp3'],
    }),
    curt: new Howl({
        urls: ['so/pic-curt.mp3'],
    })
}


    function actualitzaCassoladesTeves() {
        $('#tu-score').text(cassoladesTeves);
    }

    function actualitzaCassolades() {
        $('#tothom-score').text(cassolades);
    }

    function deixaCop() {

        $('#cullera').css({
            'background-size': 'auto 100%'
        });

        $('#cassola').css({
            'background-position': 'center top'
        });

    }


    function copDeCassola() {

        $('#cullera').css({
            'background-size': 'auto 90%'
        });

        var result = isTouchingCassola();

        if (result) {
            copTeu(result);
        }

    }

    function copTeu(tipus) {

        $('#cassola').css({
            'background-position': 'center top -758px'
        });


        var msg = {
            tipus: tipus
        };

        socket.emit('cassola pic', msg);

        soPic(msg.tipus, true);

        cassolades++;
        cassoladesTeves++;

        actualitzaCassoladesTeves();
        actualitzaCassolades();

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

    function recalculaMidesCassola() {
        var cassolaContainer = $('#cassola');
        cassola = {
            x: cassolaContainer.offset().left + cassolaContainer.outerWidth() / 2,
            y: cassolaContainer.offset().top + cassolaContainer.outerWidth() / 2 - cassolaContainer.outerHeight() / 10,
            radiGran: cassolaContainer.outerWidth() / 2,
            radiPetit: cassolaContainer.outerWidth() / 3
        };
    }

    function isTouchingCassola(mouse, pan) {
        var mouse = mouse || ratoli;
        var pan = pan || cassola;


        if (isPointOnCircle(mouse.x, mouse.y, pan.x, pan.y, pan.radiPetit)) {
            return "curt";
        } else if (isPointOnCircle(mouse.x, mouse.y, pan.x, pan.y, pan.radiGran)) {
            return "llarg";
        } else {
            return false;
        }
    }

    function isPointOnCircle(mouseX, mouseY, cassolaX, cassolaY, radiCassola) {
        return ((mouseX - cassolaX) * (mouseX - cassolaX) + (mouseY - cassolaY) * (mouseY - cassolaY) <= radiCassola * radiCassola);
    }

    function tanca() {
        $('aside').fadeToggle();
    }

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }