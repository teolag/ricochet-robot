import * as Slumpa from './Slumpa.js';
export var Wall;
(function (Wall) {
    Wall[Wall["NORTH"] = 1] = "NORTH";
    Wall[Wall["WEST"] = 2] = "WEST";
    Wall[Wall["EAST"] = 4] = "EAST";
    Wall[Wall["SOUTH"] = 8] = "SOUTH";
})(Wall || (Wall = {}));
export class Board {
    constructor(height, width) {
        this.h = height;
        this.w = width;
        this.tiles = new Array(height).fill(null).map(() => new Array(width).fill(0));
        this.addTopWalls();
        this.addBottomWalls();
        this.addLeftWalls();
        this.addRightWalls();
    }
    addWall(x, y, wall) {
        if (x < 0 || x >= this.w)
            throw Error(`x must be between 0 and ${this.w - 1}, was: ${x}`);
        if (y < 0 || y >= this.h)
            throw Error(`y must be between 0 and ${this.h - 1}, was: ${y}`);
        this.addSingleWall(x, y, wall);
        const neighbour = this.getTileBehindTheWall(x, y, wall);
        if (neighbour) {
            const oppositeWall = this.getOppositeWall(wall);
            this.addSingleWall(neighbour.x, neighbour.y, oppositeWall);
        }
    }
    addRandomWalls(wallCount) {
        let builtWalls = 0;
        let attempt = 0;
        while (builtWalls < wallCount && attempt < 1000) {
            attempt++;
            const wallType = Slumpa.randomOne([Wall.NORTH, Wall.EAST, Wall.WEST, Wall.SOUTH]);
            const x = Slumpa.randomInt(0, this.w - 1);
            const y = Slumpa.randomInt(0, this.h - 1);
            const hasWall = this.tiles[y][x] & wallType;
            if (hasWall)
                continue;
            this.addWall(x, y, wallType);
            builtWalls++;
        }
    }
    hasWall(x, y, wall) {
        return (this.tiles[y][x] & wall) !== 0;
    }
    addSingleWall(x, y, wall) {
        const value = this.tiles[y][x];
        this.tiles[y][x] = value | wall;
    }
    getTileBehindTheWall(x, y, wall) {
        if (wall === Wall.NORTH && y > 0)
            return { x, y: y - 1 };
        if (wall === Wall.WEST && x > 0)
            return { x: x - 1, y };
        if (wall === Wall.EAST && x + 1 < this.w)
            return { x: x + 1, y };
        if (wall === Wall.SOUTH && y + 1 < this.h)
            return { x, y: y + 1 };
        return null;
    }
    getOppositeWall(wall) {
        switch (wall) {
            case Wall.NORTH: return Wall.SOUTH;
            case Wall.SOUTH: return Wall.NORTH;
            case Wall.EAST: return Wall.WEST;
            case Wall.WEST: return Wall.EAST;
            default: throw Error("Invalid wall " + wall);
        }
    }
    addTopWalls() {
        for (let x = 0; x < this.w; x++) {
            this.addSingleWall(x, 0, Wall.NORTH);
        }
    }
    addBottomWalls() {
        for (let x = 0; x < this.w; x++) {
            this.addSingleWall(x, this.h - 1, Wall.SOUTH);
        }
    }
    addLeftWalls() {
        for (let y = 0; y < this.h; y++) {
            this.addSingleWall(0, y, Wall.WEST);
        }
    }
    addRightWalls() {
        for (let y = 0; y < this.h; y++) {
            this.addSingleWall(this.w - 1, y, Wall.EAST);
        }
    }
}
