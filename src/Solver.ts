import {Board} from './models/Board'
import {Goal} from './models/Goal'
import {Pos} from './models/Pos'
import { goNorth, goSouth, goWest, goEast } from './solver-utils'
import { Direction } from './models/Direction'

const MAX_CHECKED = 300000
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
  dir?: Direction
  color?: number
}

interface SolverOptions {
  backAgain?: boolean
}

export interface CompletedData {
  duration: number
  statesChecked: number
  isRouteFound: boolean
  isAllStatesChecked: boolean
  isAborted: boolean
  route: State[]
  robotsUsed: number[]
  minMoves: number
}

export interface ProgressData {
  checkedStates: number
  currentMovesCount: number
}

export class Solver {
  private readonly board: Board
  private readonly robots: Robot[]
  private readonly goal: Goal
  private readonly goalTile: number
  private readonly mainHomeTile: number
  private checkedStates = new Set<string>()
  private stateQueue: string[] = []
  private states = new Map<string, State>()
  private routeFound = false
  private aborted = false
  private allStatesChecked = false
  private running = false
  private foundRoute: State[]
  private completeCallback: Function|undefined
  private progressCallback: Function|undefined
  private duration = 0
  private minMoves: number
  private backAgain: boolean

  private pos2num = (pos: Pos) => pos.x + pos.y * this.board.w
  private getState = (robots: Robot[], goalVisited: boolean) => {
    const mainRobot = this.pos2num(robots[0])
    const helpers = robots.slice(1).map(r => this.pos2num(r)).sort().join(STATE_DELIMITER)
    const hash = mainRobot + (goalVisited ? 'Y':'N') + helpers
    return hash
  }

  constructor(level, options: SolverOptions = {}) {
    const {backAgain = false} = options
    this.board = level.board
    this.robots = level.robots
    this.goal = level.goal
    this.goalTile = this.pos2num(this.goal)
    this.mainHomeTile = this.pos2num(this.robots[this.goal.color])
    this.backAgain = backAgain
  }

  public solve() {
    const startState = this.getState(this.robots, false)
    this.stateQueue.push(startState)
    this.states.set(startState, {moves: 0, state: startState, robots: this.robots.slice(), goalVisited: false})
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
    this.stateQueue.length = 0
    this.states.clear()
    this.checkedStates.clear()
    return result
  }

  public isRouteFound() {
    return this.routeFound
  }

  public getResult(): CompletedData {
    return {
      duration: this.duration,
      statesChecked: this.checkedStates.size,
      isRouteFound: this.routeFound,
      isAllStatesChecked: this.allStatesChecked,
      isAborted: this.aborted,
      route: this.foundRoute,
      robotsUsed: getUsedRobots(this.foundRoute),
      minMoves: this.minMoves
    }
  }

  public onComplete(callback: (result: CompletedData) => void) {
    this.completeCallback = callback
  }

  public onProgress(callback: (data: ProgressData) => void) {
    this.progressCallback = callback
  }

  private checkNext() {
      const nextStateHash = this.stateQueue.shift()
      
      if(nextStateHash === undefined) {
        this.allStatesChecked = true
        this.running = false
        return
      }
      
      const state = this.states.get(nextStateHash)

      if(this.checkedStates.size === MAX_CHECKED) {
        this.minMoves = state.moves
        this.aborted = true
        this.running = false
        return
      }

      if(this.progressCallback && (this.checkedStates.size % 100 === 0)) {
        this.progressCallback({checkedStates: this.checkedStates.size, currentMovesCount: state.moves})
      }

      // console.debug("Checking", state, robots[nextStateHash.color], nextStateHash.dir, nextStateHash.previous)
      state.robots.forEach((_, idx) => {
        this.getNewStates(state, idx)
        .filter(newState => !this.states.has(newState.state))
        .forEach(newState => {
          this.checkIfShortestRouteFound(newState)
          this.stateQueue.push(newState.state)
          this.states.set(newState.state, newState)
        })
      })

      this.checkedStates.add(nextStateHash)
  }

  private checkIfShortestRouteFound(state: State) {
    if(state.color !== this.goal.color) return
    const goalRobot = state.robots[this.goal.color]
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
      return {state: stateHash, previous: state.state, robots: newRobots, dir: move.dir, color: robotIndex, goalVisited: state.goalVisited, moves: state.moves+1}
    })
  }
}

function getUsedRobots(route: State[]) {
  if(!route) return []
  const makeUnique = (arr: any[]) => [...new Set(arr)]
  return makeUnique(route.map(r => r.color))
}