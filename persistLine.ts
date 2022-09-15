import { hex2 } from './helper.js';
import { Persistent } from './persistent.js';

export class PersistentLine extends Persistent {
	constructor(
		public x: number,
		public y: number,
		public rot: number,
		public color: string,
		public height = 2000
	) {
		super(Date.now() + 1000);
		this.x = x;
		this.y = y;
		this.rot = rot;
		this.color = color;
		this.height = height;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.fillStyle = this.color + hex2((1 - this.lifeMapper(Date.now())) * 255);
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rot);
		ctx.fillRect(
			-25 * this.lifeMapper(Date.now()),
			-this.height / 2,
			50 * this.lifeMapper(Date.now()),
			this.height
		);
		ctx.restore();
	}
}
