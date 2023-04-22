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
			if(e.animationName === 'goIn' && idx !== penultimate){
				num.classList.remove('in');
				num.classList.add('out');
			} else if (e.animationName === 'goOut' && num.nextElementSibling){
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
let qr;
function preload() {
    qr = loadImage("images/qr-sample.jpg");
}
function setup() {
    paint_canvas = createCanvas(windowWidth, windowHeight * 0.95);
    paint_canvas.parent("canvas-container");
    frameRate(frame_rate);
    stroke("black");
    strokeWeight(stroke_weight);
    background('black');

}

function draw() {
    if (is_paused) {
        return;
    }
    sec_rem -= 1 / frame_rate;
    
    if (sec_rem < 0) {
        is_paused = true;
        image(qr, width/2, height / 2, width / 4, width / 4);
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