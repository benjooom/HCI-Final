// Get the element that represents the square
const progressbar = document.getElementById('progress-bar');

// Set the initial fill to 0%
progressbar.style.background = 'linear-gradient(to top, #23A636 0%, transparent 0%)';

// Function to update the fill of the square based on a percentage
function updateSquareFill(percentage) {
    progressbar.style.background = `linear-gradient(to top, #23A636 ${percentage}%, transparent ${percentage}%)`;
}

// Example usage: update the fill to 50%
let fillPercentage = 0; // This could be any value between 0 and 100



var no_human_sec = 0.0;


var DEBUG = true;

var stroke_weight = 4;
var speed_sensitivity = 100; // value up => less likely white 
// var col_pair = ["#84773b", "#2c1c99"];

// used to control if the screen is paused.
var is_paused = false;
var prev = null;
var paint_canvas;

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

var col = `rgb(${getRandomArbitrary(0, 255)},${getRandomArbitrary(0, 255)},${getRandomArbitrary(0, 255)})`;
// setTimeout(() => {
//     col = col_pair[1];
//     trackingMgr.center = null;
// }, 15000);


function setup() {
    paint_canvas = createCanvas(windowWidth, windowHeight);
    paint_canvas.parent("canvas-container");
    frameRate(30);
    stroke("black");
    strokeWeight(stroke_weight);
    background('black');

}

function draw() {
    if (trackingMgr.error == 0) {
        no_human_sec = 0.0;
    } else if (trackingMgr.error == 1) {
        //no people
        no_human_sec += 1.0 / frameRate();
    }
    if (no_human_sec >= 10) {
        window.location.href = 'index.html';
    }

    if (trackingMgr.isY()) {
    // if (mouseX > width / 2) {
        fillPercentage += 100 / 2 / frameRate();
    } else {
        fillPercentage = 0;
    }
    updateSquareFill(fillPercentage);
    if (fillPercentage > 100) {
        window.location.href = 'canvas.html';
    }

    if (is_paused) {
        return;
    }
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