import {Board, Wall} from './Board.js'
import {Robot, cloneRobots} from './Robot.js'
import {Goal} from './Goal.js'
import {Pos} from './Pos.js'

const MAX_CHECKED = 100000

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
  private message = ''
  private duration = 0

  private tile = (pos: Pos) => pos.x + pos.y * this.board.w
  private getState = (robots: Robot[]) => robots.map(r => this.tile(r)).join('|')

  constructor(board: Board, robots: Robot[], goal: Goal) {
    this.board = board
    this.robots = robots
    this.goal = goal
    this.goalTile = this.tile(this.goal)
  }

  public solve() {
    const startState = this.getState(this.robots)
    this.uncheckedStates = [{previous: '', color:0, dir:'', state: startState, robots: cloneRobots(this.robots)}]
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
      Solver.goNorth(this.board, robot, otherRobots),
      Solver.goSouth(this.board, robot, otherRobots),
      Solver.goWest(this.board, robot, otherRobots),
      Solver.goEast(this.board, robot, otherRobots)
    ].filter(notNull).map(move => {
      const newRobots = cloneRobots(robots)
      newRobots[robotIndex].setPos(move.pos)
      const state = this.getState(newRobots)
      return {state, robots: newRobots, dir: move.dir, color: robotIndex}
    })
  }

  public static goNorth (board: Board, robot: Robot, otherRobots: Robot[]) {
    const pos = robot.getPos()
    const closestRobotY = Math.max(...otherRobots.filter(r => r.x === pos.x && r.y < pos.y).map(r => r.y))
    for(; pos.y > 0; pos.y--) {
      if(pos.y-1 === closestRobotY || board.hasWall(pos.x, pos.y, Wall.NORTH)) break
    }
    if(pos.y === robot.y) return null
    return {pos, dir: 'upp'}
  }

  public static goSouth (board: Board, robot: Robot, otherRobots: Robot[]) {
    const pos = robot.getPos()
    const closestRobotY = Math.min(...otherRobots.filter(r => r.x === robot.x && r.y > pos.y).map(r => r.y))
    for(; pos.y < board.h; pos.y++) {
      if(pos.y+1 === closestRobotY || board.hasWall(robot.x, pos.y, Wall.SOUTH)) break
    }
    if(pos.y===robot.y) return null
    return {pos, dir: 'ner'}
  }

  public static goWest (board: Board, robot: Robot, otherRobots: Robot[]) {
    const pos = robot.getPos()
    const closestRobotX = Math.max(...otherRobots.filter(r => r.y === pos.y && r.x < pos.x).map(r => r.x))
    for(; pos.x > 0; pos.x--) {
      if(pos.x-1 === closestRobotX || board.hasWall(pos.x, pos.y, Wall.WEST)) break
    }
    if(pos.x===robot.x) return null
    return {pos, dir: 'vänster'}
  }

  public static goEast (board: Board, robot: Robot, otherRobots: Robot[]) {
    const pos = robot.getPos()
    const closestRobotX = Math.min(...otherRobots.filter(r => r.y === pos.y && r.x > pos.x).map(r => r.x))
    for(; pos.x < board.w; pos.x++) {
      if(pos.x+1 === closestRobotX || board.hasWall(pos.x, pos.y, Wall.EAST)) break
    }
    if(pos.x===robot.x) return null
    return {pos, dir: 'höger'}
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
   