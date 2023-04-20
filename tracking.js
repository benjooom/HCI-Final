var host = "localhost:4444";
// var host = "cpsc484-03.yale.internal:8888";


var trackingMgr = {
    socket: null,
    joints: [],
    center: null,
    error: -1,
    bodyId: null,
    bodyScale: 0.3,
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
            // console.log(people);
            for (var i = 0; i < people.joints.length; i++) {
                trackingMgr.joints[i] = [
                    (people.joints[i].position.x - trackingMgr.center[0]) * -1 * trackingMgr.bodyScale, // mirror
                    (people.joints[i].position.y - trackingMgr.center[1]) * trackingMgr.bodyScale,
                    (people.joints[i].position.z - trackingMgr.center[2]) * trackingMgr.bodyScale,
                ];
            }
            trackingMgr.isY();
        });
    },
    isY: function (){
        // console.log("L", (trackingMgr.joints[8][0] - trackingMgr.joints[2][0] < 0) && (trackingMgr.joints[8][1] - trackingMgr.joints[2][1] < 0))
        // console.log("R", (trackingMgr.joints[15][0] - trackingMgr.joints[2][0] > 0) && (trackingMgr.joints[15][1] - trackingMgr.joints[2][1] < 0))
        if (trackingMgr.error != 0) {
            return false;
        }
        return (trackingMgr.joints[8][0] - trackingMgr.joints[2][0] < 0) && (trackingMgr.joints[8][1] - trackingMgr.joints[2][1] < 0) && (trackingMgr.joints[15][0] - trackingMgr.joints[2][0] > 0) && (trackingMgr.joints[15][1] - trackingMgr.joints[2][1] < 0);
    },
};


$(document).ready(function () {
    trackingMgr.init();
});