import { IMove } from "./IMove";

export interface ICompletedData {
  duration: number
  statesChecked: number
  isRouteFound: boolean
  isAllStatesChecked: boolean
  isAborted: boolean
  route: IMove[]
  robotsUsed: number[]
  minMoves: number,
  timers: object
}