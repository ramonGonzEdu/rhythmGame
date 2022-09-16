import { addDrawer, ctx } from './autoCanvas.js';
import { Note } from './noteTypes/index.js';

const currentNotes: { [key: string]: Note[] } = {};

function getAllNotes() {
	const out: Note[] = [];
	for (const key in currentNotes) {
		out.push(...currentNotes[key]);
	}
	out.sort((a, b) => a.end - b.end);
	return out;
}

const allNotes = getAllNotes();

export function addNote(note: Note) {
	currentNotes[note.key] = currentNotes[note.key] ?? [];
	currentNotes[note.key].push(note);
	currentNotes[note.key].sort((a, b) => a.end - b.end);

	allNotes.push(note);
	allNotes.sort((a, b) => a.end - b.end);
}

const scores: number[] = [];

function scoreAvg() {
	const out = scores.reduce((a, b) => a + b, 0) / scores.length;
	return isNaN(out) ? 0 : out;
}

function draw() {
	if (allNotes[0]?.isDead()) {
		const note = allNotes.shift() as Note;
		currentNotes[note.key].shift();
		note.score(ctx, scores, -100);
	}

	for (const note of allNotes) {
		if (note.created < Date.now()) {
			note.draw(ctx);
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

export function startGame() {
	addDrawer(draw);

	addEventListener('keyup', (e) => {
		// console.log(e.key);
		const notes = currentNotes[e.key] ?? [];
		if (notes.length > 0 && notes[0].created < Date.now()) {
			const note = notes.shift() as Note;
			allNotes.splice(allNotes.indexOf(note), 1);
			note.score(ctx, scores);
		}
	});
}
