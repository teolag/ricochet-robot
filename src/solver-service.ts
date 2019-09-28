import {SolverWorkerMessage} from './models/SolverWokerMessages'
import { CompletedData, ProgressData } from './Solver';
import { Level } from './models/Level';
let solverWorker: Worker
let result: CompletedData|null
let progress: ProgressData|null

const elem = document.getElementById('solverStatus')
if(!elem) throw Error("Could not find solver status element")
const setText = (text: string) => elem.innerText = text


export function solve(level: Level) {
  if(solverWorker) {
    solverWorker.terminate()
  }
  result = null
  solverWorker = new Worker('js/solver-worker.js');
  solverWorker.onmessage = onWorkerMessage
  solverWorker.postMessage({type: SolverWorkerMessage.SOLVE, level});
}

export function getResult() {
  return result
}


function onWorkerMessage(e: MessageEvent) {
  switch(e.data.type) {
    case SolverWorkerMessage.SOLVE_END: {
      result = e.data.result as CompletedData
      console.log("SOLVE DONE", e.data.result)
      if(result.completed) {
        setText("Klar!")
      } else {
        setText('Hittade ingen')
      }
      break;
    }
    case SolverWorkerMessage.SOLVE_PROGRESS: {
      progress = e.data.progress as ProgressData
      setText('Checked ' + progress.checkedStates)
      break;
    }
    default: {
      throw Error("Unknown message from web worker: " + e.data.type)
    }
  }
}
  
