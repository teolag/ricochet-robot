import { Solver, CompletedData, ProgressData } from "./Solver";
import { SolverWorkerMessage } from "./models/SolverWokerMessages";
import { Level } from "./models/Level";

declare function postMessage(message: any): void;
self.onmessage = processIncomingMessage





function processIncomingMessage(e: MessageEvent) {
  switch(e.data.type) {
    case SolverWorkerMessage.SOLVE: {
      const level = new Level(e.data.levelString)
      const solver = new Solver(level, {backAgain: e.data.backAgain})
      solver.onComplete(onComplete)
      solver.onProgress(onProgress)
      solver.solve()
      break;
    }
    default: {
      throw Error("Worker recieved an unknown message" + e.data.type)
    }
  }
}


function onComplete(result: CompletedData) {
  postMessage({type: SolverWorkerMessage.SOLVE_END, result})
  close()
}

function onProgress(progress: ProgressData) {
  postMessage({type: SolverWorkerMessage.SOLVE_PROGRESS, progress})
}