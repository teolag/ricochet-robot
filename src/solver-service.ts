import {SolverWorkerMessage} from './models/SolverWokerMessages'
import { CompletedData, ProgressData } from './Solver';
import { Level } from './models/Level';
import { getElementById } from './utils';

let solverWorker: Worker
let result: CompletedData|null
let progress: ProgressData|null

const solverButton = getElementById('solverButton')
const solverOKButton = getElementById('solverOKButton')
const solverInfo = getElementById('solverInfo')
const dialog = getElementById('solverDialog') as HTMLDialogElement
const setButtonText = (text: string) => solverButton.innerText = text
solverButton.addEventListener('click', _ => dialog.showModal())
solverOKButton.addEventListener('click', _ => dialog.close())


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
      if(result.completed) {
        setButtonText("!!!")
        solverInfo.innerHTML = `
          En lösning på ${result.route.length} drag hittades!<br>
          ${result.statesChecked} states letades igenom på 
          ${result.duration} sekunder
        `
      } else {
        setButtonText('???')
        solverInfo.innerHTML = `
          Ingen lösning kunde hittas.<br>
          ${result.statesChecked} states letades igenom på 
          ${result.duration} sekunder
        `
      }
      
      break;
    }
    case SolverWorkerMessage.SOLVE_PROGRESS: {
      progress = e.data.progress as ProgressData
      setButtonText('...')
      solverInfo.innerHTML = `
        ${progress.checkedStates} states undersökta<br>
        Letar nu efter lösningar med ${progress.currentMovesCount} drag
      `
      break;
    }
    default: {
      throw Error("Unknown message from web worker: " + e.data.type)
    }
  }
}
  
