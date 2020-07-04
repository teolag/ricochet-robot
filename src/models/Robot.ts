import { Pos } from "./Pos"


export class Robot {
  public idx: number
  public x: number
  public y: number

  constructor(idx: number, x: number, y: number) {
    this.idx = idx
    this.x = x
    this.y = y
  }

  getPos() {
    return {x: this.x, y: this.y }
  }

  setPos(pos: Pos) {
    this.x = pos.x
    this.y = pos.y
  } 

  clone() {
    return new Robot(this.idx, this.x, this.y)
  }
}

export function cloneRobots(robots: Robot[]) {
  return robots.map(r => r.clone())
}