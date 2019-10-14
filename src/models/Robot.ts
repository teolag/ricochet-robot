import { Pos } from "./Pos"


export class Robot {
  private id: number
  public color: number
  public x: number
  public y: number

  constructor(id: number, x: number, y: number) {
    this.id = id
    this.color = id
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
    return new Robot(this.id, this.x, this.y)
  }
}

export function cloneRobots(robots: Robot[]) {
  return robots.map(r => r.clone())
}