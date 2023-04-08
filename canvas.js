var host = "localhost:4444";

$(document).ready(function () {
    trackingMgr.init();
    twod.start();
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
            return;
        }
        trackingMgr.error = 0;

        if (trackingMgr.center == null) {
            // init center if first frame
            trackingMgr.center = [
                frame.people[0].joints[0].position.x,
                frame.people[0].joints[0].position.y,
                frame.people[0].joints[0].position.z
            ];
        }
        for (var i = 0; i < frame.people[0].joints.length; i++) {
            trackingMgr.joints[i] = [
                (frame.people[0].joints[i].position.x - trackingMgr.center[0]) * -1 / 4,
                (frame.people[0].joints[i].position.y - trackingMgr.center[1]) * -1 / 4,
                (frame.people[0].joints[i].position.z - trackingMgr.center[2]) * -1 / 4,
            ];
        }

    }
};

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


function setup() {
    let snakeCanvas = createCanvas(windowWidth / 2, windowHeight / 2);
    snakeCanvas.parent("canvas-container");
    frameRate(30);
    stroke(255);
    strokeWeight(10);
    background('black');
}
var prev = null;

var col = [0, 53, 107];

setTimeout(() => {col = [208, 190, 8];}, 30000);


function draw() {
    var i = 0;
    var newData = trackingMgr.joints;
    var ind = [0, 9, 10, 13, 14];
    // var newData = [[mouseX - width / 2, mouseY - height / 2]];
    if (newData.length > 0) {
        for (var j = 0; j < ind.length; j++) {
            i = ind[j];
            if (prev == null || prev[0] == null) {
                point(newData[i][0] + (width / 2), newData[i][1] + (height / 2));
            } else {
                var d = dist(
                    prev[i][0] + (width / 2), prev[i][1] + (height / 2),
                    newData[i][0] + (width / 2), newData[i][1] + (height / 2)
                );
                
                stroke(
                    map(d, 0, 700, col[0] * 0.8, 255),
                    map(d, 0, 700, col[1] * 0.8, 255),
                    map(d, 0, 700, col[2], 255),
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
    // point(mouseX, mouseY);
}
