import {Board} from './models/Board'
import {Goal} from './models/Goal'
import {Pos} from './models/Pos'
import { goNorth, goSouth, goWest, goEast } from './solver-utils'
import { Level } from './models/Level'

const MAX_CHECKED = 200000

interface Robot {
  x: number
  y: number
  color: number
}

const notNull = <T>(value: T | null): value is T => value !== null
interface State {
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
}

export class Solver {
  private readonly board: Board
  private readonly robots: Robot[]
  private readonly goal: Goal
  private readonly goalTile: number
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

  private tile = (pos: Pos) => pos.x + pos.y * this.board.w
  private getState = (robots: Robot[]) => robots.map(r => this.tile(r)).join('|')

  constructor(board: Board, robots: Robot[], goal: Goal) {
    this.board = board
    this.robots = robots
    this.goal = goal
    console.log("GOAL", goal)
    this.goalTile = this.tile(this.goal)
  }

  public solve() {
    const startState = this.getState(this.robots)
    this.uncheckedStates = [{previous: '', color:0, dir:'', state: startState, robots: this.robots.slice()}]
    this.statesUnchecked = new Set(startState)
    const start = new Date()

    this.running = true
    while(this.running) {
      if(this.progressCallback && (this.checkedStates.size % 100 === 0)) {
        this.progressCallback({checkedStates: this.checkedStates.size})
      }
      this.checkNext()
    }
    this.duration = (new Date().getTime() - start.getTime()) / 1000
    if(this.completeCallback) {
      this.completeCallback(this.getResult())
    }
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
      const {state, robots, previous} = currentState
      //console.log("Checking", state, robots[currentState.color].getPos())
      this.statesUnchecked.delete(state)
  
      if(this.isGoalReached(robots)) {
        this.goalReached(currentState, previous)
        return
      }
      
      robots.forEach((robot, i) => {
        const newStates = this.getNewStates(robots, i)
        .filter(s => !this.checkedStates.has(s.state))
        .filter(s => !this.statesUnchecked.has(s.state))
        .map(s => ({...s, previous: state}))
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


  private getNewStates (robots: Robot[], robotIndex: number) {
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
      const state = this.getState(newRobots)
      return {state, robots: newRobots, dir: move.dir, color: robotIndex}
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
   