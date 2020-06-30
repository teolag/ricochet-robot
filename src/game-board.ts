import { Level } from "./models/Level"
import { getElementById } from "./utils"
import { Wall } from "./models/Board"
import { Robot } from "./models/Robot"
import { Pos } from "./models/Pos"
import * as Game from "./game"
import { Direction } from "./models/Direction"

const TOUCH_MOVE_LENGTH = 40

const boardElem = getElementById('board')

let robotClickCallback
let robotElems: HTMLDivElement[]

let touchingIndex = null
let touchStart: Pos
document.addEventListener('touchend', _ => touchingIndex=null)
document.addEventListener('touchmove', touchMove)


export function loadLevel(level: Level) {
  const html = createHTMLBoard(level)
  boardElem.innerHTML = html
  
  robotElems = level.robots.map(r => {
    const elem = document.createElement('div')
    elem.classList.add('robot', 'robot-'+r.color)
    elem.innerText = (r.color+1).toString()
    elem.addEventListener('click', _ => robotClick(r.color))
    elem.addEventListener('touchstart', e => robotTouch(e, r.color), {passive: true})
    return elem
  })
  robotElems.forEach(robotElem => {
    boardElem.appendChild(robotElem)
  })

  setRobotsPositions(level.robots)
}

export function setRobotsPositions(robots: Robot[]) {
  robots.forEach((robot, i) => {
    moveRobot(i, robot.getPos())
  })
}

export function moveRobot(robotIndex: number, newPos: Pos) {
  moveRobotElem(robotElems[robotIndex], newPos)
}

export function setActiveRobot(robotIndex: number) {
  robotElems.forEach((r, i) => {
    r.classList.toggle('active', i === robotIndex)
  })
}


function moveRobotElem(robot: HTMLElement, newPos: Pos) {
  robot.style.transform = `translate(${newPos.x*38+10}px, ${newPos.y*38+10}px)`
}


function robotClick(robotIndex: number) {
  if(robotClickCallback) {
    robotClickCallback(robotIndex)
  }
}

export function onRobotClick(callback) {
  robotClickCallback = callback
}

function robotTouch(e: TouchEvent, robotIndex: number) {
  e.preventDefault()
  touchingIndex = robotIndex
  touchStart = {x: e.touches[0].screenX, y: e.touches[0].screenY}
  if(robotClickCallback) {
    robotClickCallback(robotIndex)
  }
}

function touchMove(e: TouchEvent) {
  if(touchingIndex===null) return
  const touchNow = {x: e.touches[0].screenX, y: e.touches[0].screenY}
  const diff = {x: touchStart.x - touchNow.x, y: touchStart.y - touchNow.y}
  if(Math.abs(diff.x)>TOUCH_MOVE_LENGTH && Math.abs(diff.y)<TOUCH_MOVE_LENGTH/2) {
    Game.moveActiveRobot(diff.x>0 ? Direction.LEFT : Direction.RIGHT)
    touchingIndex = null
    touchStart = null
  } else if(Math.abs(diff.y)>TOUCH_MOVE_LENGTH && Math.abs(diff.x)<TOUCH_MOVE_LENGTH/2) {
    Game.moveActiveRobot(diff.y>0 ? Direction.UP : Direction.DOWN)
    touchingIndex = null
    touchStart = null
  }
}


function createHTMLBoard(level: Level): string {
  return "<table class='boardTable'><tr>" + level.board.tiles.map((row, y) => row.map((walls, x) => {
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