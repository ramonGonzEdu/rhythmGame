import { addDrawer, ctx } from './autoCanvas.js';
import { map } from './helper.js';

export interface IPersistent {
	draw(ctx: CanvasRenderingContext2D): void;
	lifetimeLeft(): number;
}

export abstract class Persistent implements IPersistent {
	birthTime = Date.now();
	lifeMapper: (n: number) => number;

	abstract draw(ctx: CanvasRenderingContext2D): void;

	constructor(public deathTime: number) {
		this.deathTime = deathTime;
		this.birthTime = Date.now();
		this.lifeMapper = map(this.birthTime, this.deathTime, 0, 1);
	}

	lifetimeLeft(): number {
		return this.deathTime - Date.now();
	}
}

const persistentItems: Persistent[] = [];

export function addPersistent(persistentItem: Persistent) {
	persistentItems.push(persistentItem);
}

function drawPersistent() {
	for (let i = persistentItems.length - 1; i >= 0; i--) {
		if (persistentItems[i].lifetimeLeft() > 0) {
			persistentItems[i].draw(ctx);
		} else {
			persistentItems.splice(i, 1);
		}
	}
}

addDrawer(drawPersistent);
