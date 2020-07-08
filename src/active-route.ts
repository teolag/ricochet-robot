import { getElementById, getButton } from "./utils"
import { Direction } from "./enums/Direction"
import { Robot } from "./models/Robot"
import * as Game from "./game"

interface Move {
  robotIndex: number,
  direction: Direction,
  robots: Robot[],
  goalVisited: boolean
}

const route: Move[] = []
const movesCounter = getElementById('movesCounter')
const undoButton = getButton('btnUndo')
const resetButton = getButton('btnReset')
const movesMade = getElementById('movesMade')
undoButton.addEventListener('click', undoLastMove)
resetButton.addEventListener('click', resetButtonClick)


export function resetButtonClick() {
  Game.resetLevel()
}

export function reset() {
  route.length = 0
  updateUI()
}

export function addMove(robotIndex: number, direction: Direction, robots: Robot[], goalVisited: boolean) {
  route.push({direction, robotIndex, robots, goalVisited})
  updateUI()
}

export function getMovesCount() {
  return route.length
}

function undoLastMove() {
  if(route.length === 1) {
    Game.resetLevel()
    return
  }

  route.pop()
  updateUI()
  const lastMove = route[route.length-1]
  const lastRobots = lastMove.robots
  Game.setGoalVisited(lastMove.goalVisited)
  Game.setRobotsPostitions(lastRobots)
}

function updateUI() {
  const moves = route.length
  movesCounter.innerText = moves.toString()
  movesMade.innerHTML = route.map(r => `<span>${r.robotIndex+1}${r.direction.substr(0,1)}</span>`).join('')

  undoButton.disabled = route.length === 0
  resetButton.disabled = route.length === 0
}
