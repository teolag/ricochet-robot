import { Level } from "./models/Level"
import { cloneRobots, Robot } from "./models/Robot"
import { solve, getResult } from "./solver-service"
import { IPos } from "./models/IPos"
import * as GameBoard from "./game-board"
import { Direction } from "./enums/Direction"
import { goUp, goLeft, goRight, goDown } from "./solver-utils"
import * as ActiveRoute from './active-route'
import * as ColorControls from './components/color-controls'
import { openModal } from "./components/dialog"
import { ICompletedData } from "./models/ICompletedData"

let level: Level
let robots: Robot[]
let activeRobotIndex = 0
const moveQueue: {robotIndex: number, direction: Direction}[] = []
let processingMoveQueue = false
let _backAgain = true
let goalVisited = false



export function startGame(loadedlevel: Level, backAgain: boolean) {
  _backAgain = backAgain
  level = loadedlevel
  solve(level, _backAgain) 
  ColorControls.createButtons(level.robots.length)
  GameBoard.loadLevel(level)
  resetLevel()
}

export function resetLevel() {
  resetRobots()
  switchRobot(0)
  setGoalVisited(false)
  ActiveRoute.reset()
}

function resetRobots() {
  robots = cloneRobots(level.robots)
  setRobotsPostitions(robots)
}

export function setRobotsPostitions(robots: Robot[]) {
  robots.forEach((robot, i) => {
    setRobotPosition(i, robot.getPos())
  })
}

export function setGoalVisited(visited: boolean) {
  goalVisited = visited
  GameBoard.setGoalVisited(visited)
}

export function setRobotPosition(robotIndex: number, newPos: IPos) {
  robots[robotIndex].setPos(newPos)
  GameBoard.moveRobot(robotIndex, newPos)
}

export function moveActiveRobot(direction: Direction) {
  addToMoveQueue(activeRobotIndex, direction)
}
export function moveRobot(robotIdx: number, direction: Direction) {
  const moveFunction = getMoveFunction(direction)
  const movingRobot = robots[robotIdx]
  const otherRobots = robots.filter(r => r.idx !== robotIdx)
  const newPos = moveFunction(level.board, movingRobot, otherRobots)
  if(!newPos) return

  setRobotPosition(robotIdx, newPos.pos)

  const landedOnGoal = goalIsReached()
  if(landedOnGoal) setGoalVisited(true)
  ActiveRoute.addMove(robotIdx, direction, cloneRobots(robots), goalVisited)

  const gameCompleted = (landedOnGoal && !_backAgain) || (_backAgain && goalVisited && isHome())
  if(gameCompleted) {
    setTimeout(() => {
      const result = getResult()
      const resultText = getResultText(result)
      openModal(resultText)
    }, 400);
  }
}

function getResultText(result: ICompletedData) {
  const moves = ActiveRoute.getMovesCount()
  if(!result) {
    return `Grattis, du klarade det på ${moves} drag innan solvern hittade en lösning`
  }
  if(result && result.isAborted) {
    return `Solvern gav upp, men du klarade det på ${moves} drag!`
  }
  if(result && result.isAllStatesChecked) {
    return "Öööö... du klarade en omöjlig bana?!"
  }
  const score = calculateScore(moves, result.route.length)
  const scoreText = ["FUUUSK!", 'Bättre kan du', 'Bra gjort!', 'Perfekt!']
  return `${moves} drag. ${scoreText[score]} <br>${'⭐'.repeat(score)}`
}

export function switchRobot(index: number) {
  if(index < 0 || index > robots.length-1) return
  activeRobotIndex = index
  GameBoard.setActiveRobot(index)
  ColorControls.activeRobotChanged(index)
}

function getMoveFunction(direction: Direction) {
  switch(direction) {
    case Direction.UP: return goUp
    case Direction.LEFT: return goLeft
    case Direction.RIGHT: return goRight
    case Direction.DOWN: return goDown
  }
}


function goalIsReached() {
  const correctRobot = robots[level.goal.robotIdx]
  return correctRobot.x === level.goal.x && correctRobot.y === level.goal.y
}

function isHome() {
  const correctRobot = robots[level.goal.robotIdx]
  const correctStart = level.robots[level.goal.robotIdx]
  return correctRobot.x === correctStart.x && correctRobot.y === correctStart.y
}

function calculateScore(moves: number, optimalMoves: number) {
  if(moves < optimalMoves) return 0
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
  moveQueue.push(...result.route.map(step => ({direction: step.direction, robotIndex: step.robotIdx})))
  setTimeout(processMoveQueue, 400)
}

