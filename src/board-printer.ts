import {createCanvas} from 'canvas'
import { Level } from './models/Level'
import { Wall } from './models/Board'



const level = new Level({
  height: 10,
  width: 10,
  robotCount: 4,
  wallsCount: 20,
  seed: 587658
})


const width = level.board.w
const height = level.board.h

const verticalWalls = level.board.tiles.map(row => row.slice(0,-1).reduce((str, cell) => str + (cell & Wall.EAST ? 1 : 0), "")).join('').split('').map(v => v === "1")
const horizontalWalls = level.board.tiles.slice(0,-1).map(row => row.reduce((str, cell) => str + (cell & Wall.SOUTH ? 1 : 0), "")).join('').split('').map(v => v === "1")


const cellSize = 40
const cellGap = 3
const cellColor = "white"
const gapColor = "#ddd"

const picPadding = 10
const picWidth = picPadding * 2 + width * (cellGap + cellSize) + cellGap
const picHeight = picPadding * 2 + height * (cellGap + cellSize) + cellGap

const wallThickness = 5
const wallColor = "#666"


const canvas = createCanvas(picWidth, picHeight)
const ctx = canvas.getContext('2d')


// Background
ctx.fillStyle="#999"
ctx.fillRect(0, 0, picWidth, picHeight)


ctx.save()
ctx.translate(picPadding, picPadding)

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

ctx.restore()


const fs = require('fs')
const out = fs.createWriteStream(__dirname + '/test.png')
const stream = canvas.createPNGStream()
stream.pipe(out)
out.on('finish', () =>  console.log('The PNG file was created.'))










function pack(values: string) {
  var chunks = values.match(/.{1,16}/g), packed = ''
  for (var i=0; i < chunks.length; i++) {
      packed += String.fromCharCode(parseInt(chunks[i], 2));
  }
  return packed;
}

function unpack(packed: string) {
  var values = '';
  for (var i=0; i < packed.length; i++) {
      values += packed.charCodeAt(i).toString(2);
  }
  return values;
}