import {SolverWorkerMessage} from './models/SolverWokerMessages'
import { CompletedData, ProgressData } from './Solver';
import { Level } from './models/Level';
import { getElementById } from './utils';

let solverWorker: Worker
let result: CompletedData|null
let progress: ProgressData|null

const solverButton = getElementById('solverButton')
const solverInfo = getElementById('solverInfo')
const dialog = getElementById('solverDialog') as HTMLDialogElement
const setSolverButtonIcon = (icon: string) => solverButton.children[0].children[0].setAttribute('xlink:href', `icons.svg#icon-${icon}`)
solverButton.addEventListener('click', _ => dialog.showModal())
const showSolutionButton = getElementById('showSolutionButton')
showSolutionButton.addEventListener('click', _ => dialog.close())


export function solve(level: Level, backAgain = false) {
  if(solverWorker) {
    solverWorker.terminate()
  }
  result = null
  solverButton.classList.add("rotate")
  showSolutionButton.hidden = true
  solverWorker = new Worker('js/solver-worker.js');
  solverWorker.onmessage = onWorkerMessage
  solverWorker.postMessage({type: SolverWorkerMessage.SOLVE, levelString: level.getLevelString(), backAgain});
}

export function getResult() {
  return result
}


function onWorkerMessage(e: MessageEvent) {
  switch(e.data.type) {
    case SolverWorkerMessage.SOLVE_END: {
      result = e.data.result as CompletedData
      solverButton.classList.remove("rotate")
      
      if(result.isRouteFound) {
        //setButtonText("!!!")
        setSolverButtonIcon('check')
        solverInfo.innerHTML = `
          En lösning på ${result.route.length} drag hittades!<br>
          ${result.statesChecked} states letades igenom på 
          ${result.duration} sekunder
        `
        showSolutionButton.hidden = false
      } else if (result.isAllStatesChecked) {
        //setButtonText('X')
        solverInfo.innerHTML = `
          Ingen lösning kunde hittas. Omöjlig!<br>
          ${result.statesChecked} states letades igenom på 
          ${result.duration} sekunder
        `
      }
      else {
        //setButtonText('???')
        solverInfo.innerHTML = `
          Orkade inte leta klar.<br>
          ${result.statesChecked} states letades igenom på 
          ${result.duration} sekunder
        `
      }
      break;
    }
    case SolverWorkerMessage.SOLVE_PROGRESS: {
      progress = e.data.progress as ProgressData
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
  
