import { Level } from "./models/Level"
import { cloneRobots, Robot } from "./models/Robot"
import {solve, getResult} from "./solver-service"
import { Pos } from "./models/Pos"
import * as GameBoard from "./game-board"
import { Direction } from "./models/Direction"
import { goNorth, goWest, goEast, goSouth } from "./solver-utils"
import * as ActiveRoute from './active-route'
import * as ColorControls from './components/color-controls'

let level: Level
let robots: Robot[]
let activeRobotIndex = 0
const moveQueue: {robotIndex: number, direction: Direction}[] = []
let processingMoveQueue = false



export function loadLevel(loadedlevel: Level) {
  const backAgain = false
  level = loadedlevel
  solve(level, backAgain) 
  ColorControls.createButtons(level.robots.length)
  GameBoard.loadLevel(level)
  resetLevel()
}

export function resetLevel() {
  resetRobots()
  switchRobot(0)
  ActiveRoute.reset()
}

export function resetRobots() {
  robots = cloneRobots(level.robots)
  setRobotsPostitions(robots)
}

export function setRobotsPostitions(robots: Robot[]) {
  robots.forEach((robot, i) => {
    setRobotPosition(i, robot.getPos())
  })
}

export function setRobotPosition(robotIndex: number, newPos: Pos) {
  robots[robotIndex].setPos(newPos)
  GameBoard.moveRobot(robotIndex, newPos)
}

export function moveActiveRobot(direction: Direction) {
  addToMoveQueue(activeRobotIndex, direction)
}
export function moveRobot(robotIndex: number, direction: Direction) {
  const moveFunction = getMoveFunction(direction)
  const otherRobots = robots.filter(r => r.color !== robotIndex)
  const newPos = moveFunction(level.board, robots[robotIndex], otherRobots)
  if(!newPos) return

  setRobotPosition(robotIndex, newPos.pos)
  // gameBoard.moveRobot(activeRobotIndex, newPos.pos)
  ActiveRoute.addMove(robotIndex, direction, cloneRobots(robots))

  if(goalIsReached()) {
    const result = getResult()
    if(!result || result.isAborted) {
      alert("Grattis, du klarade det innan solvern")
      return;
    }
    if(result && result.isAllStatesChecked) {
      alert("Öööö... du klarade en omöjlig bana?!")
      return;
    }
    const score = calculateScore(ActiveRoute.getMovesCount(), result.route.length)

    setTimeout(() => {
      alert("tjohooo!! Score: " + '⭐'.repeat(score))
    }, 400);
  }
}

export function switchRobot(index: number) {
  if(index < 0 || index > robots.length-1) return
  activeRobotIndex = index
  GameBoard.setActiveRobot(index)
  ColorControls.activeRobotChanged(index)
}

function getMoveFunction(direction: Direction) {
  switch(direction) {
    case Direction.UP: return goNorth
    case Direction.LEFT: return goWest
    case Direction.RIGHT: return goEast
    case Direction.DOWN: return goSouth
  }
}


function goalIsReached() {
  const correctRobot = robots[level.goal.color]
  return correctRobot.x === level.goal.x && correctRobot.y === level.goal.y
}

function calculateScore(moves: number, optimalMoves: number) {
  if(moves === optimalMoves) return 3
  if(moves <= 1+Math.floor(optimalMoves*1.3)) return 2
  return 1
}


function addToMoveQueue(robotIndex: number, direction: Direction) {
  moveQueue.push({robotIndex, direction})
  if(processingMoveQueue) return
  processMoveQueue()
}

function processMoveQueue() {
  const nextMove = moveQueue.shift()
  if(!nextMove) {
    processingMoveQueue = false
    return
  }
  processingMoveQueue = true
  //switchRobot(nextMove.robotIndex)
  moveRobot(nextMove.robotIndex, nextMove.direction)
  setTimeout(processMoveQueue, 400)
}



export function showSolution() {
  const result = getResult()
  if(!result) return

  resetLevel()
  moveQueue.length = 0
  const dirToDirection = new Map([['upp', Direction.UP], ['ner', Direction.DOWN], ['vänster', Direction.LEFT], ['höger', Direction.RIGHT]])
  moveQueue.push(...result.route.map(step => {
    const direction = dirToDirection.get(step.dir)
    if(!direction) throw Error("Unknown direction:" + step.dir)
    return {direction, robotIndex: step.color}
  }))
  setTimeout(processMoveQueue, 400)
}

