import {createCanvas} from 'canvas'
import * as fs from 'fs'
import { Wall, Board } from './models/Board'
import { State } from './Solver'
import { Goal } from './models/Goal'

const smallStyle = {
  cellSize: 10,
  cellGap: 1,
  imagePadding: 0,
  wallThickness: 2,
  robotRadius: 3,
  goalPadding: 2,
  goalThickness: 1
}

const style = {
  cellSize: 25,
  cellGap: 5,
  imagePadding: 10,
  wallThickness: 5,
  robotRadius: 8,
  goalPadding: 4,
  goalThickness: 4
}

/*
const level = new Level({
  height: 10,
  width: 10,
  robotCount: 4,
  wallsCount: 20,
  seed: 587658
})
*/

const {cellGap, cellSize, imagePadding, robotRadius, wallThickness, goalPadding, goalThickness} = style
const robotColors = ['red', 'green', 'blue', '#aa0', 'purple']

const cellColor = "white"
const gapColor = "#eee"

const wallColor = "#666"


export function printBoard(path: string, board: Board, goal: Goal, state?: State) {
  const width = board.w
  const height = board.h
  
  const verticalWalls = board.tiles.map(row => row.slice(0,-1).reduce((str, cell) => str + (cell & Wall.RIGHT ? 1 : 0), "")).join('').split('').map(v => v === "1")
  const horizontalWalls = board.tiles.slice(0,-1).map(row => row.reduce((str, cell) => str + (cell & Wall.DOWN ? 1 : 0), "")).join('').split('').map(v => v === "1")
  
  
  const imageWidth = imagePadding * 2 + width * (cellGap + cellSize) + cellGap
  const imageHeight = imagePadding * 2 + height * (cellGap + cellSize) + cellGap
  
  const canvas = createCanvas(imageWidth, imageHeight)
  const ctx = canvas.getContext('2d')
  // Background
  ctx.fillStyle="#999"
  ctx.fillRect(0, 0, imageWidth, imageHeight)
    


  ctx.save()
  ctx.translate(imagePadding, imagePadding)

  ctx.fillStyle = gapColor
  ctx.fillRect(0,0,width * (cellSize + cellGap) + cellGap,height * (cellSize + cellGap) + cellGap)

  // Draw cells
  ctx.fillStyle = cellColor
  for(let y = 0; y<height; y++) {
    for(let x = 0; x<width; x++) {
      ctx.fillRect(x*(cellSize+cellGap)+cellGap, y*(cellSize+cellGap)+cellGap, cellSize, cellSize)
    }
  }

  // Draw vertical walls
  ctx.fillStyle = wallColor
  for(let y = 0; y<height; y++) {
    for(let x = 0; x<(width-1); x++) {
      const i = x + y*(width-1)
      if(!verticalWalls[i]) continue
      ctx.fillRect((cellGap+cellSize)*(x+1) + cellGap/2 - wallThickness/2, y*(cellSize+cellGap)+cellGap/2, wallThickness, cellSize+cellGap)
    }
  }

  // Draw horizontal walls
  ctx.fillStyle = wallColor
  for(let y = 0; y<(height-1); y++) {
    for(let x = 0; x<width; x++) {
      const i = x + y*width
      if(!horizontalWalls[i]) continue
      ctx.fillRect(x*(cellSize+cellGap)+cellGap/2, (cellGap+cellSize)*(y+1) + cellGap/2 - wallThickness/2, cellSize+cellGap, wallThickness)
    }
  }

  // Outer walls
  ctx.strokeStyle = wallColor
  ctx.lineWidth = wallThickness
  ctx.strokeRect(cellGap/2, cellGap/2,width*(cellSize+cellGap), height*(cellSize+cellGap))


  // Move
  if(state && state.lastMove) {
    ctx.globalAlpha = 0.2
    ctx.beginPath()
    const x = state.lastMove.from.x * (cellGap+cellSize) + cellGap + cellSize/2
    const y = state.lastMove.from.y * (cellGap+cellSize) + cellGap + cellSize/2
    ctx.arc(x,y,robotRadius, 0, 2*Math.PI)
    ctx.fillStyle = robotColors[state.lastMove.robotIdx]
    ctx.fill()
    ctx.closePath()
    ctx.globalAlpha = 1
  }


  // Robots
  const robots = state ? state.robots : []
  robots.forEach(robot => {
    ctx.beginPath()
    const x = robot.x * (cellGap+cellSize) + cellGap + cellSize/2
    const y = robot.y * (cellGap+cellSize) + cellGap + cellSize/2
    ctx.arc(x,y,robotRadius, 0, 2*Math.PI)
    ctx.fillStyle = robotColors[robot.idx]
    ctx.fill()
    ctx.closePath()
  })


  // Goal
  ctx.save()
  ctx.strokeStyle = robotColors[goal.robotIdx]
  ctx.lineWidth = goalThickness
  ctx.translate(goal.x*(cellGap+cellSize)+cellGap, goal.y*(cellGap+cellSize)+cellGap)
  ctx.beginPath()
  ctx.moveTo(goalPadding, goalPadding)
  ctx.lineTo(cellSize - goalPadding, cellSize - goalPadding)
  ctx.moveTo(cellSize - goalPadding, goalPadding)
  ctx.lineTo(goalPadding, cellSize - goalPadding)
  ctx.stroke()
  ctx.restore()


  ctx.restore()
  const out = fs.createWriteStream(path)
  const stream = canvas.createPNGStream()
  stream.pipe(out)
  out.on('finish', () =>  console.log('The PNG file was created.'))
}
