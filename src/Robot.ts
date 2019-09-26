import { Pos } from "./Pos"

export type RobotIds = 1 | 2 | 3 | 4 | 5

export class Robot {
  private id: RobotIds
  public color: number
  public x: number
  public y: number

  constructor(id: RobotIds, x: number, y: number) {
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