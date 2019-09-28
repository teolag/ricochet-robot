import { Solver, CompletedData, ProgressData } from "./Solver";
import { SolverWorkerMessage } from "./models/SolverWokerMessages";

declare function postMessage(message: any): void;
self.onmessage = processIncomingMessage





function processIncomingMessage(e: MessageEvent) {
  switch(e.data.type) {
    case SolverWorkerMessage.SOLVE: {
      const {board, robots, goal} = e.data.level
      const solver = new Solver(board, robots, goal)
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