import { Solver, CompletedData, ProgressData } from "./Solver";
import { SolverWorkerMessage } from "./models/SolverWokerMessages";
import { Level } from "./models/Level";

declare function postMessage(message: any): void;
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


function onComplete(result: CompletedData) {
  postMessage({type: SolverWorkerMessage.SOLVE_END, result})
  close()
}

function onProgress(progress: ProgressData) {
  postMessage({type: SolverWorkerMessage.SOLVE_PROGRESS, progress})
}