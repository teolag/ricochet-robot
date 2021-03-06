import { Level } from "./models/Level"
import { getElementById } from "./utils"
import { Robot } from "./models/Robot"
import { IPos } from "./models/IPos"
import * as Game from "./game"
import { Direction } from "./enums/Direction"
import { Wall } from "./enums/wall"

const TOUCH_MOVE_LENGTH = 40

const boardElem = getElementById('board')

let robotClickCallback
let robotElems: HTMLDivElement[]
let goalElem: HTMLDivElement

let touchingIndex = null
let touchStart: IPos
document.addEventListener('touchend', _ => touchingIndex=null)
document.addEventListener('touchmove', touchMove, {passive: true})


export function loadLevel(level: Level) {
  const html = createHTMLBoard(level)
  boardElem.innerHTML = html

  goalElem = boardElem.querySelector('.goal')

  robotElems = level.robots.map(r => {
    const elem = document.createElement('div')
    elem.classList.add('robot', 'robot-'+r.idx)
    elem.innerText = (r.idx+1).toString()
    elem.addEventListener('click', _ => robotClick(r.idx))
    elem.addEventListener('touchstart', e => robotTouch(e, r.idx), {passive: true})
    return elem
  })
  robotElems.forEach(robotElem => {
    boardElem.appendChild(robotElem)
  })

  setRobotsPositions(level.robots)
}

export function setRobotsPositions(robots: Robot[]): Promise<void[]> {
  return Promise.all(robots.map((robot, i) => moveRobot(i, robot.getPos())))
}

export function moveRobot(robotIndex: number, newPos: IPos): Promise<void> {
  return new Promise((resolve) => {
    const robotElem = robotElems[robotIndex]

    const callback = e => {
      if(e.propertyName !== 'transform') return
      robotElem.removeEventListener('transitionend', callback)
      resolve()
    }

    robotElem.addEventListener('transitionend', callback)
    moveRobotElem(robotElem, newPos)
  })
}

export function setActiveRobot(robotIndex: number) {
  robotElems.forEach((r, i) => {
    r.classList.toggle('active', i === robotIndex)
  })
}


function moveRobotElem(robot: HTMLElement, newPos: IPos) {
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

export function setGoalVisited(value: boolean) {
  goalElem.classList.toggle('visited', value)
}


function createHTMLBoard(level: Level): string {
  return "<table class='boardTable'><tr>" + level.board.tiles.map((row, y) => row.map((walls, x) => {
    let text = ''
    const classes = []
    if(walls & Wall.UP) classes.push('wall-up')
    if(walls & Wall.LEFT) classes.push('wall-left')
    if(walls & Wall.RIGHT) classes.push('wall-right')
    if(walls & Wall.DOWN) classes.push('wall-down')
    
    if(level.goal.x === x && level.goal.y ===y) {
      text = `<div class="goal goal-${level.goal.robotIdx}"></div>`;
    }
    
    level.robots.forEach(robot => {
      if(robot.x === x && robot.y ===y) {
        text = `<div class="start start-${robot.idx}"></div>`;
      }
    })
    
    return `<td class='${classes.join(' ')}'>${text}</td>`
    
  }).join('')).join('</tr><tr>') + '</tr></table>'
}