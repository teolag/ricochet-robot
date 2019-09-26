export class Robot {
    constructor(id, x, y) {
        this.id = id;
        this.color = id;
        this.x = x;
        this.y = y;
    }
    getPos() {
        return { x: this.x, y: this.y };
    }
    setPos(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }
    clone() {
        return new Robot(this.id, this.x, this.y);
    }
}
export function cloneRobots(robots) {
    return robots.map(r => r.clone());
}
