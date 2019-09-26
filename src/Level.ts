import { Board } from "./Board.js";
import { Robot, RobotIds } from "./Robot.js";
import { Goal } from "./Goal.js";
import * as Slumpa from "./Slumpa.js"

export class Level {
  public board: Board
  public robots: Robot[]
  public goal: Goal

  constructor(width: number, height: number, robots: number) {
    this.board = new Board(width, height)
    this.board.addRandomWalls(width*height/5)

    const availableTiles = []
    for(let x=0; x<this.board.w; x++) {
      for(let y=0; y<this.board.h; y++) {
        availableTiles.push({x,y})
      }
    }
    const randomTiles = Slumpa.shuffle(availableTiles)
    
    this.robots = new Array(robots).fill(null).map((_, i) => {
      const tile = randomTiles.pop()
      return new Robot(i as RobotIds, tile.x, tile.y)
    })
    
    const tile = randomTiles.pop()
    const color = 0//Math.floor(Math.random()*robots)
    this.goal = new Goal(tile.x, tile.y, color)
  }
}