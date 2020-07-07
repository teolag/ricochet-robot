import {Board} from './models/Board'
import {Goal} from './models/Goal'
import {Pos} from './models/Pos'
import { goUp, goDown, goLeft, goRight } from './solver-utils'
import { Direction } from './models/Direction'
import * as Timer from './libs/Timer'
import { Level } from './models/Level'

const STATE_DELIMITER = '|'

interface Robot {
  x: number
  y: number
  posNum: number
  idx: number
}

export interface State {
  goalVisited: boolean
  moves: number
  previous?: string
  hash: string
  robots: Robot[]
  lastMove: {
    direction: Direction
    robotIdx: number
    from: Pos
    to: Pos
  }
}

interface SolverOptions {
  backAgain?: boolean
  abortAfter?: number
}

export interface Move {
  pos: {
    x:number
    y:number
  }
  dir: Direction
  robotIdx: number
}

export interface CompletedData {
  duration: number
  statesChecked: number
  isRouteFound: boolean
  isAllStatesChecked: boolean
  isAborted: boolean
  route: State[]
  robotsUsed: number[]
  minMoves: number,
  timers: object
}

export interface ProgressData {
  checkedStates: number
  currentMovesCount: number
  timers: object
}

export class Solver {
  private readonly board: Board
  private readonly robots: Robot[]
  private readonly goal: Goal
  private readonly goalTile: number
  private readonly mainHomeTile: number
  private currentStateIndex = 0
  private statesQueue: string[] = []
  private states = new Map<string, State>()
  private routeFound = false
  private aborted = false
  private allStatesChecked = false
  private running = false
  private foundRoute: State[]
  private completeCallback: (data: CompletedData) => void
  private progressCallback: (data: ProgressData) => void
  private progressRatio = 1000
  private duration = 0
  private minMoves: number
  private backAgain: boolean
  private abortAfter: number

  private pos2num = (pos: Pos) => pos.x + pos.y * this.board.w
  private getStateHash = (robots: Robot[], goalVisited: boolean) => {
    const helpers = robots.slice(1).map(r => r.posNum).sort().join(STATE_DELIMITER)
    const hash = robots[0].posNum + (goalVisited ? 'Y':'N') + helpers
    return hash
  }

  constructor(level: Level, options: SolverOptions = {}) {
    const {backAgain = false, abortAfter = 1e7} = options
    this.board = level.board
    this.robots = level.robots.map(r => ({...r, posNum: r.x + r.y * this.board.w}))
    this.goal = level.goal
    this.goalTile = this.pos2num(this.goal)
    this.mainHomeTile = this.pos2num(this.robots[this.goal.robotIdx])
    this.backAgain = backAgain
    this.abortAfter = abortAfter
  }

  public solve() {
    const startState = this.getStateHash(this.robots, false)
    this.statesQueue.push(startState)
    this.states.set(startState, {moves: 0, hash: startState, lastMove: null, robots: this.robots.slice(), goalVisited: false})
    const start = new Date()

    this.running = true
    while(this.running) {
      this.checkNext()
    }
    this.duration = (new Date().getTime() - start.getTime()) / 1000
    const result = this.getResult()
    if(this.completeCallback) {
      this.completeCallback(result)
    }
    this.statesQueue.length = 0
    this.states.clear()
    return result
  }

  public isRouteFound() {
    return this.routeFound
  }

  public getResult(): CompletedData {
    return {
      duration: this.duration,
      statesChecked: this.currentStateIndex,
      isRouteFound: this.routeFound,
      isAllStatesChecked: this.allStatesChecked,
      isAborted: this.aborted,
      route: this.foundRoute,
      robotsUsed: getUsedRobots(this.foundRoute),
      minMoves: this.minMoves,
      timers: Timer.getTotals()
    }
  }

  public onComplete(callback: (result: CompletedData) => void) {
    this.completeCallback = callback
  }

