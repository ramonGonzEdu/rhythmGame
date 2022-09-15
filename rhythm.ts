import { addDrawer, canvas, ctx } from './autoCanvas.js';
import { hex2, map } from './helper.js';
import { Note, NoteType } from './noteTypes/index.js';
import { PersistentCircle } from './persistCircle.js';
import { addPersistent } from './persistent.js';
import { PersistentText } from './persistText.js';

const currentNotes: Note[] = [];

function createCircle(): Note {
	return {
		type: 'circle',
		x: Math.random() * innerWidth,
		y: Math.random() * innerHeight,
		created: Date.now(),
		end:
			(currentNotes[currentNotes.length - 1]?.end ?? Date.now()) +
			500 +
			map(0, 100, 5000, 1000)(scoreAvg() ?? 0) * Math.random(),
		size: 50 + Math.random() * 100,
	};
}
const scores: number[] = [];

function scoreAvg() {
	const out = scores.reduce((a, b) => a + b, 0) / scores.length;
	return isNaN(out) ? 0 : out;
}

const maxCircleSize = 1920;

const circleCount = 2;
// const color = "#ee5555"
const color = '#bb77bb';

const params = new URLSearchParams(location.search);

function draw() {
	if (currentNotes.length < circleCount && Math.random() < 0.1) {
		currentNotes.push(createCircle());
	}

	if (
		currentNotes[0] &&
		map(
			currentNotes[0].created,
			currentNotes[0].end,
			maxCircleSize,
			currentNotes[0].size
		)(Date.now()) < 0
	) {
		currentNotes.shift();
		scores.push(-100);
	}

	ctx.strokeStyle = color;
	ctx.lineWidth = 10;
	for (const circle of currentNotes) {
		if (circle.created < Date.now()) {
			ctx.fillStyle =
				color + hex2(map(circle.created, circle.end, 0, 180)(Date.now()));
			ctx.beginPath();
			if (
				map(
					circle.created,
					circle.end,
					maxCircleSize,
					circle.size
				)(Date.now()) > 0
			)
				ctx.arc(
					circle.x,
					circle.y,
					map(
						circle.created,
						circle.end,
						maxCircleSize,
						circle.size
					)(Date.now()),
					0,
					Math.PI * 2
				);
			ctx.fill();

			ctx.beginPath();
			if (Date.now() - circle.created < 200)
				ctx.arc(
					circle.x,
					circle.y,
					map(circle.created, circle.created + 200, 0, circle.size)(Date.now()),
					0,
					Math.PI * 2
				);
			else ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
			ctx.stroke();
		}
	}

	//score text
	ctx.fillStyle = 'white';
	ctx.font = '30px Arial';
	ctx.fillText(
		'Score: ' + Math.round(scores.reduce((a, b) => a + b, 0)),
		10,
		50
	);

	ctx.fillText('Avg: ' + Math.round(scoreAvg()), 10, 100);
}
addDrawer(draw);

const scoreMap: [number, string, string][] = [
	[97, 'P E R F E C T', '#6644ee'],
	[80, 'G R E A T', '#66cc99'],
	[60, 'G O O D', '#eecc33'],
	[40, 'O K', '#ee7733'],
	[0, 'B A D', '#ee2233'],
	[-Infinity, 'M I S S', '#882233'],
];

addEventListener('keydown', (e) => {
	if (e.key == ' ') {
		const circle = currentNotes.shift();
		if (circle) {
			const score =
				100 - Math.abs(map(circle.created, circle.end, -200, 0)(Date.now()));
			scores.push(score);

			for (let level of scoreMap) {
				if (score > level[0]) {
					addPersistent(
						new PersistentText(level[1], level[2], circle.x, circle.y)
					);
					addPersistent(
						new PersistentCircle(circle.x, circle.y, circle.size, level[2])
					);

					break;
				}
			}
		}
	}
});
