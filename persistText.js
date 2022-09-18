import { hex2 } from './helper.js';
import { Persistent } from './persistent.js';
export class PersistentText extends Persistent {
    constructor(text, color, x, y, deathTime = Date.now() + 1000){
        super(deathTime);
        this.text = text;
        this.color = color;
        this.x = x;
        this.y = y;
        this.rotation = Math.random() - 0.5;
        this.text = text;
        this.color = color;
        this.x = x;
        this.y = y;
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color + hex2((1 - this.lifeMapper(Date.now())) * 255);
        ctx.font = '60px Arial Black';
        const w = ctx.measureText(this.text).width / 2;
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI * this.lifeMapper(Date.now()) * this.rotation);
        ctx.translate(-w, 25);
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
    }
}