  public onProgress(callback: (data: ProgressData) => void, sendProgressEvery = 1000) {
    this.progressRatio = sendProgressEvery
    this.progressCallback = callback
  }

  private checkNext() {
    if(this.currentStateIndex+1 > this.statesQueue.length) {
      this.allStatesChecked = true
      this.running = false
      return
    }

    const nextStateHash = this.statesQueue[this.currentStateIndex]
    const state = this.states.get(nextStateHash)

    if(this.currentStateIndex === this.abortAfter) {
      this.minMoves = state.moves
      this.aborted = true
      this.running = false
      return
    }

    if(this.progressCallback && (this.currentStateIndex % this.progressRatio === 0)) {
      this.progressCallback({checkedStates: this.currentStateIndex, currentMovesCount: state.moves, timers: Timer.getAndClear()})
    }

    // console.debug("Checking", state, robots[nextStateHash.color], nextStateHash.dir, nextStateHash.previous)
    
    this.processState(state)

    this.currentStateIndex++
  }

  private checkIfShortestRouteFound(state: State): void {
    if(state.lastMove.robotIdx !== this.goal.robotIdx) return
    const goalRobot = state.robots[this.goal.robotIdx]
    if(this.isAtGoal(goalRobot)) {
      state.goalVisited = true
      if(!this.backAgain) {
        this.shortestRouteFound(state)
      }
    } else if(this.backAgain && state.goalVisited && this.isAtHome(goalRobot)) {
      this.shortestRouteFound(state)
    }
  }

  private isAtGoal(mainRobot: Robot) {
    return this.pos2num(mainRobot) === this.goalTile
  }

  private isAtHome(mainRobot: Robot) {
    return this.pos2num(mainRobot) === this.mainHomeTile
  }

  private shortestRouteFound(endState: State) {
    this.routeFound = true
    this.running = false
    let state = endState
    this.foundRoute = []

    /*
    let i = 0
    const u = Array.from(this.states.values())
    u.forEach(state => {
      printBoard(i+' - '+state.hash+'.png', this.board, this.goal, state)
      i++
    })
    */

    while(state.previous) {
      this.foundRoute.unshift(state)
      const nextState = this.states.get(state.previous)
      if(nextState === undefined) throw Error(`state ${state.previous} not found`)
      state = nextState
    }
  }


  private processState (state: State) {
    const moves: Move[] = []
    for(const robot of state.robots) {
      const helpers = state.robots.filter(r => r.idx !== robot.idx)
      
      const up = goUp(this.board, robot, helpers)
      if(up) moves.push(up)
      
      const left = goLeft(this.board, robot, helpers)
      if(left) moves.push(left)
      
      const right = goRight(this.board, robot, helpers)
      if(right) moves.push(right)
      
      const down = goDown(this.board, robot, helpers)
      if(down) moves.push(down)
    }
    

    for(let move of moves) {
      const newRobots = state.robots.slice()
      newRobots[move.robotIdx] = {x: move.pos.x, y: move.pos.y, idx: move.robotIdx, posNum: this.pos2num(move.pos)}

      const stateHash = this.getStateHash(newRobots, state.goalVisited)

      const exists = this.states.has(stateHash)
      if(exists) continue
      
      const newState: State = {
        hash: stateHash,
        previous: state.hash,
        robots: newRobots,
        lastMove: {
          direction: move.dir,
          robotIdx: move.robotIdx,
          from: {x: state.robots[move.robotIdx].x, y: state.robots[move.robotIdx].y},
          to: {x: move.pos.x, y: move.pos.y}
        },
        goalVisited: state.goalVisited,
        moves: state.moves+1
      }
      
      this.checkIfShortestRouteFound(newState)
      this.statesQueue.push(newState.hash)
      this.states.set(newState.hash, newState)
    }
  }
}

function getUsedRobots(route: State[]): number[] {
  if(!route) return []
  const makeUnique = (arr: any[]) => [...new Set(arr)]
  return makeUnique(route.map(route => route.lastMove.robotIdx)).sort()
}
