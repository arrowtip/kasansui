const mainCanvas = document.getElementById("main-canvas");

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

const context = mainCanvas.getContext('2d');
const particles = new Array(mainCanvas.width)
    .fill(0)
    .map(x => new Array(mainCanvas.height)
    .fill(0));

function draw() {
    const myImageData = context.createImageData(mainCanvas.width, mainCanvas.height);
    context.fillStyle = 'red';
    context.fillRect(10, 10, 10, 10);

    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);

