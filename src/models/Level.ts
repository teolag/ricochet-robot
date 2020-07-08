import { Board } from "./Board";
import { Robot } from "./Robot";
import { Goal } from "./Goal";
import * as Slumpa from "../libs/Slumpa"
import { IGenerateOptions } from "./IGenerateOptions";

const LEVEL_STRING_DELIMITER = '|'

export class Level {
  public readonly board: Board
  public readonly robots: Robot[]
  public readonly goal: Goal
  
  constructor(levelString: string)
  constructor(generateOptions: IGenerateOptions)
  constructor(input: string|IGenerateOptions) {
    if(typeof input === "string") {
      const levelString = input
      const [widthStr, tiles, goalStr, ...robotsStr] = levelString.split(LEVEL_STRING_DELIMITER)
      const width = parseInt(widthStr)
      const height = tiles.length / width
      const goal = parseInt(goalStr)
      this.goal = new Goal(goal%width, Math.floor(goal/width), 0)
      this.robots = robotsStr.map(Number).map((r, i) => new Robot(i, r%width, Math.floor(r/width)))
      this.board = new Board(height, width)
      this.board.setTiles(tiles)
    } else {
      const {board, robots, goal} = generateLevelData(input)
      this.board = board
      this.robots = robots
      this.goal = goal
    }
  }

  pos2num(pos: {x:number, y:number}) {
    return pos.x + pos.y * this.board.w
  }

  getLevelString(): any {
    const goalStr = this.pos2num(this.goal)
    const tiles = this.board.getTilesString()
    const robotsStr = this.robots.map(r => this.pos2num(r)).join(LEVEL_STRING_DELIMITER)
    return `${this.board.w}|${tiles}|${goalStr}|${robotsStr}`
  }
}


function generateLevelData({width, height, wallsCount, seed, robotCount}: IGenerateOptions) {
  Slumpa.setSeed(seed)
  const board = new Board(height, width)
  board.addRandomWalls(wallsCount)

  const availableTiles = []
  for(let x=0; x<board.w; x++) {
    for(let y=0; y<board.h; y++) {
      availableTiles.push({x,y})
    }
  }
  const randomTiles = Slumpa.shuffle(availableTiles)
  
  const robots = new Array(robotCount).fill(null).map((_, i) => {
    const tile = randomTiles.pop()
    return new Robot(i, tile.x, tile.y)
  })
  
  const tile = randomTiles.pop()
  const robotIndex = 0//Math.floor(Math.random()*robots)
  const goal = new Goal(tile.x, tile.y, robotIndex)
  return {goal, robots, board}
}