import { Level } from "./models/Level"
import { getButton, getElementById } from "./utils"
import * as ColorControls from './components/color-controls'
import * as Game from './game'
import * as GameBoard from './game-board'
import { Direction } from "./enums/Direction"
import { registerServiceWorker } from "./service-worker-utils"
import { IGameOptions } from "./models/IGameOptions"

let level: Level
document.body.addEventListener('keydown', keyHandler)
getButton('btnNewGame').addEventListener('click', _ => regenerateGame())
const cbxBackAgain = getElementById<HTMLInputElement>('cbxBackAgain')
cbxBackAgain.addEventListener('click', toggleBackAgain)
getButton('btnUp').addEventListener('click', _ => Game.moveActiveRobot(Direction.UP))
getButton('btnLeft').addEventListener('click', _ => Game.moveActiveRobot(Direction.LEFT))
getButton('btnRight').addEventListener('click', _ => Game.moveActiveRobot(Direction.RIGHT))
getButton('btnDown').addEventListener('click', _ => Game.moveActiveRobot(Direction.DOWN))

registerServiceWorker()
startup()


function regenerateGame() {
  const queryString = location.search
  const options = queryStringToGameOptions(queryString)
  delete options.seed
  newGame(options)
}


async function startup() {
  const queryString = location.search
  const options = queryStringToGameOptions(queryString)
  newGame(options)
  cbxBackAgain.checked = options.backAgain
  ColorControls.onColorSelect(color => Game.switchRobot(color))
  GameBoard.onRobotClick(robotClick)

  const wakeLock = await (navigator as NavigatorExtended).wakeLock.request('screen')
}

function toggleBackAgain() {
  const queryString = location.search
  const options = queryStringToGameOptions(queryString)
  options.backAgain = !options.backAgain
  newGame(options)
}


function robotClick(robotIndex: number) {
  Game.switchRobot(robotIndex)
}

function keyHandler(e: KeyboardEvent) {
  if(e.key.match(/^\d$/)) {
    Game.switchRobot(parseInt(e.key)-1)
  }

  switch(e.key) {
    case 'F2': regenerateGame(); break;
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
    backAgain: cbxBackAgain.checked,
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