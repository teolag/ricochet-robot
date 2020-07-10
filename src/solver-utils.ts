import { Board } from "./models/Board"
import { IPos } from "./models/IPos"
import { Direction } from "./enums/Direction"
import { Wall } from "./enums/wall"
import { ITestMove } from "./models/ITestMove"

interface ISimpleRobot {
  x: number
  y: number
  idx: number
}

export function goUp (board: Board, robot: ISimpleRobot, helpers: IPos[]): ITestMove {
  const dynPos: IPos = {x: robot.x, y: robot.y}
  if(hasWall(board, dynPos, Wall.UP)) return null
  const closestRobotY = Math.max(...helpers.filter(helper => helper.x === dynPos.x && helper.y < dynPos.y).map(helper => helper.y))
  for(; dynPos.y > 0; dynPos.y--) {
    if(dynPos.y-1 === closestRobotY || hasWall(board, dynPos, Wall.UP)) break
  }
  if(dynPos.y === robot.y) return null
  return {pos: dynPos, robotIdx: robot.idx, dir: Direction.UP}
}

export function goDown (board: Board, robot: ISimpleRobot, helpers: IPos[]): ITestMove {
  const dynPos: IPos = {x: robot.x, y: robot.y}
  if(hasWall(board, dynPos, Wall.DOWN)) return null
  const closestRobotY = Math.min(...helpers.filter(helper => helper.x === dynPos.x && helper.y > dynPos.y).map(helper => helper.y))
  for(; dynPos.y < board.h; dynPos.y++) {
    if(dynPos.y+1 === closestRobotY || hasWall(board, dynPos, Wall.DOWN)) break
  }
  if(dynPos.y===robot.y) return null
  return {pos: dynPos, robotIdx: robot.idx, dir: Direction.DOWN}
}

export function goLeft (board: Board, robot: ISimpleRobot, helpers: IPos[]): ITestMove {
  const dynPos: IPos = {x: robot.x, y: robot.y}
  if(hasWall(board, dynPos, Wall.LEFT)) return null
  const closestRobotX = Math.max(...helpers.filter(helper => helper.y === dynPos.y && helper.x < dynPos.x).map(helper => helper.x))
  for(; dynPos.x > 0; dynPos.x--) {
    if(dynPos.x-1 === closestRobotX || hasWall(board, dynPos, Wall.LEFT)) break
  }
  if(dynPos.x===robot.x) return null
  return {pos: dynPos, robotIdx: robot.idx, dir: Direction.LEFT}
}

export function goRight (board: Board, robot: ISimpleRobot, helpers: IPos[]): ITestMove {
  const dynPos: IPos = {x: robot.x, y: robot.y}
  if(hasWall(board, dynPos, Wall.RIGHT)) return null
  const closestRobotX = Math.min(...helpers.filter(helper => helper.y === dynPos.y && helper.x > dynPos.x).map(helper => helper.x))
  for(; dynPos.x < board.w; dynPos.x++) {
    if(dynPos.x+1 === closestRobotX || hasWall(board, dynPos, Wall.RIGHT)) break
  }
  if(dynPos.x===robot.x) return null
  return {pos: dynPos, robotIdx: robot.idx, dir: Direction.RIGHT}
}

export function hasWall(board: Board, pos: IPos, wall: Wall) {
  return (board.tiles[pos.y][pos.x] & wall) !== 0
}
