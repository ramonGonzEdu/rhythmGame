import { canvas } from './autoCanvas.js';
import { BlobReader, BlobWriter, TextWriter, ZipReader } from './deps/zipjs/index.js';
import { map } from './helper.js';
import { CircleNote, SideNote } from './noteTypes/index.js';
import { addNote, startGame } from './rhythm.js';
import { SoundPlayer } from './sound.js';
console.log('hi');
const input = document.createElement('input');
input.type = 'file';
input.accept = '.zip';
document.body.appendChild(input);
async function readJSON(zip, fName) {
    return JSON.parse(await zip.find((x)=>x.filename == fName).getData(new TextWriter()));
}
canvas.hidden = true;
input.addEventListener('change', async (e)=>{
    const file = e.target.files[0];
    const blobReader = new BlobReader(file);
    const zipReader = new ZipReader(blobReader);
    const files = await zipReader.getEntries();
    console.log(files);
    const songInfo = await readJSON(files, 'Info.dat');
    const songDifficulties = songInfo._difficultyBeatmapSets[0]._difficultyBeatmaps.map((x)=>[
            x._difficulty,
            x._beatmapFilename, 
        ]);
    const songAudio = await files.find((x)=>x.filename == songInfo._songFilename).getData(new BlobWriter());
    const songAudioUrl = URL.createObjectURL(songAudio);
    const songAudioElement = new Audio(songAudioUrl);
    input.parentElement?.removeChild(input);
    const difficultySelect = document.createElement('select');
    for (const [difficulty, beatmap] of songDifficulties){
        const option = document.createElement('option');
        option.value = beatmap;
        option.innerText = difficulty;
        difficultySelect.appendChild(option);
    }
    document.body.appendChild(difficultySelect);
    const nthNoteSelect = document.createElement('select');
    for(let i = 1; i <= 10; i++){
        const option1 = document.createElement('option');
        option1.value = i.toString();
        option1.innerText = i.toString();
        nthNoteSelect.appendChild(option1);
    }
    document.body.appendChild(nthNoteSelect);
    const startButton = document.createElement('button');
    startButton.innerText = 'Start';
    document.body.appendChild(startButton);
    startButton.addEventListener('click', async ()=>{
        const beatmap = await readJSON(files, difficultySelect.value);
        startButton.parentElement?.removeChild(startButton);
        difficultySelect.parentElement?.removeChild(difficultySelect);
        nthNoteSelect.parentElement?.removeChild(nthNoteSelect);
        canvas.hidden = false;
        setTimeout(()=>songAudioElement.play(), 100);
        const songStart = Date.now() + 100;
        const beatSize = 60000 / songInfo._beatsPerMinute;
        const hMap = map(-1, 4, 0, canvas.width);
        const vMap = map(-1, 3, 0, canvas.height);
        const noteTime = 3000;
        console.log(beatmap);
        if ('_version' in beatmap) {
            beatmap._notes.filter((x)=>x._type < 2 && (x._cutDirection < 4 || x._cutDirection == 8)).map((x)=>{
                if (x._cutDirection == 8) {
                    const note = new CircleNote(songStart + x._time * beatSize, undefined, hMap(x._lineIndex), vMap(x._lineLayer));
                    note.created = note.end - noteTime;
                    note.lifetimeMapper = map(note.created, note.end, 0, 1);
                    return note;
                } else if (x._cutDirection == 0) {
                    const note1 = new SideNote(songStart + x._time * beatSize, 'up', '#bbbb77');
                    note1.created = note1.end - noteTime;
                    note1.lifetimeMapper = map(note1.created, note1.end, 0, 1);
                    return note1;
                } else if (x._cutDirection == 1) {
                    const note2 = new SideNote(songStart + x._time * beatSize, 'down', '#bb5555');
                    note2.created = note2.end - noteTime;
                    note2.lifetimeMapper = map(note2.created, note2.end, 0, 1);
                    return note2;
                } else if (x._cutDirection == 2) {
                    const note3 = new SideNote(songStart + x._time * beatSize, 'left', '#77bb77');
                    note3.created = note3.end - noteTime;
                    note3.lifetimeMapper = map(note3.created, note3.end, 0, 1);
                    return note3;
                } else if (x._cutDirection == 3) {
                    const note4 = new SideNote(songStart + x._time * beatSize, 'right', '#5555bb');
                    note4.created = note4.end - noteTime;
                    note4.lifetimeMapper = map(note4.created, note4.end, 0, 1);
                    return note4;
                }
            }).filter((x, i)=>i % +nthNoteSelect.value == 0).forEach((x)=>addNote(x));
        } else {
            beatmap.colorNotes.filter((x)=>x.d < 4 || x.d == 8).map((x)=>{
                if (x.d == 8) {
                    const note = new CircleNote(songStart + x.b * beatSize, undefined, hMap(x.x), vMap(x.y));
                    note.created = note.end - noteTime;
                    note.lifetimeMapper = map(note.created, note.end, 0, 1);
                    return note;
                } else if (x.d == 0) {
                    const note1 = new SideNote(songStart + x.b * beatSize, 'up', '#bbbb77');
                    note1.created = note1.end - noteTime;
                    note1.lifetimeMapper = map(note1.created, note1.end, 0, 1);
                    return note1;
                } else if (x.d == 1) {
                    const note2 = new SideNote(songStart + x.b * beatSize, 'down', '#bb5555');
                    note2.created = note2.end - noteTime;
                    note2.lifetimeMapper = map(note2.created, note2.end, 0, 1);
                    return note2;
                } else if (x.d == 2) {
                    const note3 = new SideNote(songStart + x.b * beatSize, 'left', '#77bb77');
                    note3.created = note3.end - noteTime;
                    note3.lifetimeMapper = map(note3.created, note3.end, 0, 1);
                    return note3;
                } else if (x.d == 3) {
                    const note4 = new SideNote(songStart + x.b * beatSize, 'right', '#5555bb');
                    note4.created = note4.end - noteTime;
                    note4.lifetimeMapper = map(note4.created, note4.end, 0, 1);
                    return note4;
                }
            }).filter((x, i)=>i % +nthNoteSelect.value == 0).forEach((x)=>addNote(x));
        }
        startGame();
    });
});
const audio = new SoundPlayer('/assets/hit.mp3', 0.193);
addEventListener('keydown', ()=>{
    audio.play();
});
startGame;
