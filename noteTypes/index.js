import { hex2, map } from '../helper.js';
import { PersistentCircle } from '../persistCircle.js';
import { addPersistent } from '../persistent.js';
import { PersistentLine } from '../persistLine.js';
import { PersistentText } from '../persistText.js';
const scoreMap = [
    [
        97,
        'P E R F E C T',
        '#6644ee'
    ],
    [
        80,
        'G R E A T',
        '#66cc99'
    ],
    [
        60,
        'G O O D',
        '#eecc33'
    ],
    [
        40,
        'O K',
        '#ee7733'
    ],
    [
        0,
        'B A D',
        '#ee2233'
    ],
    [
        -Infinity,
        'M I S S',
        '#882233'
    ], 
];
export function scoreToColor(score) {
    for (const [min, text, color] of scoreMap){
        if (score >= min) {
            return [
                text,
                color
            ];
        }
    }
    return [
        'error',
        '#000000'
    ];
}
export class Note {
    isDead() {
        return this.end < Date.now();
    }
    constructor(end){
        this.end = end;
        this.key = '';
        this.created = Date.now();
        this.end = end;
        this.lifetimeMapper = map(this.created, this.end, 0, 1);
    }
}
export class CircleNote extends Note {
    static maxCircleSize = 1920;
    constructor(end, color = '#bb77bb', x = Math.random() * innerWidth, y = Math.random() * innerHeight, size = 50 + Math.random() * 100){
        super(end);
        this.end = end;
        this.color = color;
        this.x = x;
        this.y = y;
        this.size = size;
        this.key = ' ';
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    isDead() {
        return map(this.created, this.end, CircleNote.maxCircleSize, this.size)(Date.now()) < 0;
    }
    score(ctx, scores, score = 100 - Math.abs(map(this.created, this.end, -200, 0)(Date.now()))) {
        scores.push(score);
        const [text, color] = scoreToColor(score);
        addPersistent(new PersistentText(text, color, this.x, this.y));
        addPersistent(new PersistentCircle(this.x, this.y, this.size, color));
    }
    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 10;
        ctx.fillStyle = this.color + hex2(this.lifetimeMapper(Date.now()) ** 5 * 180);
        ctx.beginPath();
        if (map(this.created, this.end, CircleNote.maxCircleSize, this.size)(Date.now()) > 0) ctx.arc(this.x, this.y, map(this.created, this.end, CircleNote.maxCircleSize, this.size)(Date.now()), 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        if (Date.now() - this.created < 200) ctx.arc(this.x, this.y, map(this.created, this.created + 200, 0, this.size)(Date.now()), 0, Math.PI * 2);
        else ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
    }
}
export class SideNote extends Note {
    constructor(end, type, color = '#bb77bb'){
        super(end);
        this.end = end;
        this.type = type;
        this.color = color;
        this.type = type;
        this.color = color;
        if (type === 'left') {
            this.key = 'ArrowLeft';
        } else if (type === 'right') {
            this.key = 'ArrowRight';
        } else if (type === 'up') {
            this.key = 'ArrowUp';
        } else if (type === 'down') {
            this.key = 'ArrowDown';
        }
    }
    isDead() {
        return this.end < Date.now() - 1000;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 10;
        const lt = this.lifetimeMapper(Date.now()) ** 2 * 1.1 - 0.1;
        ctx.beginPath();
        if (this.type === 'left') {
            ctx.moveTo((1 - lt) * innerWidth, 0);
            ctx.lineTo((1 - lt) * innerWidth, innerHeight);
        } else if (this.type === 'right') {
            ctx.moveTo(lt * innerWidth, 0);
            ctx.lineTo(lt * innerWidth, innerHeight);
        } else if (this.type === 'up') {
            ctx.moveTo(0, (1 - lt) * innerHeight);
            ctx.lineTo(innerWidth, (1 - lt) * innerHeight);
        } else if (this.type === 'down') {
            ctx.moveTo(0, lt * innerHeight);
            ctx.lineTo(innerWidth, lt * innerHeight);
        }
        ctx.stroke();
    }
    score(ctx, scores, score = 100 - Math.abs(map(this.created, this.end, -200, 0)(Date.now()))) {
        scores.push(score);
        const [text, color] = scoreToColor(score);
        addPersistent(new PersistentText(text, color, this.type == 'left' ? 100 : this.type == 'right' ? innerWidth - 100 : innerWidth / 2, this.type == 'up' ? 100 : this.type == 'down' ? innerHeight - 100 : innerHeight / 2));
        const lt = this.lifetimeMapper(Date.now()) ** 2 * 1.1 - 0.1;
        addPersistent(new PersistentLine(this.type == 'left' ? (1 - lt) * innerWidth : this.type == 'right' ? lt * innerWidth : innerWidth / 2, this.type == 'up' ? (1 - lt) * innerHeight : this.type == 'down' ? lt * innerHeight : innerHeight / 2, this.type == 'left' || this.type == 'right' ? 0 : Math.PI / 2, color));
    }
}
