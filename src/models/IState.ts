import { Direction } from "../enums/Direction";
import { ISolverRobot } from "./ISolverRobot";

export interface IState {
  goalVisited: boolean
  moves: number
  previous?: string
  hash: string
  robots: ISolverRobot[]
  direction: Direction
  robotIdx: number
}
