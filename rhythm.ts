import { addDrawer, canvas, ctx } from './autoCanvas.js';
import { hex2, map } from './helper.js';
import { CircleNote, Note, NoteType, SideNote } from './noteTypes/index.js';
import { PersistentCircle } from './persistCircle.js';
import { addPersistent } from './persistent.js';
import { PersistentText } from './persistText.js';

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

function addNote(note: Note) {
	currentNotes[note.key] = currentNotes[note.key] ?? [];
	currentNotes[note.key].push(note);
	currentNotes[note.key].sort((a, b) => a.end - b.end);

	allNotes.push(note);
	allNotes.sort((a, b) => a.end - b.end);
}

function timing(lb = 1) {
	return (
		(allNotes[allNotes.length - lb]?.end ?? Date.now()) +
		500 +
		map(0, 100, 5000, 100)(scoreAvg() ?? 0) * Math.random()
	);
}

function createNote(lb = 1): Note {
	if (Math.random() < 0.5) {
		return new CircleNote(timing(lb));
	} else {
		if (Math.random() < 1 / 4) {
			return new SideNote(timing(lb), 'left', '#77bb77');
		} else if (Math.random() < 1 / 3) {
			return new SideNote(timing(lb), 'right', '#bbbb77');
		} else if (Math.random() < 1 / 2) {
			return new SideNote(timing(lb), 'up', '#77bbbb');
		} else {
			return new SideNote(timing(lb), 'down', '#bb7777');
		}
	}
}
const scores: number[] = [];

for (let i = 0; i < 50; i++) {
	const note = createNote(2);
	note.created = allNotes[allNotes.length - 2]?.end ?? Date.now();
	note.lifetimeMapper = map(note.created, note.end, 0, 1);
	addNote(note);
}

function scoreAvg() {
	const out = scores.reduce((a, b) => a + b, 0) / scores.length;
	return isNaN(out) ? 0 : out;
}

const noteCount = 2;
// const color = "#ee5555"

function draw() {
	// if (allNotes.length < noteCount && Math.random() < 0.1) {
	// 	addNote(createNote());
	// }

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
addDrawer(draw);

addEventListener('keydown', (e) => {
	// console.log(e.key);
	const notes = currentNotes[e.key] ?? [];
	if (notes.length > 0 && notes[0].created < Date.now()) {
		const note = notes.shift() as Note;
		allNotes.splice(allNotes.indexOf(note), 1);
		note.score(ctx, scores);
	}
});
