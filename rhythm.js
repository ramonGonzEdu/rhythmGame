import { addDrawer, ctx } from './autoCanvas.js';
const currentNotes = {};
function getAllNotes() {
    const out = [];
    for(const key in currentNotes){
        out.push(...currentNotes[key]);
    }
    out.sort((a, b)=>a.end - b.end);
    return out;
}
const allNotes = getAllNotes();
export function addNote(note) {
    currentNotes[note.key] = currentNotes[note.key] ?? [];
    currentNotes[note.key].push(note);
    currentNotes[note.key].sort((a, b)=>a.end - b.end);
    allNotes.push(note);
    allNotes.sort((a, b)=>a.end - b.end);
}
const scores = [];
function scoreAvg() {
    const out = scores.reduce((a, b)=>a + b, 0) / scores.length;
    return isNaN(out) ? 0 : out;
}
function draw() {
    if (allNotes[0]?.isDead()) {
        const note = allNotes.shift();
        currentNotes[note.key].shift();
        note.score(ctx, scores, -100);
    }
    for (const note1 of allNotes){
        if (note1.created < Date.now()) {
            note1.draw(ctx);
        }
    }
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Score: ' + Math.round(scores.reduce((a, b)=>a + b, 0)), 10, 50);
    ctx.fillText('Avg: ' + Math.round(scoreAvg()), 10, 100);
}
export function startGame() {
    addDrawer(draw);
    addEventListener('keydown', (e)=>{
        const notes = currentNotes[e.key] ?? [];
        if (notes.length > 0 && notes[0].created < Date.now()) {
            const note = notes.shift();
            allNotes.splice(allNotes.indexOf(note), 1);
            note.score(ctx, scores);
        }
    });
}
