import { Solver } from "./models/Solver";
import { SolverWorkerMessage } from "./enums/SolverWokerMessages";
import { Level } from "./models/Level";
import { ICompletedData } from "./models/ICompletedData";
import { IProgressData } from "./models/IProgressData";

self.onmessage = processIncomingMessage

function processIncomingMessage(event: MessageEvent) {
  switch(event.data.type) {
    case SolverWorkerMessage.SOLVE: {
      const level = new Level(event.data.levelString)
      const solver = new Solver(level, {backAgain: event.data.backAgain})
      solver.onComplete(onComplete)
      solver.onProgress(onProgress)
      solver.solve()
      break;
    }
    default: {
      throw Error("Worker recieved an unknown message" + event.data.type)
    }
  }
}

function onComplete(result: ICompletedData) {
  postMessage({type: SolverWorkerMessage.SOLVE_END, result})
  close()
}

function onProgress(progress: IProgressData) {
  postMessage({type: SolverWorkerMessage.SOLVE_PROGRESS, progress})
}