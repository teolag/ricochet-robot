import {Board} from './Board'
import {Goal} from './Goal'
import {IPos} from './IPos'
import { goUp, goDown, goLeft, goRight } from '../solver-utils'
import * as Timer from '../libs/Timer'
import { Level } from './Level'
import { IState } from './IState'
import { ICompletedData } from './ICompletedData'
import { ISolverOptions } from './ISolverOptions'
import { ITestMove } from './ITestMove'
import { IProgressData } from './IProgressData'
import { ISolverRobot } from './ISolverRobot'
import { IMove } from './IMove'

const STATE_DELIMITER = '|'

export class Solver {
  private readonly board: Board
  private readonly robots: ISolverRobot[]
  private readonly goal: Goal
  private readonly goalTile: number
  private readonly mainHomeTile: number
  private currentStateIndex = 0
  private statesQueue: string[] = []
  private states = new Map<string, IState>()
  private routeFound = false
  private aborted = false
  private allStatesChecked = false
  private running = false
  private foundRoute: IMove[]
  private completeCallback: (data: ICompletedData) => void
  private progressCallback: (data: IProgressData) => void
  private progressRatio = 1000
  private duration = 0
  private minMoves: number
  private backAgain: boolean
  private abortAfter: number
  private robotsUsed: number[]

  private pos2num = (pos: IPos) => pos.x + pos.y * this.board.w
  private getStateHash = (robots: ISolverRobot[], goalVisited: boolean) => {
    const helpers = robots.slice(1).map(r => r.posNum).sort().join(STATE_DELIMITER)
    const hash = robots[0].posNum + (goalVisited ? 'Y':'N') + helpers
    return hash
  }

  constructor(level: Level, options: ISolverOptions = {}) {
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
    this.states.set(startState, {moves: 0, hash: startState, robots: this.robots.slice(), goalVisited: false, direction:null, robotIdx:null})
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

  public getResult(): ICompletedData {
    return {
      duration: this.duration,
      statesChecked: this.currentStateIndex,
      isRouteFound: this.routeFound,
      isAllStatesChecked: this.allStatesChecked,
      isAborted: this.aborted,
      route: this.foundRoute,
      robotsUsed: this.robotsUsed,
      minMoves: this.minMoves,
      timers: Timer.getTotals()
    }
  }

  public onComplete(callback: (result: ICompletedData) => void) {
    this.completeCallback = callback
  }

  public onProgress(callback: (data: IProgressData) => void, sendProgressEvery = 1000) {
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

    this.processState(state)
    this.currentStateIndex++
  }

  private checkIfShortestRouteFound(state: IState): void {
    if(state.robotIdx !== this.goal.robotIdx) return
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

  private isAtGoal(mainRobot: ISolverRobot) {
    return mainRobot.posNum === this.goalTile
  }

  private isAtHome(mainRobot: ISolverRobot) {
    return mainRobot.posNum === this.mainHomeTile
  }

  private shortestRouteFound(endState: IState) {
    this.routeFound = true
    this.running = false
    let state = endState
    this.foundRoute = []
    
    const uniqueRobots = new Set<number>()
    while(state.previous) {
      this.foundRoute.unshift({robotIdx: state.robotIdx, direction: state.direction})
      uniqueRobots.add(state.robotIdx)
      const nextState = this.states.get(state.previous)
      if(nextState === undefined) throw Error(`state ${state.previous} not found`)
      state = nextState
    }

    this.robotsUsed = [...uniqueRobots].sort()
  }


  private processState (state: IState) {
    const moves: ITestMove[] = []
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
      
      const newState: IState = {
        hash: stateHash,
        previous: state.hash,
        robots: newRobots,
        goalVisited: state.goalVisited,
        moves: state.moves+1,
        direction: move.dir,
        robotIdx: move.robotIdx
      }
      
      this.checkIfShortestRouteFound(newState)
      this.statesQueue.push(newState.hash)
      this.states.set(newState.hash, newState)
    }
    state.robots.length = 0
    state.robots = undefined
    state.hash = undefined
    state.goalVisited = undefined
    state.moves = undefined
  }
}
