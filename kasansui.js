const mainCanvas = document.getElementById("main-canvas");
const context = mainCanvas.getContext('2d', { willReadFrequently: true });
let pixels = context.createImageData(mainCanvas.width, mainCanvas.height);
/* variables to control frame rate */
const interval = 4;
let delta;
let then = Date.now();

let mousePos = {
    x: 0,
    y: 0,
    pressed: false
}

const sand = {
    r: 242,
    g: 209,
    b: 107,
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
    console.log("mousedown handler triggered");
    mousePos.pressed = true;
}

function mouseUp(evt) {
    console.log("mouseup handler triggered")
    mousePos.pressed = false;
}

function mouseMove(evt) {
    console.log("mousemove handler triggered");
    mousePos.x = (evt.offsetX == undefined ? evt.layerX : evt.offsetX);
    mousePos.y = (evt.offsetY == undefined ? evt.layerY : evt.offsetY);
}

function addListeners() {
    mainCanvas.addEventListener("mousedown", mouseDown, false);
    /* resize events are only fired on the window object */
    window.addEventListener("resize", resize, false);
    mainCanvas.addEventListener("mousemove", mouseMove, false);
    window.addEventListener("mouseup", mouseUp, false);
}

function animate() {
    console.log(pixels.width);
    console.log(mainCanvas.width);
    for (let i = pixels.data.length - pixels.width * 4 - 4; i >= 0; i -= 4) {
        /* test if alpha channel is zero (aka pixel empty) */
        if (pixels.data[i + 3] != 0) {
            /* test if pixel underneath is free */
            if (pixels.data[i + pixels.width * 4 + 3] == 0) {
                setMaterial(pixels.data, i, nothing);
                setMaterial(pixels.data, i + pixels.width * 4, sand);
                /* test if pixel to the bottom left is free and not outside the box */
            } else if ((i % (pixels.width * 4) != 0) && pixels.data[i + pixels.width * 4 - 1] == 0) {
                setMaterial(pixels.data, i, nothing);
                setMaterial(pixels.data, i + pixels.width * 4 - 4, sand);
                /* test if pixel to the bottom right is free and not outside the box */
            } else if (((i + 4) % (pixels.width * 4) != 0) && pixels.data[i + pixels.width * 4 + 4 + 3] == 0) {
                setMaterial(pixels.data, i, nothing);
                setMaterial(pixels.data, i + pixels.width * 4 + 4, sand);
            }
        }
    }
}


function draw() {
    window.requestAnimationFrame(draw);

    let now = Date.now();
    delta = now - then;
    if (delta > interval) {
        then = now - (delta % interval);
        if (mousePos.pressed) {
            setMaterial(pixels.data, 4 * mousePos.y * mainCanvas.width + 4 * mousePos.x, sand);
        }

        animate()

        context.putImageData(pixels, 0, 0);
    }
}

addListeners();
resize();

console.log("initialization done!");

draw();



