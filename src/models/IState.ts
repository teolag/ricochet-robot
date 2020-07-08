import { Direction } from "../enums/Direction";
import { IPos } from "./IPos";
import { ISolverRobot } from "./ISolverRobot";

export interface IState {
  goalVisited: boolean
  moves: number
  previous?: string
  hash: string
  robots: ISolverRobot[]
  lastMove: {
    direction: Direction
    robotIdx: number
    from: IPos
    to: IPos
  }
}
