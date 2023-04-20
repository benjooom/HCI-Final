
var DEBUG = true;

var sec_rem = 15;

var stroke_weight = 4;
var body_scale = 0.2;
var speed_sensitivity = 80; // value up => less likely white 
var col_pair = ["#84773b", "#2c1c99"];

// used to control if the screen is paused.
var is_paused = false;
var prev = null;
var paint_canvas;

// For dev only. choose a draw with a col for 15 sec and change to another.
var col = col_pair[0];
setTimeout(() => {
    col = col_pair[1];
    trackingMgr.center = null;
}, 15000);

// pause demo
// setTimeout(() => { is_paused = true; }, 5000);
// setTimeout(() => { is_paused = false; prev = null; }, 10000);

// save image demo
// setTimeout(() => { saveCanvas(paint_canvas, 'myCanvas', 'jpg'); }, 30000); // save as file
// setTimeout(() => { console.log(paint_canvas.elt.toDataURL()); }, 30000); // get base64 encode string
let qr;
function preload() {
    qr = loadImage("images/qr-sample.jpg");
}
function setup() {
    paint_canvas = createCanvas(windowWidth, windowHeight);
    // paint_canvas = createCanvas(800, 600);
    paint_canvas.parent("canvas-container");
    frameRate(5);
    stroke("black");
    strokeWeight(stroke_weight);
    background('black');

}

function draw() {
    if (is_paused) {
        return;
    }
    sec_rem -= 1 / frameRate();
    if (sec_rem < -1000) {sec_rem = 15;}
    if (sec_rem < 0) {
        is_paused = true;
        image(qr, width/2, height / 2, width / 4, width / 4);
        return;
    }


    fill(0);
    rect(5, 30, 200, 50);
    fill(255);
    text(sec_rem, 10, 60);
    
    var newData = trackingMgr.joints;
    if (newData.length > 0) {

        // // start chosen index only
        // var chosen_joint_index = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
        // for (var j = 0; j < chosen_joint_index.length; j++) {
        //     var i = chosen_joint_index[j];
        // // end chosen index only
        
        // star all joints
            for (var i = 0; i < newData.length; i++) {
        // end all joints
        
            if (prev == null || prev[0] == null) {
                point(newData[i][0] + (width / 2), newData[i][1] + (height / 2));
            } else {
                var d = dist(
                    prev[i][0] + (width / 2), prev[i][1] + (height / 2),
                    newData[i][0] + (width / 2), newData[i][1] + (height / 2)
                );

                stroke(
                    map(d, 0, speed_sensitivity, red(color(col)) * 0.8, 255),
                    map(d, 0, speed_sensitivity, green(color(col)) * 0.8, 255),
                    map(d, 0, speed_sensitivity, blue(color(col)), 255),
                    0.4 * 255
                );
                line(
                    prev[i][0] + (width / 2), prev[i][1] + (height / 2),
                    newData[i][0] + (width / 2), newData[i][1] + (height / 2)
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