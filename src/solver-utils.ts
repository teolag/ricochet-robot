import { Board, Wall } from "./models/Board"
import { Pos } from "./models/Pos"

export function goNorth (board: Board, robot: Pos, otherRobots: Pos[]) {
  const pos = {x: robot.x, y: robot.y}
  const closestRobotY = Math.max(...otherRobots.filter(r => r.x === pos.x && r.y < pos.y).map(r => r.y))
  for(; pos.y > 0; pos.y--) {
    if(pos.y-1 === closestRobotY || hasWall(board, pos.x, pos.y, Wall.NORTH)) break
  }
  if(pos.y === robot.y) return null
  return {pos, dir: 'upp'}
}

export function goSouth (board: Board, robot: Pos, otherRobots: Pos[]) {
  const pos = {x: robot.x, y: robot.y}
  const closestRobotY = Math.min(...otherRobots.filter(r => r.x === robot.x && r.y > pos.y).map(r => r.y))
  for(; pos.y < board.h; pos.y++) {
    if(pos.y+1 === closestRobotY || hasWall(board, robot.x, pos.y, Wall.SOUTH)) break
  }
  if(pos.y===robot.y) return null
  return {pos, dir: 'ner'}
}

export function goWest (board: Board, robot: Pos, otherRobots: Pos[]) {
  const pos = {x: robot.x, y: robot.y}
  const closestRobotX = Math.max(...otherRobots.filter(r => r.y === pos.y && r.x < pos.x).map(r => r.x))
  for(; pos.x > 0; pos.x--) {
    if(pos.x-1 === closestRobotX || hasWall(board, pos.x, pos.y, Wall.WEST)) break
  }
  if(pos.x===robot.x) return null
  return {pos, dir: 'vänster'}
}

export function goEast (board: Board, robot: Pos, otherRobots: Pos[]) {
  const pos = {x: robot.x, y: robot.y}
  const closestRobotX = Math.min(...otherRobots.filter(r => r.y === pos.y && r.x > pos.x).map(r => r.x))
  for(; pos.x < board.w; pos.x++) {
    if(pos.x+1 === closestRobotX || hasWall(board, pos.x, pos.y, Wall.EAST)) break
  }
  if(pos.x===robot.x) return null
  return {pos, dir: 'höger'}
}

export function hasWall(board: Board, x:number, y:number, wall: Wall) {
  return (board.tiles[y][x] & wall) !== 0
}
