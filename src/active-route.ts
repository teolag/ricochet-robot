import { getElementById, getButton } from "./utils"
import { Direction } from "./models/Direction"
import { Robot } from "./models/Robot"
import * as Game from "./game"

const route: {robotIndex: number, direction: Direction, robots: Robot[]}[] = []
const movesCounter = getElementById('movesCounter')
const undoButton = getButton('btnUndo')
const resetButton = getButton('btnReset')
const movesMade = getElementById('movesMade')
undoButton.addEventListener('click', undoLastMove)
resetButton.addEventListener('click', reset)


export function reset() {
  route.length = 0
  updateUI()
  Game.resetRobots()
}

export function addMove(robotIndex: number, direction: Direction, robots: Robot[]) {
  route.push({direction, robotIndex, robots})
  updateUI()
}

export function getMovesCount() {
  return route.length
}

function undoLastMove() {
  if(route.length === 1) {
    reset()
    return
  }

  route.pop()
  updateUI()
  const lastRobots = route[route.length-1].robots
  Game.setRobotsPostitions(lastRobots)
}

function updateUI() {
  const moves = route.length
  movesCounter.innerText = moves.toString()
  movesMade.innerHTML = route.map(r => `<span>${r.robotIndex+1}${r.direction.substr(0,1)}</span>`).join('')

  undoButton.disabled = route.length === 0
  resetButton.disabled = route.length === 0
}
