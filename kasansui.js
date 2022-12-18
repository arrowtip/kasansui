const mainCanvas = document.getElementById("main-canvas");
const context = mainCanvas.getContext('2d');

initialize();

function initialize() {
    window.addEventListener("resize", resizeCanvasEvt, false);
    window.mainCanvas = mainCanvas;
    window.frac = 0.9;
    resizeCanvas(mainCanvas, 0.9);
}

function resizeCanvas(canvas, frac) {
    canvas.width = window.innerWidth * frac;
    canvas.height = window.innerHeight * frac;
}

function resizeCanvasEvt(evt) {
    resizeCanvas(evt.currentTarget.mainCanvas, evt.currentTarget.frac);
}

mainCanvas.addEventListener('mousemove', mousePos, false);

function draw() {
    context.fillStyle = 'red';
    context.fillRect(10, 10, 10, 10);

    var imageData = context.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
    var pixels = imageData.data;

    for (var i = 0; i < pixels.length; i += 4) {
        pixels[i] = 255;
        pixels[i + 1] = 0;
        pixels[i + 2] = 0;
        pixels[i + 3] = 0;
    }

    /*context.putImageData(imageData, 0, 0);*/



    window.requestAnimationFrame(draw);
}

function getMousePos(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

window.requestAnimationFrame(draw);

