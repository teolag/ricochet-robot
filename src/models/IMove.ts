import { Direction } from "../enums/Direction";

export interface IMove {
  pos: {
    x:number
    y:number
  }
  dir: Direction
  robotIdx: number
}