import { hex2 } from './helper.js';
import { Persistent } from './persistent.js';

export class PersistentText extends Persistent {
	rotation = Math.random() - 0.5;

	constructor(
		public text: string,
		public color: string,
		public x: number,
		public y: number,
		deathTime: number = Date.now() + 1000
	) {
		super(deathTime);
		this.text = text;
		this.color = color;
		this.x = x;
		this.y = y;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.save();

		ctx.fillStyle = this.color + hex2((1 - this.lifeMapper(Date.now())) * 255);
		// ctx.strokeStyle = this.color ;

		ctx.font = '60px Arial Black';
		const w = ctx.measureText(this.text).width / 2;
		ctx.translate(this.x, this.y);
		ctx.rotate(Math.PI * this.lifeMapper(Date.now()) * this.rotation);
		ctx.translate(-w, 25);

		ctx.fillText(this.text, 0, 0);
		// ctx.strokeText(this.text, this.x - w, this.y + 25);
		ctx.restore();
	}
}
