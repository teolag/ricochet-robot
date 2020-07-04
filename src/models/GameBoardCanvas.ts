import {Pos} from './Pos'
import {Goal} from './Goal'
import { getElementById } from '../utils'


const tileSize = 40
const colors = ['red', 'green', 'blue', '#aa0', 'purple']
const margin = 5

export class GameBoard {
  private backgroundCanvas: HTMLCanvasElement
  private backgroundContext: CanvasRenderingContext2D
  private robotCanvas: HTMLCanvasElement
  private robotContext: CanvasRenderingContext2D
  private tiles: number[][]
  private starts: Pos[]
  private robots: Pos[]
  private goal: Goal


  constructor(tiles: number[][], starts: Pos[], goal: Goal) {
    this.tiles = tiles
    this.starts = starts
    this.robots = starts.map(s => ({x: s.x, y:s.y}))
    this.goal = goal
    this.backgroundCanvas = getElementById<HTMLCanvasElement>("backgroundCanvas")
    this.backgroundCanvas.width = this.tiles[0].length * tileSize + 2*margin
    this.backgroundCanvas.height = this.tiles.length * tileSize + 2*margin
    this.robotCanvas = getElementById<HTMLCanvasElement>("robotCanvas")
    this.robotCanvas.width = this.tiles[0].length * tileSize + 2*margin
    this.robotCanvas.height = this.tiles.length * tileSize + 2*margin
    const backgroundContext = this.backgroundCanvas.getContext('2d')
    const robotContext = this.robotCanvas.getContext('2d')
    if(!backgroundContext || !robotContext) throw Error("Can not get 2d contexts")
    this.backgroundContext = backgroundContext
    this.robotContext = robotContext
    this.drawBoard()
  }


  public resetRobots() {
    this.robots.forEach((r, i) => {
      const start = this.starts[i]
      r.x = start.x
      r.y = start.y
    })
  }

  public moveRobot(index: number, position: Pos) {
    const {x: startX, y: startY} = this.robots[index]
    const {x: endX, y: endY} = position
    let percent = 0

    let lastTs = 0
    this.robotContext.save()
    this.robotContext.translate(margin, margin)
    const tic = (ts = 0) => {
      const diff = ts && lastTs ? (ts - lastTs)/1000 : 0
      lastTs = ts
      
      this.eraseRobot(this.robotContext, index, this.robots[index])

      this.robots[index].x = startX + (endX - startX) * percent
      this.robots[index].y = startY + (endY - startY) * percent
      this.drawRobot(this.robotContext, index, this.robots[index])

      if(percent<1) {
        requestAnimationFrame(tic)
        percent+=diff*1
        if(percent>1) percent=1
      } else {
        this.robotContext.restore()
      }
    }
    tic()
  }

  public drawBoard() {
    this.backgroundContext.save()
    this.backgroundContext.translate(margin, margin)
    this.drawTiles(this.backgroundContext)
    this.drawStarts(this.backgroundContext)
    this.drawGoal(this.backgroundContext)
    this.backgroundContext.restore()
    
    this.robotContext.save()
    this.robotContext.translate(margin, margin)
    this.drawRobots(this.robotContext)
    this.robotContext.restore()
  }

  private drawTiles(ctx: CanvasRenderingContext2D) {
    this.tiles.forEach((row, y) => {
      row.forEach((wall, x) => {
        ctx.save()
        ctx.translate(x*tileSize, y*tileSize)
        
        /*ctx.fillStyle = "#eee"
        ctx.strokeStyle = "white"
        ctx.beginPath()
        ctx.rect(0,0,tileSize, tileSize)
        ctx.fill()
        ctx.stroke()
        */

        ctx.beginPath()
        ctx.strokeStyle = "black"
        ctx.lineWidth = 5
        if(y===0 && wall & 1) {
          ctx.moveTo(0,0)
          ctx.lineTo(tileSize, 0)
        }
        if(x===0 && wall & 2) {
          ctx.moveTo(0,0)
          ctx.lineTo(0, tileSize)
        }
        if(wall & 4) {
          ctx.moveTo(tileSize,0)
          ctx.lineTo(tileSize, tileSize)
        }
        if(wall & 8) {
          ctx.moveTo(0,tileSize)
          ctx.lineTo(tileSize, tileSize)
        }
        ctx.stroke()

        ctx.restore()
      })
    })
  }

  private drawStarts(ctx: CanvasRenderingContext2D) {
    this.starts.forEach((start, i) => {
      ctx.save()
      ctx.globalAlpha = 0.3
      ctx.fillStyle = colors[i]
      ctx.translate(start.x*tileSize + tileSize/2, start.y*tileSize + tileSize/2)
      ctx.beginPath()
      ctx.arc(0,0,tileSize/4, 0, Math.PI*2)
      ctx.fill()
      ctx.restore()
    })
  }

  private drawGoal(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.strokeStyle = colors[this.goal.color]
    ctx.lineWidth = 5
    ctx.translate(this.goal.x*tileSize, this.goal.y*tileSize)
    ctx.beginPath()
    ctx.moveTo(10,10)
    ctx.lineTo(tileSize-10,tileSize-10)
    ctx.moveTo(tileSize-10,10)
    ctx.lineTo(10,tileSize-10)
    ctx.stroke()
    ctx.restore()
  }

  private drawRobots(ctx: CanvasRenderingContext2D) {
    this.robots.forEach((robot, index) => {
      this.drawRobot(ctx, index, robot)
    })
  }

  private drawRobot(ctx: CanvasRenderingContext2D, index: number, position: Pos) {
    ctx.save()
    ctx.translate(position.x*tileSize + tileSize/2, position.y*tileSize + tileSize/2)
    ctx.fillStyle = colors[index]
    ctx.beginPath()
    ctx.arc(0,0,tileSize/3, 0, Math.PI*2)
    ctx.fill()
    ctx.restore()
  }

  private eraseRobot(ctx: CanvasRenderingContext2D, index: number, position: Pos) {
    ctx.save()
    ctx.translate(position.x*tileSize, position.y*tileSize)
    ctx.clearRect(0,0,tileSize,tileSize)
    ctx.restore()
  }

}