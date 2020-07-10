import { Direction } from "../enums/Direction";

export interface ITestMove {
  pos: {
    x:number
    y:number
  }
  dir: Direction
  robotIdx: number
}