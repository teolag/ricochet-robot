import {Board} from './models/Board'
import {Goal} from './models/Goal'
import {Pos} from './models/Pos'
import { goNorth, goSouth, goWest, goEast } from './solver-utils'
import { Direction } from './models/Direction'

const MAX_CHECKED = 200000
const STATE_DELIMITER = '|'

interface Robot {
  x: number
  y: number
  color: number
}

const notNull = <T>(value: T | null): value is T => value !== null
interface State {
  goalVisited: boolean
  moves: number
  previous: string
  state: string
  robots: Robot[]
  dir: Direction
  color: number
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
  private readonly homeTile: number
  private checkedStates = new Map<string, State>()
  private statesUnchecked = new Set<string>()
  private uncheckedStates: State[] = []
  private routeFound = false
  private aborted = false
  private allStatesChecked = false
  private running = false
  private foundRoute: State[]
  private completeCallback: Function|undefined
  private progressCallback: Function|undefined
  private duration = 0
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
    this.homeTile = this.pos2num(this.robots[this.goal.color])
    this.backAgain = backAgain
  }

  public solve() {
    const startState = this.getState(this.robots, false)
    this.uncheckedStates = [{moves: 0, previous: '', color:0, dir: null, state: startState, robots: this.robots.slice(), goalVisited: false}]
    this.statesUnchecked = new Set(startState)
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
    this.statesUnchecked.clear()
    this.uncheckedStates.length = 0
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
    }
  }

  public onComplete(callback: (result: CompletedData) => void) {
    this.completeCallback = callback
  }

  public onProgress(callback: (data: ProgressData) => void) {
    this.progressCallback = callback
  }

  private checkNext() {
      const currentState = this.uncheckedStates.shift()
      if(currentState === undefined) {
        this.allStatesChecked = true
        this.running = false
        return
      }

      if(this.progressCallback && (this.checkedStates.size % 100 === 0)) {
        this.progressCallback({checkedStates: this.checkedStates.size, currentMovesCount: currentState.moves})
      }

      const {state, robots, previous, moves} = currentState
      console.debug("Checking", state, robots[currentState.color], currentState.dir, currentState.previous)
      this.statesUnchecked.delete(state)
  
      let goalVisited = currentState.goalVisited
      if(this.isGoalReached(robots)) {
        if(!this.backAgain) {
          this.goalReached(currentState, previous)
          return
        }
        goalVisited = true
      }
      if(this.backAgain && goalVisited && this.isBackAgain(robots)) {
        this.goalReached(currentState, previous)
        return
      }
      
      robots.forEach((_, i) => {
        const newStates = this.getNewStates(robots, i, goalVisited)
        .filter(s => !this.checkedStates.has(s.state))
        .filter(s => !this.statesUnchecked.has(s.state))
        .map(s => ({...s, previous: state, moves: moves+1}))
        if(newStates.length) {
          // console.debug("add", i, newStates.map(s => s.robots[i].x + ',' + s.robots[i].y).join('  '))
          newStates.forEach(s => {
            this.uncheckedStates.push(s)
            this.statesUnchecked.add(s.state)
          })
        }
      })
      
      this.checkedStates.set(state, currentState)

      if(this.checkedStates.size === MAX_CHECKED) {
        this.aborted = true
        this.running = false
        return
      }
  }

  private isGoalReached(robots: Robot[]) {
    return this.pos2num(robots[this.goal.color]) === this.goalTile
  }

  private isBackAgain(robots: Robot[]) {
    return this.pos2num(robots[this.goal.color]) === this.homeTile
  }

  private goalReached(thisState: State, previous: string) {
    this.routeFound = true
    this.running = false
    let state = thisState
    this.foundRoute = []
    
    while(state.previous) {
      this.foundRoute.unshift(state)
      const nextState = this.checkedStates.get(state.previous)
      if(nextState === undefined) throw Error(`state ${previous} not found`)
      state = nextState
    }
  }


  private getNewStates (robots: Robot[], robotIndex: number, goalVisited: boolean) {
    const robot = robots[robotIndex]
    const otherRobots = robots.filter(r => r.color !== robotIndex)

    return [
      goNorth(this.board, robot, otherRobots),
      goWest(this.board, robot, otherRobots),
      goEast(this.board, robot, otherRobots),
      goSouth(this.board, robot, otherRobots)
    ].filter(notNull).map(move => {
      const newRobots = robots.slice()
      newRobots[robotIndex] = {x: move.pos.x, y: move.pos.y, color: newRobots[robotIndex].color}
      const state = this.getState(newRobots, goalVisited)
      return {state, robots: newRobots, dir: move.dir, color: robotIndex, goalVisited}
    })
  }
}

function getUsedRobots(route: State[]) {
  if(!route) return []
  const makeUnique = (arr: any[]) => [...new Set(arr)]
  return makeUnique(route.map(r => r.color))
}