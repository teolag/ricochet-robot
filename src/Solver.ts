import {Board} from './models/Board'
import {Goal} from './models/Goal'
import {Pos} from './models/Pos'
import { goNorth, goSouth, goWest, goEast } from './solver-utils'

const MAX_CHECKED = 200000

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
  dir: string
  color: number
}

export interface CompletedData {
  duration: number
  statesChecked: number
  completed: boolean
  running: boolean
  route: State[]
  message: string
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
  private completed = false
  private running = false
  private foundRoute: State[] = []
  private completeCallback: Function|undefined
  private progressCallback: Function|undefined
  private message = ''
  private duration = 0
  private backAgain: boolean

  private tile = (pos: Pos) => pos.x + pos.y * this.board.w
  private getState = (robots: Robot[], goalVisited: boolean) => robots.map(r => this.tile(r)).join('|') + goalVisited

  constructor(board: Board, robots: Robot[], goal: Goal, backAgain = false) {
    this.board = board
    this.robots = robots
    this.goal = goal
    this.goalTile = this.tile(this.goal)
    this.homeTile = this.tile(this.robots[this.goal.color])
    this.backAgain = backAgain
  }

  public solve() {
    const startState = this.getState(this.robots, false)
    this.uncheckedStates = [{moves: 0, previous: '', color:0, dir:'', state: startState, robots: this.robots.slice(), goalVisited: false}]
    this.statesUnchecked = new Set(startState)
    const start = new Date()

    this.running = true
    while(this.running) {
      this.checkNext()
    }
    this.duration = (new Date().getTime() - start.getTime()) / 1000
    if(this.completeCallback) {
      this.completeCallback(this.getResult())
    }
    this.statesUnchecked.clear()
    this.uncheckedStates.length = 0
    this.checkedStates.clear()
  }

  public isCompleted() {
    return this.isCompleted
  }

  public getResult(): CompletedData {
    return {
      duration: this.duration,
      statesChecked: this.checkedStates.size,
      completed: this.completed,
      running: this.running,
      route: this.foundRoute,
      message: this.message
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
        this.message = `No more moves to check... I guess this level is impossible`
        this.running = false
        return
      }

      if(this.progressCallback && (this.checkedStates.size % 100 === 0)) {
        this.progressCallback({checkedStates: this.checkedStates.size, currentMovesCount: currentState.moves})
      }

      const {state, robots, previous, moves} = currentState
      //console.log("Checking", state, robots[currentState.color].getPos())
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
      
      robots.forEach((robot, i) => {
        const newStates = this.getNewStates(robots, i, goalVisited)
        .filter(s => !this.checkedStates.has(s.state))
        .filter(s => !this.statesUnchecked.has(s.state))
        .map(s => ({...s, previous: state, moves: moves+1}))
        if(newStates.length) {
          //console.log("add", i, newStates.map(s => s.robots[i].x + ',' + s.robots[i].y).join('  '))
          this.uncheckedStates.push(...newStates)
          newStates.forEach(s => this.statesUnchecked.add(s.state))
        }
      })
      
      this.checkedStates.set(state, currentState)

      if(this.checkedStates.size === MAX_CHECKED) {
        this.message = `Checked ${MAX_CHECKED} states. Abort!`
        this.running = false
        return
      }
  }

  private isGoalReached(robots: Robot[]) {
    return this.tile(robots[this.goal.color]) === this.goalTile
  }

  private isBackAgain(robots: Robot[]) {
    return this.tile(robots[this.goal.color]) === this.homeTile
  }

  private goalReached(thisState: State, previous: string) {
    this.completed = true
    this.running = false
    let state = thisState
    
    while(state.previous) {
      this.foundRoute.unshift(state)
      const nextState = this.checkedStates.get(state.previous)
      if(nextState === undefined) throw Error(`state ${previous} not found`)
      state = nextState
    }

    this.message = `Level solved in ${this.foundRoute.length} moves`
  }


  private getNewStates (robots: Robot[], robotIndex: number, goalVisited: boolean) {
    const robot = robots[robotIndex]
    const otherRobots = robots.filter(r => r.color !== robotIndex)

    return [
      goNorth(this.board, robot, otherRobots),
      goSouth(this.board, robot, otherRobots),
      goWest(this.board, robot, otherRobots),
      goEast(this.board, robot, otherRobots)
    ].filter(notNull).map(move => {
      const newRobots = robots.slice()
      newRobots[robotIndex] = {x: move.pos.x, y: move.pos.y, color: newRobots[robotIndex].color}
      const state = this.getState(newRobots, goalVisited)
      return {state, robots: newRobots, dir: move.dir, color: robotIndex, goalVisited}
    })
  }

  

}
















    /*
    const boardElem = document.querySelector('.board table')
    if(!boardElem) throw Error("could not find board")
    newPositions.forEach(pos => {
      boardElem.innerHTML += `<div class='dot' style='left:${pos.x*41+20}px;top:${pos.y*41+20}px'></div>`
    })
    console.log("new", newPositions)
    */
   