import * as Slumpa from './Slumpa.js'
export enum Wall {
  NORTH = 1 << 0,
  WEST = 1 << 1,
  EAST = 1 << 2,
  SOUTH = 1 << 3
}


export class Board {
  public tiles: number[][]
  public w: number
  public h: number

  constructor(height: number, width: number) {
    this.h = height
    this.w = width
    this.tiles = new Array(height).fill(null).map(() => new Array(width).fill(0))
    this.addTopWalls()
    this.addBottomWalls()
    this.addLeftWalls()
    this.addRightWalls()
  }

  public addWall(x: number, y: number, wall: Wall) {
    if(x<0 || x>=this.w) throw Error(`x must be between 0 and ${this.w-1}, was: ${x}`)
    if(y<0 || y>=this.h) throw Error(`y must be between 0 and ${this.h-1}, was: ${y}`)
    this.addSingleWall(x, y, wall)
    const neighbour = this.getTileBehindTheWall(x, y, wall)
    if(neighbour) {
      const oppositeWall = this.getOppositeWall(wall)
      this.addSingleWall(neighbour.x, neighbour.y, oppositeWall)
    }
  }

  public addRandomWalls(wallCount: number) {
    let builtWalls = 0
    let attempt = 0
    while(builtWalls < wallCount && attempt<1000) {
      attempt++
      const wallType = Slumpa.randomOne([Wall.NORTH,Wall.EAST,Wall.WEST,Wall.SOUTH])
      const x = Slumpa.randomInt(0, this.w-1)
      const y = Slumpa.randomInt(0, this.h-1)
      const hasWall = this.tiles[y][x] & wallType
      if(hasWall) continue

      this.addWall(x, y, wallType)
      builtWalls++
    }
  }

  public hasWall(x:number, y:number, wall: Wall) {
    return (this.tiles[y][x] & wall) !== 0
  }

  private addSingleWall(x: number, y: number, wall: Wall) {
    const value = this.tiles[y][x]
    this.tiles[y][x] = value | wall
  }

  private getTileBehindTheWall(x: number, y: number, wall: Wall): {x: number, y: number} | null {
    if(wall === Wall.NORTH && y > 0) return {x, y: y-1}
    if(wall === Wall.WEST && x > 0) return {x: x-1, y}
    if(wall === Wall.EAST && x+1 < this.w) return {x: x+1, y}
    if(wall === Wall.SOUTH && y+1 < this.h) return {x, y: y+1}
    return null
  }

  private getOppositeWall(wall: Wall) {
    switch(wall) {
      case Wall.NORTH: return Wall.SOUTH
      case Wall.SOUTH: return Wall.NORTH
      case Wall.EAST: return Wall.WEST
      case Wall.WEST: return Wall.EAST
      default: throw Error("Invalid wall " + wall)
    }
  }

  private addTopWalls() {
    for(let x = 0; x<this.w; x++) {
      this.addSingleWall(x, 0, Wall.NORTH)
    }
  }

  private addBottomWalls() {
    for(let x = 0; x<this.w; x++) {
      this.addSingleWall(x, this.h-1, Wall.SOUTH)
    }
  }

  private addLeftWalls() {
    for(let y = 0; y<this.h; y++) {
      this.addSingleWall(0, y, Wall.WEST)
    }
  }

  private addRightWalls() {
    for(let y = 0; y<this.h; y++) {
      this.addSingleWall(this.w-1, y, Wall.EAST)
    }
  }

}