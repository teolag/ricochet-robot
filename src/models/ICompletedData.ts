import { IState } from "./IState";

export interface ICompletedData {
  duration: number
  statesChecked: number
  isRouteFound: boolean
  isAllStatesChecked: boolean
  isAborted: boolean
  route: IState[]
  robotsUsed: number[]
  minMoves: number,
  timers: object
}