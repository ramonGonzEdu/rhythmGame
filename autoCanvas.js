export const canvas = document.createElement('canvas');
function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
addEventListener('resize', resize);
resize();
export const ctx = canvas.getContext('2d');
if (!ctx) throw 'No context';
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.background = '#262626';
const drawers = [];
export function addDrawer(drawer) {
    drawers.push(drawer);
}
function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const drawer of drawers){
        drawer();
    }
    requestAnimationFrame(draw);
}
draw();
