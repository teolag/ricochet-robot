import { Level } from "./models/Level"
import { Wall, Board } from "./models/Board"
import * as Slumpa from "./libs/Slumpa"
import { Pos } from "./models/Pos"
import { Robot, cloneRobots } from "./models/Robot"
import {solve, getResult} from "./solver-service"
import { goNorth, goSouth, goWest, goEast } from "./solver-utils"
import './service-worker'


enum Direction {
  UP = 'UP',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN'
}


/*


1drag = 4^2 = 16
2drag = 4^3 = 64
3drag = 4^4 = 256
4drag = 4^5 = 1024
5drag = 4^6 = 4096
6drag = 4^7 = 16384
7drag = 4^8 = 65536
8drag = 4^9 = 262144
RIMLIGT??


* There and back again

* show and play solution

* move robots with keyboard
  - wasd of arrow-keys to move
  - 1-x to switch robot

* move robots with touch
  - swipe on robots to move
  - virtual controls with arrows and color buttons to change robot

* solver info
  - service worker
  - status indicator
  - click to show
    - states checked
    - best route
    - solve duration
  - inform user if a level is impossible / too hard?

* Defined levels in different difficulty groups Easy/Medium/Hard

* Collect stars.
  1 star complete the level  >125%
  2 stars complete within 5 moves or %? 100-125%
  3 stars complete with best route 100%
  
  * Save progress in local storage
  
  */
 
let level: Level
let robots: Robot[]
let activeRobotIndex = 0
let selectedRobot: Robot
let otherRobots: Robot[]
let robotElems: HTMLElement[]
let moves = 0
const boardElem = document.querySelector('.board')
const movesCounter = getElementById('movesCounter')
const moveQueue: {robotIndex: number, direction: Direction}[] = []
let processingMoveQueue = false
startup()




getElementById('btnUp').addEventListener('click', _ => moveActiveRobot(goNorth))
getElementById('btnDown').addEventListener('click', _ => moveActiveRobot(goSouth))
getElementById('btnLeft').addEventListener('click', _ => moveActiveRobot(goWest))
getElementById('btnRight').addEventListener('click', _ => moveActiveRobot(goEast))

getElementById('btnReset').addEventListener('click', reset)
document.body.addEventListener('keydown', keyHandler)


getElementById('btnNewGame').addEventListener('click', () => {
  ranomizeSeed()
  newGame()
})


declare global {
  interface Window { show: any; }
}

window["show"] = () => {
  const result = getResult()
  if(!result) return

  reset()
  moveQueue.length = 0
  const dirToDirection = new Map([['upp', Direction.UP], ['ner', Direction.DOWN], ['vänster', Direction.LEFT], ['höger', Direction.RIGHT]])
  moveQueue.push(...result.route.map(step => {
    const direction = dirToDirection.get(step.dir)
    if(!direction) throw Error("Unknown direction:" + step.dir)
    return {direction, robotIndex: step.color}
  }))
  processMoveQueue()
}



function startup() {
  const seed = parseInt(location.hash.substr(1))
  if(seed) {
    Slumpa.setSeed(seed)
    newGame()
  } else {
    ranomizeSeed()
    newGame()
  }
}

function setMoveCounter(value: number) {
  moves = value
  movesCounter.innerText = value.toString()
}

function ranomizeSeed() {
  const newSeed = Math.floor(Math.random()*1000000)
  location.hash = newSeed.toString()
  Slumpa.setSeed(newSeed)
}

function keyHandler(e: KeyboardEvent) {
  switch(e.key) {
    case 'ArrowUp': addToMoveQueue(activeRobotIndex, Direction.UP); break;
    case 'ArrowDown': addToMoveQueue(activeRobotIndex, Direction.DOWN); break;
    case 'ArrowLeft': addToMoveQueue(activeRobotIndex, Direction.LEFT); break;
    case 'ArrowRight': addToMoveQueue(activeRobotIndex, Direction.RIGHT); break;
    case '1': switchRobot(0); break 
    case '2': switchRobot(1); break 
    case '3': switchRobot(2); break 
    case '4': switchRobot(3); break 
  }
}

function newGame() {
  
  level = new Level(10, 10, 4)
  solve(level)
  
  const html = createHTMLBoard(level)
  if(!boardElem) throw Error("could not find board")
  boardElem.innerHTML = html
  
  robotElems = level.robots.map(r => {
    const elem = document.createElement('div')
    elem.classList.add('robot', 'robot-'+r.color)
    elem.innerText = (r.color+1).toString()
    elem.addEventListener('click', e => switchRobot(r.color))
    return elem
  })
  robotElems.forEach(robotElem => {
    boardElem.appendChild(robotElem)
  })

  reset()
}

function reset() {
  if(!level) return
  setMoveCounter(0)
  robots = cloneRobots(level.robots)
  robots.forEach((robot, i) => {
    moveRobotElem(robotElems[i], robot.getPos())
  })
  switchRobot(0)
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
  switchRobot(nextMove.robotIndex)
  switch(nextMove.direction) {
    case Direction.UP: moveActiveRobot(goNorth); break;
    case Direction.DOWN: moveActiveRobot(goSouth); break;
    case Direction.LEFT: moveActiveRobot(goWest); break;
    case Direction.RIGHT: moveActiveRobot(goEast); break;
  }
  setTimeout(processMoveQueue, 400)
}

function moveActiveRobot(moveFunction: (board: Board, selectedRobot: Robot, otherRobots: Robot[]) => {pos: Pos, dir: string}|null) {
  const newPos = moveFunction(level.board, selectedRobot, otherRobots)
  if(!newPos) return
  moveRobotElem(robotElems[activeRobotIndex], newPos.pos)
  selectedRobot.setPos(newPos.pos)
  setMoveCounter(moves+1)

  if(goalIsReached()) {
    const result = getResult()
    if(!result) {
      alert("Grattis, du klarade det innan solvern")
      return;
    }
    const score = calculateScore(moves, result.route.length)

    setTimeout(() => {
      alert("tjohooo!! Score: " + '⭐'.repeat(score))
    }, 400);
  }
}

function moveRobotElem(robot: HTMLElement, newPos: Pos) {
  robot.style.transform = `translate(${newPos.x*38+10}px, ${newPos.y*38+10}px)`
}

function switchRobot(index: number) {
  if(index > robots.length) return
  activeRobotIndex = index
  selectedRobot = robots[index]
  otherRobots = robots.filter(r => r.color !== index)
  robotElems.forEach((r, i) => {
    r.classList.toggle('active', i === index)
  })
}

function createHTMLBoard(level: Level): string {
  return "<table><tr>" + level.board.tiles.map((row, y) => row.map((walls, x) => {
    let text = ''
    const classes = []
    if(walls & Wall.NORTH) classes.push('wall-north')
    if(walls & Wall.EAST) classes.push('wall-east')
    if(walls & Wall.WEST) classes.push('wall-west')
    if(walls & Wall.SOUTH) classes.push('wall-south')
    
    if(level.goal.x === x && level.goal.y ===y) {
      text = `<div class="goal goal-${level.goal.color}"></div>`;
    }
    
    level.robots.forEach(robot => {
      if(robot.x === x && robot.y ===y) {
        text = `<div class="start start-${robot.color}"></div>`;
      }
    })
    
    return `<td class='${classes.join(' ')}'>${text}</td>`
    
  }).join('')).join('</tr><tr>') + '</tr></table>'
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

function getElementById(id: string) {
  const elem = document.getElementById(id)
  if(!elem) throw Error("Could not find element " + id)
  return elem
}