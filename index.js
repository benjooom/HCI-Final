// var host = "cpsc484-03.yale.internal:8888";

var stroke_weight = 5;
var stroke_opacity = 0.8;

var speed_sensitivity = 300; // value up => less likely white 
var col_pair = ["#e4d38d", "#e2311d", "#7518e0", "#119d89"];


// used to control if the screen is paused.
var is_paused = false;

var prev;
var paint_canvas;
// var bg_img;

var paint_center;

var human_sec = 0.0;


function preload() {
    // preload() runs once
    // bg_img = loadImage('images/art1.jpg');
}

function setup() {
    paint_canvas = createCanvas(windowWidth, windowHeight);
    // paint_canvas = createCanvas(800, 600);
    paint_canvas.parent("canvas-container");
    frameRate(30);
    stroke("black");
    strokeWeight(stroke_weight);
    background('black');
    prev = Array.from({ length: 100 }, () => [Math.floor(Math.random() * width), Math.floor(Math.random() * height)]);
    // image(bg_img, 0, 0, windowWidth, windowHeight);
}

function draw() {
if (trackingMgr.error == 0) {
        human_sec += 1.0 / frameRate();
    } else if (trackingMgr.error == 1) {
        //no people
        human_sec = 0.0;
    }
    if (human_sec > 2) {
        window.location.href = 'instruction.html';
    }

    if (is_paused) {
        return;
    }
    // test
    paint_center = [0, 0];
    background(0, 0.02 * 255);
    // test
    var newData = [];
    for (var i = 0; i < prev.length; i++) {
        var newx = prev[i][0] + i / 2 * (Math.random() - 0.5);
        var newy = prev[i][1] + i / 2 * (Math.random() - 0.5);
        if (newx < 0) { newx *= -1; }
        if (newx > width) { newx = width - newx + width; }
        if (newy < 0) { newy *= -1; }
        if (newy > height) { newy = height - newy + height; }
        newData[i] = [newx, newy];
    }
    if (newData.length > 0) {
        for (var i = 0; i < newData.length; i++) {
            if (prev == null || prev[0] == null) {
                point((newData[i][0] + paint_center[0]) % width, (newData[i][1] + paint_center[1]) % height);
            } else {
                var d = dist(
                    prev[i][0] + paint_center[0], prev[i][1] + paint_center[1],
                    newData[i][0] + paint_center[0], newData[i][1] + paint_center[1]
                );

                stroke(
                    map(d, 0, speed_sensitivity, 180 * Math.random() * 0.8, 255),
                    map(d, 0, speed_sensitivity, 180 * noise(prev[i][1]) * 0.8, 255),
                    map(d, 0, speed_sensitivity, 180 * noise(prev[i][0]) * 0.8, 255),
                    stroke_opacity * 255
                );
                line(
                    (prev[i][0] + paint_center[0]) % width, (prev[i][1] + paint_center[1]) % height,
                    (newData[i][0] + paint_center[0]) % width, (newData[i][1] + paint_center[1]) % height
                );
            }
        }
    }
    prev = newData.slice(0);
}

var twod = {
    socket: null,

    start: function () {
        var url = "ws://" + host + "/twod";
        twod.socket = new WebSocket(url);
        twod.socket.onmessage = function (event) {
            twod.show(JSON.parse(event.data));
        }
    },

    show: function (twod) {
        $('.twod').attr("src", 'data:image/pnjpegg;base64,' + twod.src);
    }
};