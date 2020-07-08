import { Level } from "./models/Level"
import { getButton } from "./utils"
import * as ColorControls from './components/color-controls'
import * as Game from './game'
import * as GameBoard from './game-board'
import { Direction } from "./enums/Direction"
import { registerServiceWorker } from "./service-worker-utils"
import { IGameOptions } from "./models/IGameOptions"



/*
Rules
https://www.youtube.com/watch?v=OQOMmftaWAQ
https://images.zmangames.com/filer_public/c0/b4/c0b482f1-ad3e-4e5d-ae48-0c11aa7c317a/en-ricochet_robot-rules.pdf

https://wiki.ubc.ca/Course:CPSC:Artificial_Intelligence/States_and_Searching

https://www.youtube.com/watch?v=fvuK0Us4xC4
  - Pre-compute stops. Var kan man åka från varje cell om det inte står en robot ivägen
  - Robot Equivalent. Hjälprobotarna kan byta plats med varandra utan att det påverkar
  - Arrays, not Sets. Hjälper det i JS?
  - Less objects. ?



!!!IMPROVEMENTS!!!

* om två hjälprobotar byter plats är det ett redan besökt state ---- KLAR!
* om en hjälprobot kommer tillbaka till en plats utan att ha krockat med någon annan är det ett onödigt drag. Nee. den kan ju ha flyttat undan för att släppa förbi en annan robot

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
  - 1,2,3,... to switch robot

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
getButton('btnNewGame').addEventListener('click', _ => newGame({}))


function startup() {
  const queryString = location.search
  const options = queryStringToGameOptions(queryString)
  newGame(options)
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
    case 'F2': newGame({}); break;
    case 'Escape': Game.resetLevel(); break;
    case 'ArrowUp': Game.moveActiveRobot(Direction.UP); break;
    case 'ArrowLeft': Game.moveActiveRobot(Direction.LEFT); break;
    case 'ArrowRight': Game.moveActiveRobot(Direction.RIGHT); break;
    case 'ArrowDown': Game.moveActiveRobot(Direction.DOWN); break;
  }
}

function newGame(opts: Partial<IGameOptions>) {
  const defaults: IGameOptions = {
    seed: Math.floor(Math.random()*1000000),
    backAgain: false,
    width: 10,
    height: 10,
    wallsCount: 20,
    robotCount: 4,
  }
  const options: IGameOptions = Object.assign({}, defaults, opts)
  const query = gameOptionsToQueryString(options)
  history.replaceState(null, "title", '/?'+query)
  level = new Level(options)
  Game.startGame(level, options.backAgain)
  // gameBoard = new GameBoard(level.board.tiles, level.robots.map(r => ({x: r.x, y: r.y})), level.goal)
}


window.addEventListener('beforeinstallprompt', (beforeInstallEvent: BeforeInstallPromptEvent) => {
  beforeInstallEvent.preventDefault();
  const installButton = document.getElementById("btnInstall")
  installButton.hidden = false
  installButton.onclick = () => beforeInstallEvent.prompt()
});



function gameOptionsToQueryString(options: IGameOptions): string {
  const query = new URLSearchParams({
    width: options.width.toString(),
    height: options.height.toString(),
    seed: options.seed.toString(),
    robotCount: options.robotCount.toString(),
    wallsCount: options.wallsCount.toString(),
    backAgain: options.backAgain ? 'true' : 'false'
  })
  return query.toString()
}

function queryStringToGameOptions(queryString: string): Partial<IGameOptions> {
  const queryParams = new URLSearchParams(queryString)
  const options: Partial<IGameOptions> = {}
  
  const seedStr = queryParams.get('seed')
  if(seedStr) options.seed = parseInt(seedStr)
  
  const widthStr = queryParams.get('width')
  if(widthStr) options.width = parseInt(widthStr)
  
  const heightStr = queryParams.get('height')
  if(heightStr) options.height = parseInt(heightStr)
  
  const wallsCountStr = queryParams.get('wallsCount')
  if(wallsCountStr) options.wallsCount = parseInt(wallsCountStr)
  
  const robotCountStr = queryParams.get('robotCount')
  if(robotCountStr) options.robotCount = parseInt(robotCountStr)
  
  const backAgainStr = queryParams.get('backAgain')
  if(backAgainStr) options.backAgain = backAgainStr === 'true'
  
  return options
  
}