var host = "localhost:4444";
// var host = "cpsc484-03.yale.internal:8888";

var DEBUG = true;

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

$(document).ready(function () {
    trackingMgr.init();
    if (DEBUG) {
        twod.start();
    }
});

/*
Error:
0: normal
1: no people detected
*/
var trackingMgr = {
    socket: null,
    joints: [],
    center: null,
    error: 0,
    bodyId: null,
    init: function () {
        var url = "ws://" + host + "/frames";
        trackingMgr.socket = new WebSocket(url);
        trackingMgr.socket.onmessage = function (event) {
            trackingMgr.updateJoints(JSON.parse(event.data));
        }
    },
    updateJoints: function (frame) {
        if (frame.people.length < 1) {
            trackingMgr.error = 1;
            trackingMgr.center = null;
            return;
        }
        trackingMgr.error = 0;

        if (trackingMgr.center == null) {
            // init center if first frame
            trackingMgr.bodyId = frame.people[0].body_id;
            console.log(`Tracking ${trackingMgr.bodyId}`);
            trackingMgr.center = [
                // joints[2] is SPINE_CHEST
                frame.people[0].joints[2].position.x,
                frame.people[0].joints[2].position.y
            ];
        }

        // query frame to find the people with body id
        jsonata(`people[body_id=${trackingMgr.bodyId}]`).evaluate(frame).then((people) => {
            if (people == null) {
                // if prev body missing, re-init
                trackingMgr.center = null;
                return;
            }
            console.log(people);
            for (var i = 0; i < people.joints.length; i++) {
                trackingMgr.joints[i] = [
                    (people.joints[i].position.x - trackingMgr.center[0]) * -1 * body_scale, // mirror
                    (people.joints[i].position.y - trackingMgr.center[1]) * body_scale,
                    (people.joints[i].position.z - trackingMgr.center[2]) * body_scale,
                ];
            }
        });
    },
    isY: function (){
        // TODO
        return false;
    },
};


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