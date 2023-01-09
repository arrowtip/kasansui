const mainCanvas = document.getElementById("main-canvas");
const context = mainCanvas.getContext('2d', { willReadFrequently: true });
let pixels = context.createImageData(mainCanvas.width, mainCanvas.height);
/* variables to control frame rate */
const interval = 32;
let delta;
let then = Date.now();
let leftToRight = true;

let play = true;
let gravity = 1;
let startStopButtons = document.getElementsByClassName("button-play");
let gravitySliders = document.getElementsByClassName("slider-gravitation");

let velocities = [];

let mousePos = {
    x: 0,
    y: 0,
    pressed: false
}

const sand = {
    r: 255,
    g: 255,
    b: 0,
    a: 255
}

const nothing = {
    r: 0,
    g: 0,
    b: 0,
    a: 0
}

function setMaterial(array, startingIndex, material) {
    array[startingIndex] = material.r;
    array[startingIndex + 1] = material.g;
    array[startingIndex + 2] = material.b;
    array[startingIndex + 3] = material.a;
}

function gravityChange(value) {
    // console.log("gravity change: " + value);
    for (let gravitySlider of gravitySliders) {
        gravitySlider.value = value;
    }
    gravity = parseInt(value);
}

function reset() {
    // console.log("reset triggered");
    context.clearRect(0, 0, pixels.width, pixels.height);
    pixels = context.getImageData(0, 0, pixels.width, pixels.height);
}

function startStop() {
    play = !play;
    for (let playButton of startStopButtons) {
        if (play) {
            playButton.innerHTML = "stop";
        } else {
            playButton.innerHTML = "start";
        }
    }
}

function resize() {
    /*
    console.log("resize handler triggered");
    console.log("clientHeight: " + mainCanvas.clientHeight);
    console.log("Height: " + mainCanvas.height);
    mainCanvas.height = mainCanvas.clientHeight / 2;
    mainCanvas.width = mainCanvas.clientWidth / 2;
    console.log("clientHeight2: " + mainCanvas.clientHeight);
    console.log("Height2: " + mainCanvas.height);
    */
    let parent = mainCanvas.parentElement;
    mainCanvas.width = parent.offsetWidth;
    mainCanvas.height = parent.offsetHeight;
    pixels = context.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
}

function mouseDown(evt) {
    // console.log("mousedown handler triggered");
    mousePos.x = (evt.offsetX == undefined ? evt.layerX : evt.offsetX);
    mousePos.y = (evt.offsetY == undefined ? evt.layerY : evt.offsetY);
    mousePos.pressed = true;
}

function mouseUp(evt) {
    // console.log("mouseup handler triggered")
    mousePos.pressed = false;
}

function mouseMove(evt) {
    // console.log("mousemove handler triggered");
    mousePos.x = (evt.offsetX == undefined ? evt.layerX : evt.offsetX);
    mousePos.y = (evt.offsetY == undefined ? evt.layerY : evt.offsetY);
}

function touchStart(evt) {
    // console.log("touchstart");
    evt.preventDefault();
    mousePos.x = parseInt(evt.touches[0].clientX - mainCanvas.getBoundingClientRect().left);
    mousePos.y = parseInt(evt.touches[0].clientY - mainCanvas.getBoundingClientRect().top);
    mousePos.pressed = true;
}

function touchEnd(evt) {
    // console.log("touchend");
    evt.preventDefault();
    mousePos.pressed = false;
}

function touchMove(evt) {
    // console.log("touchmove");
    evt.preventDefault();
    mousePos.x = parseInt(evt.touches[0].clientX - mainCanvas.getBoundingClientRect().left);
    mousePos.y = parseInt(evt.touches[0].clientY - mainCanvas.getBoundingClientRect().top);
}

function touchCancel(evt) {
    // console.log("touchcancel");
    evt.preventDefault();
    mousePos.pressed = false;
}

function addListeners() {
    mainCanvas.addEventListener("mousedown", mouseDown, false);
    /* resize events are only fired on the window object */
    window.addEventListener("resize", resize, false);
    mainCanvas.addEventListener("mousemove", mouseMove, false);
    window.addEventListener("mouseup", mouseUp, false);
    mainCanvas.addEventListener("touchstart", touchStart, false);
    mainCanvas.addEventListener("touchend", touchEnd, false);
    mainCanvas.addEventListener("touchmove", touchMove, false);
    mainCanvas.addEventListener("touchcancel", touchCancel, false);

}

function animate() {
    for (let y = pixels.height - 2; y >= 0; y--) {
        /* hole leftToRight stuff necessary so sand flows symmetrically */
        for (let x = (leftToRight ? 0 : pixels.width - 1); 
        (leftToRight ? x < pixels.width : x > 0); (leftToRight ? x++ : x--)) {
            let i = pixels.width * 4 * y + 4 * x;

            if (pixels.data[i + 3] != 0) {
                let currVelo = velocities[i];
                let targetIndex = i;
                let targetVelo = currVelo + gravity;
                while (currVelo > 0 && targetIndex < pixels.data.length - pixels.width * 4) {
                    /* test if pixel underneath is free */
                    if (pixels.data[targetIndex + pixels.width * 4 + 3] == 0) {
                        targetIndex += pixels.width * 4;
                        currVelo--;
                    /* test if pixel to the bottom right is free and not outside the box */
                    } else if (((targetIndex + 4) % (pixels.width * 4) != 0) 
                            && pixels.data[targetIndex + pixels.width * 4 + 7] == 0) {
                        targetIndex += pixels.width * 4 + 4;
                        currVelo -= 2;
                        targetVelo -= 2;
                    /* test if pixel to the bottom left is free and not outside the box */
                    } else if ((targetIndex % (pixels.width * 4) != 0) 
                            && pixels.data[targetIndex + pixels.width * 4 - 1] == 0) {
                        targetIndex += pixels.width * 4 - 4;
                        currVelo -= 2;
                        targetVelo -= 2;
                    } else {
                        targetVelo = 0;
                        break;
                    }
                }
                setMaterial(pixels.data, i, nothing);
                velocities[i] = undefined;
                setMaterial(pixels.data, targetIndex, sand);
                velocities[targetIndex] = Math.max(targetVelo, 1);
            }
        }
    }
    leftToRight = !leftToRight;
}

function addSand(radius) {
    let xPos = mousePos.x - radius + Math.floor(Math.random() * (2 * (radius + 1)));
    let yPos = mousePos.y - radius + Math.floor(Math.random() * (2 * (radius + 1)));
    if (xPos >= 0 && xPos < pixels.width
            && yPos >= 0 && yPos < pixels.height) {
        setMaterial(pixels.data, yPos * 4 * pixels.width + 4 * xPos, sand);
        velocities[yPos * 4 * pixels.width + 4 * xPos] = 1;
    }
}

function draw() {
    window.requestAnimationFrame(draw);

    let now = Date.now();
    delta = now - then;
    if (delta > interval) {
        then = now - (delta % interval);
        if (mousePos.pressed) {
            //setMaterial(pixels.data, 4 * mousePos.y * mainCanvas.width + 4 * mousePos.x, sand);
            for (let i = 0; i <= pixels.width / 20; i += 1) {
                addSand(i);
            }
        }

        if (play) {
            animate()
        }

        context.putImageData(pixels, 0, 0);
    }
}

addListeners();
resize();

console.log("initialization done!");

draw();



