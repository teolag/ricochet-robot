import * as Slumpa from '../libs/Slumpa'
import { Wall } from '../enums/wall'

/*
10: 0123456789
26: abcdefghijklmnopqrsyuvwxyz
26: ABCDEFGHIJKLMNOPQRSYUVWXYZ
02: +/

0100010010010010100101101011011001
010001 001001 001010 010110 101101 1001
17     9      10     22     45     9
h      9      a      m      J      9
h9amJ9
*/


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

  getTilesString() {
    return this.tiles.map(row => row.map(tile => tile.toString(16)).join('')).join('')
  }

  setTiles(tiles: string) {
    if(tiles.length !== this.w * this.h) throw Error(`Unable to set tiles. tiles.length was ${tiles.length}, expected ${this.w*this.h}`)

    const numbers = tiles.split('').map(t => parseInt(t,16))
    this.tiles = new Array(this.h).fill(null).map((_, y) => numbers.slice(y*this.w, y*this.w+this.w))
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
      const wallType = Slumpa.randomOne([Wall.UP,Wall.RIGHT,Wall.LEFT,Wall.DOWN])
      const x = Slumpa.randomInt(0, this.w-1)
      const y = Slumpa.randomInt(0, this.h-1)
      const hasWall = this.tiles[y][x] & wallType
      if(hasWall) continue

      this.addWall(x, y, wallType)
      builtWalls++
    }
  }

  private addSingleWall(x: number, y: number, wall: Wall) {
    const value = this.tiles[y][x]
    this.tiles[y][x] = value | wall
  }

  private getTileBehindTheWall(x: number, y: number, wall: Wall): {x: number, y: number} | null {
    if(wall === Wall.UP && y > 0) return {x, y: y-1}
    if(wall === Wall.LEFT && x > 0) return {x: x-1, y}
    if(wall === Wall.RIGHT && x+1 < this.w) return {x: x+1, y}
    if(wall === Wall.DOWN && y+1 < this.h) return {x, y: y+1}
    return null
  }

  private getOppositeWall(wall: Wall) {
    switch(wall) {
      case Wall.UP: return Wall.DOWN
      case Wall.DOWN: return Wall.UP
      case Wall.RIGHT: return Wall.LEFT
      case Wall.LEFT: return Wall.RIGHT
      default: throw Error("Invalid wall " + wall)
    }
  }

  private addTopWalls() {
    for(let x = 0; x<this.w; x++) {
      this.addSingleWall(x, 0, Wall.UP)
    }
  }

  private addBottomWalls() {
    for(let x = 0; x<this.w; x++) {
      this.addSingleWall(x, this.h-1, Wall.DOWN)
    }
  }

  private addLeftWalls() {
    for(let y = 0; y<this.h; y++) {
      this.addSingleWall(0, y, Wall.LEFT)
    }
  }

  private addRightWalls() {
    for(let y = 0; y<this.h; y++) {
      this.addSingleWall(this.w-1, y, Wall.RIGHT)
    }
  }

}
