const TOKEN = "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";
const nums = document.querySelectorAll('.nums span');
const counter = document.querySelector('.counter');
const finalMessage = document.querySelector('.final');


runAnimation();

function resetDOM() {
    counter.classList.remove('hide');
    finalMessage.classList.remove('show');

    nums.forEach(num => {
        num.classList.value = '';
    });

    nums[0].classList.add('in');
}

function runAnimation() {
    nums.forEach((num, idx) => {
        const penultimate = nums.length - 1;
        num.addEventListener('animationend', (e) => {
            if (e.animationName === 'goIn' && idx !== penultimate) {
                num.classList.remove('in');
                num.classList.add('out');
            } else if (e.animationName === 'goOut' && num.nextElementSibling) {
                num.nextElementSibling.classList.add('in');
            } else {
                counter.classList.add('hide');
                finalMessage.classList.add('show');
            }
        });
    });
}




// Get the element that represents the square
const progressbar = document.getElementById('progress-bar');

// Set the initial fill to 0%
progressbar.style.background = 'linear-gradient(to right, #1cf28c 0%, transparent 0%)';

// Function to update the fill of the square based on a percentage
function updateSquareFill(percentage) {
    progressbar.style.background = `linear-gradient(to right, #1cf28c ${percentage}%, transparent ${percentage}%)`;
}

// Example usage: update the fill to 50%
let fillPercentage = 0; // This could be any value between 0 and 100





var DEBUG = true;
const init_time = 30;
const frame_rate = 5;
var sec_rem = init_time;

var stroke_weight = 4;
var speed_sensitivity = 100; // value up => less likely white 
// var body_scale = 0.2;
// var col_pair = ["#84773b", "#2c1c99"];


// used to control if the screen is paused.
var is_paused = true;
var prev = null;
var paint_canvas;

var img;
var img_ready = false;
var img_done = false;

var old_img_name;


// generate a file name with todays date
var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
// If length of getMinutes() is 1, add a 0 in front of it.
if (today.getMinutes().toString().length == 1) {
    var time0 = today.getHours() + "-0" + today.getMinutes() + "-" + today.getSeconds();
} else {
    var time0 = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
}
var fileName = date + '_' + time0;

// For dev only. choose a draw with a col for 15 sec and change to another.

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

var col = `rgb(${getRandomArbitrary(0, 255)},${getRandomArbitrary(0, 255)},${getRandomArbitrary(0, 255)})`;

// pause demo
setTimeout(() => { is_paused = false; }, 5000);
// setTimeout(() => { is_paused = false; prev = null; }, 10000);

// save image demo
// setTimeout(() => { saveCanvas(paint_canvas, 'myCanvas', 'jpg'); }, 30000); // save as file
// setTimeout(() => { console.log(paint_canvas.elt.toDataURL()); }, 30000); // get base64 encode string
function preload() {
}
function setup() {
    $("#qrcode").hide();
    paint_canvas = createCanvas(windowWidth, windowHeight * 0.95);
    paint_canvas.parent("canvas-container");
    frameRate(frame_rate);
    stroke("black");
    strokeWeight(stroke_weight);
    background('black');

    gitDownload({
        owner: 'benjooom',
        repo: 'HCI-Final',
        name: 'images',
        token: TOKEN
    }).then(res => {
        console.log(res);
        // get filename with latest date and time in the format of 2023-4-22_17-42-12.png
        // if the filename is not in the format, it will be ignored.
        var latest = null;
        for (var i = 1; i < res.length; i++) {
            var name = res[i].name;
            console.log(res[i].name);
            if (name.length < 20) {
                continue;
            }
            if (latest == null) {
                latest = name;
                continue;
            }
            // console.log("name", name);

            // console.log(name.split('_'));
            // console.log(latest.split('_'));

            var datec = name.split('_')[0];
            var timec = name.split('_')[1].split('.')[0];
            var date1 = latest.split('_')[0];
            var time1 = latest.split('_')[1].split('.')[0];
            console.log(datec, timec, date1, time1);
            if (datec > date1) {
                latest = name;
            } else if (datec == date1) {
                if (timec > time1) {
                    latest = name;
                }
            }
        }
        old_img_name = latest.split('.')[0];
        console.log("old_img_name", old_img_name);
        gitDownload({
            owner: 'benjooom',
            repo: 'HCI-Final',
            name: `images/${old_img_name}.png`,
            token: TOKEN
        }).then(res1 => {
            console.log(res1);
            if (res1.content != "") {
                loadImage('data:image/png;base64,' + res1.content, function (newImage) {
                    img = newImage;
                });
            }
            img_ready = true;
        });
    });
}

function draw() {
    if (is_paused) {
        console.log("is paused");
        return;
    }
    if (!img_ready) {
        console.log("img not ready");
        return;
    }
    if (!img_done) {
        if (img != null) {
            image(img, 0, 0, width, height);
        }
        img_done = true;
    }

    sec_rem -= 1 / frame_rate;

    if (sec_rem < 0) {
        is_paused = true;

        //Auxiliar graphics object
        let resized = createGraphics(1280 / 2, 720 / 2)

        //Draw and scale the canvas content
        resized.image(paint_canvas, 0, 0, 1280 / 2, 720 / 2)

        //Manipulate the new pixels array
        resized.loadPixels()
        console.log(resized.pixels)
        resizeCanvas(1280 / 2, 720 / 2)
        // Draw the 28x28 just for visual feedback
        image(resized, 0, 0)


        gitUpload({
            owner: 'benjooom',
            repo: 'HCI-Final',
            name: 'images/' + fileName + '.png',
            content: paint_canvas.elt.toDataURL().split('base64,')[1],
            token: TOKEN
        }).then(res => {
            console.log(res);
        });
        $("#progress-bar").text(`Scan the QR code to see your drawing!`);

        $("#qrcode").show();

        setTimeout(() => { window.location.href = 'index.html'; }, 30000);


        //Auxiliar graphics object
        resized = createGraphics(windowWidth, windowHeight * 0.95)

        //Draw and scale the canvas content
        resized.image(paint_canvas, 0, 0, windowWidth, windowHeight * 0.95)

        //Manipulate the new pixels array
        resized.loadPixels()
        console.log(resized.pixels)
        resizeCanvas(windowWidth, windowHeight * 0.95)
        // Draw the 28x28 just for visual feedback
        image(resized, 0, 0)

        return;
    }
    fillPercentage = (init_time - sec_rem) / init_time * 100;
    updateSquareFill(fillPercentage);
    $("#progress-bar").text(`Draw with your body! Time remaining: ${sec_rem.toFixed(1)}`);

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