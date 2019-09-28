import { Level } from "./models/Level"
import { Wall, Board } from "./models/Board"
import * as Slumpa from "./libs/Slumpa"
import { Pos } from "./models/Pos"
import { Robot, cloneRobots } from "./models/Robot"
import {solve, getResult} from "./solver-service"
import { goNorth, goSouth, goWest, goEast } from "./solver-utils"
import './service-worker'
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










function newSeed() {
  const newSeed = Math.floor(Math.random()*1000000)
  location.hash = newSeed.toString()
  Slumpa.setSeed(newSeed)
}

const seed = parseInt(location.hash.substr(1))
if(seed) {
  Slumpa.setSeed(seed)
} else {
  newSeed()
}

const movesCounter = document.getElementById('movesCounter')
if(!movesCounter) throw Error("moves counter not found")
let moves = 0
const setMoveCounter = (value: number) => {
  moves = value
  movesCounter.innerText = value.toString()
}

const boardElem = document.querySelector('.board')

const btnReset = document.getElementById('btnReset')


const btnRestart = document.getElementById('btnRestart')
if(!btnRestart) throw Error("restartbutton not found")

btnRestart.addEventListener('click', () => {
  newSeed()
  newGame()
})
newGame()



document.body.addEventListener('keydown', e => {
  switch(e.key) {
    case 'ArrowUp': moveActiveRobot(goNorth); break;
    case 'ArrowDown': moveActiveRobot(goSouth); break;
    case 'ArrowLeft': moveActiveRobot(goWest); break;
    case 'ArrowRight': moveActiveRobot(goEast); break;
    case '1': switchRobot(0); break 
    case '2': switchRobot(1); break 
    case '3': switchRobot(2); break 
    case '4': switchRobot(3); break 
  }
})



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

reset()

function reset() {
  if(!level) return
  setMoveCounter(0)
  robots = cloneRobots(level.robots)
  robots.forEach((robot, i) => {
    moveRobot(robotElems[i], robot.getPos())
  })
  switchRobot(0)
}



switchRobot(0)




const btnUp = document.getElementById('btnUp')
if(btnUp) btnUp.addEventListener('click', e => moveActiveRobot(goNorth))
const btnDown = document.getElementById('btnDown')
if(btnDown) btnDown.addEventListener('click', e => moveActiveRobot(goSouth))
const btnLeft = document.getElementById('btnLeft')
if(btnLeft) btnLeft.addEventListener('click', e => moveActiveRobot(goWest))
const btnRight = document.getElementById('btnRight')
if(btnRight) btnRight.addEventListener('click', e => moveActiveRobot(goEast))

if(!btnReset) throw Error("reset button not found")
btnReset.addEventListener('click', reset)



function moveActiveRobot(moveFunction: (board: Board, selectedRobot: Robot, otherRobots: Robot[]) => {pos: Pos, dir: string}|null) {
  const newPos = moveFunction(level.board, selectedRobot, otherRobots)
  if(!newPos) return
  moveRobot(robotElems[activeRobotIndex], newPos.pos)
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

function moveRobot(robot: HTMLElement, newPos: Pos) {
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