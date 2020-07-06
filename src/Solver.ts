import {Board} from './models/Board'
import {Goal} from './models/Goal'
import {Pos} from './models/Pos'
import { goNorth, goSouth, goWest, goEast } from './solver-utils'
import { Direction } from './models/Direction'
import Timer from './libs/Timer'

const STATE_DELIMITER = '|'

interface Robot {
  x: number
  y: number
  idx: number
}

const notNull = <T>(value: T | null): value is T => value !== null
interface State {
  goalVisited: boolean
  moves: number
  previous?: string
  state: string
  robots: Robot[]
  lastMoveDirection: Direction
  lastMoveRobotIdx: number
}

interface SolverOptions {
  backAgain?: boolean
  abortAfter?: number
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
  private getState = (robots: Robot[], goalVisited: boolean) => {
    const mainRobot = this.pos2num(robots[0])
    const helpers = robots.slice(1).map(r => this.pos2num(r)).sort().join(STATE_DELIMITER)
    const hash = mainRobot + (goalVisited ? 'Y':'N') + helpers
    return hash
  }

  constructor(level, options: SolverOptions = {}) {
    const {backAgain = false, abortAfter = 500000} = options
    this.board = level.board
    this.robots = level.robots
    this.goal = level.goal
    this.goalTile = this.pos2num(this.goal)
    this.mainHomeTile = this.pos2num(this.robots[this.goal.robotIdx])
    this.backAgain = backAgain
    this.abortAfter = abortAfter
  }

  public solve() {
    const startState = this.getState(this.robots, false)
    this.statesQueue.push(startState)
    this.states.set(startState, {moves: 0, state: startState, lastMoveDirection: null, lastMoveRobotIdx: null, robots: this.robots.slice(), goalVisited: false})
    const start = new Date()

    this.running = true
    while(this.running) {
      Timer.time('check-next', () => this.checkNext())
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
    const nextStateHash = Timer.time('get-next-state-hash', () => this.statesQueue[this.currentStateIndex])

    if(nextStateHash === undefined) {
      this.allStatesChecked = true
      this.running = false
      return
    }
    
    const state = Timer.time('get-next-state', () => this.states.get(nextStateHash))

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
    state.robots.forEach((_, idx) => {
      Timer.time('get-new-states', () => this.getNewStates(state, idx))
        .filter(newState => Timer.time('has-state', () => !this.states.has(newState.state)))
        .forEach(newState => {
          Timer.time('check-win', () => this.checkIfShortestRouteFound(newState))
          Timer.time('add-states', () => {
            this.statesQueue.push(newState.state)
            this.states.set(newState.state, newState)
          })
        })
    })
    this.currentStateIndex++
  }

  private checkIfShortestRouteFound(state: State) {
    if(state.lastMoveRobotIdx !== this.goal.robotIdx) return
    const goalRobot = state.robots[this.goal.robotIdx]
    if(this.isAtGoal(goalRobot)) {
      if(!this.backAgain) {
        this.shortestRouteFound(state)
      }
      state.goalVisited = true
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

  private shortestRouteFound(thisState: State) {
    this.routeFound = true
    this.running = false
    let state = thisState
    this.foundRoute = []
    
    while(state.previous) {
      this.foundRoute.unshift(state)
      const nextState = this.states.get(state.previous)
      if(nextState === undefined) throw Error(`state ${state.previous} not found`)
      state = nextState
    }
  }


  private getNewStates (state: State, robotIndex: number): State[] {
    // TODO:  make faster!!
    // pre-calculate all stops for every tile (exl. helper robots)?
    const robot = state.robots[robotIndex]
    const otherRobots = state.robots.filter(r => r.idx !== robotIndex)

    return [
      goNorth(this.board, robot, otherRobots),
      goWest(this.board, robot, otherRobots),
      goEast(this.board, robot, otherRobots),
      goSouth(this.board, robot, otherRobots)
    ].filter(notNull).map(move => {
      const newRobots = state.robots.slice()
      newRobots[robotIndex] = {x: move.pos.x, y: move.pos.y, idx: newRobots[robotIndex].idx}
      const stateHash = this.getState(newRobots, state.goalVisited)
      return {
        state: stateHash,
        previous: state.state,
        robots: newRobots,
        lastMoveDirection: move.dir,
        lastMoveRobotIdx: robotIndex,
        goalVisited: state.goalVisited,
        moves: state.moves+1
      }
    })
  }
}

function getUsedRobots(route: State[]): number[] {
  if(!route) return []
  const makeUnique = (arr: any[]) => [...new Set(arr)]
  return makeUnique(route.map(route => route.lastMoveRobotIdx)).sort()
}



