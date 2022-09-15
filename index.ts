import { canvas, ctx } from './autoCanvas.js';

let point = newPoint();
const scores: number[] = [];
function newPoint() {
	return {
		x: Math.random() * innerWidth,
		y: Math.random() * innerHeight,
		clicked: false,
		created: Date.now(),
	};
}

newPoint();

function mapScore(score) {
	return 1000 * (1 - Math.atan(score / 1000) / Math.PI);
}

function mapDistance(score) {
	return Math.atan(score - 10) / Math.PI + 0.5;
}

function draw() {
	ctx.clearRect(0, 0, innerWidth, innerHeight);

	if (!point.clicked) {
		ctx.fillStyle = 'red';
		ctx.fillRect(point.x, point.y, 10, 10);
	}

	//score text
	ctx.fillStyle = 'white';
	ctx.font = '30px Arial';
	ctx.fillText(
		'Score: ' + Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
		10,
		50
	);

	requestAnimationFrame(draw);
}
draw();

canvas.addEventListener('click', (e) => {
	if (point.clicked) return;
	point.clicked = true;
	scores.push(
		mapScore(
			(Date.now() - point.created) *
				mapDistance(Math.hypot(e.clientX, e.clientY, point.x, point.y))
		)
	);

	console.log(scores.reduce((a, b) => a + b, 0) / scores.length);

	setTimeout(() => {
		point = newPoint();
	}, 10000 * Math.random());
});
