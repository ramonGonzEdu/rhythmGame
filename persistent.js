import { addDrawer, ctx } from './autoCanvas.js';
import { map } from './helper.js';
export class Persistent {
    constructor(deathTime){
        this.deathTime = deathTime;
        this.birthTime = Date.now();
        this.deathTime = deathTime;
        this.birthTime = Date.now();
        this.lifeMapper = map(this.birthTime, this.deathTime, 0, 1);
    }
    lifetimeLeft() {
        return this.deathTime - Date.now();
    }
}
const persistentItems = [];
export function addPersistent(persistentItem) {
    persistentItems.push(persistentItem);
}
function drawPersistent() {
    for(let i = persistentItems.length - 1; i >= 0; i--){
        if (persistentItems[i].lifetimeLeft() > 0) {
            persistentItems[i].draw(ctx);
        } else {
            persistentItems.splice(i, 1);
        }
    }
}
addDrawer(drawPersistent);
