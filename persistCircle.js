import { hex2 } from './helper.js';
import { Persistent } from './persistent.js';
export class PersistentCircle extends Persistent {
    constructor(x, y, size, color){
        super(Date.now() + 1000);
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
    draw(ctx) {
        ctx.strokeStyle = this.color + hex2((1 - this.lifeMapper(Date.now())) * 128);
        ctx.lineWidth = 10;
        ctx.fillStyle = this.color + hex2((1 - this.lifeMapper(Date.now())) * 50);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + this.lifeMapper(Date.now()) * 100, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + this.lifeMapper(Date.now()) * 500, 0, Math.PI * 2);
        ctx.fill();
    }
}
