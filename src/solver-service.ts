import { SolverWorkerMessage } from './enums/SolverWokerMessages';
import { Level } from './models/Level';
import * as Game from './game';
import { getElementById, getButton } from './utils';
import { ICompletedData } from './models/ICompletedData';
import { IProgressData } from './models/IProgressData';
const colorNames = ['röd', 'grön', 'blå', 'gul'];

let solverWorker: Worker;
let result: ICompletedData | null;
let progress: IProgressData | null;

const solverButton = getButton('btnSolver');
const solverInfo = getElementById('solverInfo');
const dialog = getElementById<HTMLDialogElement>('solverDialog');
const setSolverButtonIcon = (icon: string) =>
  solverButton.children[0].children[0].setAttribute(
    'xlink:href',
    `icons.svg#icon-${icon}`
  );
solverButton.addEventListener('click', _ => dialog['showModal']());
const showSolutionButton = getButton('btnShowSolution');
const abortSolverButton = getButton('btnAbortSolver');
const closeSolverButton = getButton('btnCloseSolver');
showSolutionButton.addEventListener('click', showSolution);
abortSolverButton.addEventListener('click', abortSolver);
closeSolverButton.addEventListener('click', closeSolverDialog);

function showSolution() {
  dialog['close']();
  Game.showSolution();
}

function closeSolverDialog() {
  dialog['close']();
}

function abortSolver() {
  solverWorker.terminate();
  abortSolverButton.hidden = true;
  solverInfo.innerHTML = `
    Solver aborted. ${progress.checkedStates} states undersökta<br>
    Lösningen har minst ${progress.currentMovesCount} drag.
  `;
  solverButton.classList.remove('rotate');
  setSolverButtonIcon('info');
}

export function solve(level: Level, backAgain = false) {
  if (solverWorker) {
    solverWorker.terminate();
  }
  result = null;
  setSolverButtonIcon('spinner');
  solverButton.classList.add('rotate');
  showSolutionButton.hidden = true;
  abortSolverButton.removeAttribute('hidden');
  solverWorker = new Worker('js/solver-worker.js');
  solverWorker.onmessage = onWorkerMessage;
  solverWorker.postMessage({
    type: SolverWorkerMessage.SOLVE,
    levelString: level.getLevelString(),
    backAgain
  });
}

export function getResult() {
  return result;
}

function onWorkerMessage(e: MessageEvent) {
  switch (e.data.type) {
    case SolverWorkerMessage.SOLVE_END: {
      result = e.data.result as ICompletedData;
      solverButton.classList.remove('rotate');
      abortSolverButton.hidden = true;

      if (result.isRouteFound) {
        setSolverButtonIcon('check');
        const usedRobots = result.robotsUsed.map(r => colorNames[r]).join(', ');
        solverInfo.innerHTML = `
          En lösning på ${result.route.length} drag hittades!<br>
          Använde robotarna: ${usedRobots}<br>
          ${result.statesChecked} states letades igenom på 
          ${result.duration} sekunder
        `;
        showSolutionButton.hidden = false;
      } else if (result.isAllStatesChecked) {
        setSolverButtonIcon('impossible');
        solverInfo.innerHTML = `
          Ingen lösning kunde hittas. Omöjlig!<br>
          ${result.statesChecked} states letades igenom på 
          ${result.duration} sekunder
        `;
      } else {
        setSolverButtonIcon('info');
        solverInfo.innerHTML = `
          Orkade inte leta klar.<br>
          ${result.statesChecked} states letades igenom på 
          ${result.duration} sekunder. Om en lösning finns är den på minst ${result.minMoves}
        `;
      }
      break;
    }
    case SolverWorkerMessage.SOLVE_PROGRESS: {
      progress = e.data.progress as IProgressData;
      solverInfo.innerHTML = `
        ${progress.checkedStates} states undersökta<br>
        Letar nu efter lösningar med ${progress.currentMovesCount} drag
      `;
      break;
    }
    default: {
      throw Error('Unknown message from web worker: ' + e.data.type);
    }
  }
}
