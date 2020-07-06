export class Goal {
  public x: number
  public y: number
  public robotIdx: number

  constructor(x:number, y:number, robotIdx:number) {
    this.x = x
    this.y = y
    this.robotIdx = robotIdx
  }
}