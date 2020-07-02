import { Level } from "./models/Level"
import { getButton } from "./utils"
import * as ColorControls from './components/color-controls'
import * as Game from './game'
import * as GameBoard from './game-board'
import { Direction } from "./models/Direction"
import { registerServiceWorker } from "./service-worker"



/*

!!!IMPROVEMENTS!!!

* om två hjälprobotar byter plats är det ett redan besökt state ---- KLAR!
* om en hjälprobot kommer tillbaka till en plats utan att ha krockat med någon annan är det ett onödigt drag

!!!!!!!!!!!!!!!!!!!!!




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
// let gameBoard: GameBoard

registerServiceWorker()
startup()



getButton('btnUp').addEventListener('click', _ => Game.moveActiveRobot(Direction.UP))
getButton('btnLeft').addEventListener('click', _ => Game.moveActiveRobot(Direction.LEFT))
getButton('btnRight').addEventListener('click', _ => Game.moveActiveRobot(Direction.RIGHT))
getButton('btnDown').addEventListener('click', _ => Game.moveActiveRobot(Direction.DOWN))

document.body.addEventListener('keydown', keyHandler)

getButton('btnShowSolution').addEventListener('click', Game.showSolution)
getButton('btnNewGame').addEventListener('click', _ => newGame())




function startup() {
  const seedStr = location.hash.substr(1)
  newGame(seedStr ? parseInt(seedStr) : undefined)
  ColorControls.onColorSelect(color => Game.switchRobot(color))
  GameBoard.onRobotClick(robotClick)
}


function robotClick(robotIndex: number) {
  Game.switchRobot(robotIndex)
}

function keyHandler(e: KeyboardEvent) {
  if(e.key.match(/^\d$/)) {
    Game.switchRobot(parseInt(e.key)-1)
  }

  switch(e.key) {
    case 'F2': newGame(); break;
    case 'Escape': Game.resetLevel(); break;
    case 'ArrowUp': Game.moveActiveRobot(Direction.UP); break;
    case 'ArrowLeft': Game.moveActiveRobot(Direction.LEFT); break;
    case 'ArrowRight': Game.moveActiveRobot(Direction.RIGHT); break;
    case 'ArrowDown': Game.moveActiveRobot(Direction.DOWN); break;
  }
}

function newGame(seed = Math.floor(Math.random()*1000000)) {
  location.hash = seed.toString()
  level = new Level({
    width: 10,
    height: 10,
    robotCount: 4,
    seed
  })
  Game.loadLevel(level)
  // gameBoard = new GameBoard(level.board.tiles, level.robots.map(r => ({x: r.x, y: r.y})), level.goal)
}


window.addEventListener('beforeinstallprompt', (beforeInstallEvent: BeforeInstallPromptEvent) => {
  beforeInstallEvent.preventDefault();
  const installButton = document.getElementById("btnInstall")
  installButton.hidden = false
  installButton.onclick = () => beforeInstallEvent.prompt()
});
