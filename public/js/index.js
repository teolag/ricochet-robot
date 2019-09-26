import { Level } from "./Level.js";
import { Wall } from "./Board.js";
import { Solver } from "./Solver.js";
import * as Slumpa from "./Slumpa.js";
import { cloneRobots } from "./Robot.js";
/*

* There and back again

* show and play solution

* move robots with keyboard
  - wasd of arrow-keys to move
  - 1-x to switch robot

* move robots with touch
  - swipe on robots to move
  - virtual controls with arrows and color buttons to change robot

* solver info
  - service worker
  - status indicator
  - click to show
    - states checked
    - best route
    - solve duration
  - inform user if a level is impossible / too hard?

* Defined levels in different difficulty groups Easy/Medium/Hard

* Collect stars.
  1 star complete the level  >125%
  2 stars complete within 5 moves or %? 100-125%
  3 stars complete with best route 100%

* Save progress in local storage

*/
function newSeed() {
    const newSeed = Math.floor(Math.random() * 1000000);
    location.hash = newSeed.toString();
    Slumpa.setSeed(newSeed);
}
const seed = parseInt(location.hash.substr(1));
if (seed) {
    Slumpa.setSeed(seed);
}
else {
    newSeed();
}
const movesCounter = document.getElementById('movesCounter');
if (!movesCounter)
    throw Error("moves counter not found");
let moves = 0;
const setMoveCounter = (value) => {
    moves = value;
    movesCounter.innerText = value.toString();
};
const boardElem = document.querySelector('.board');
const btnReset = document.getElementById('btnReset');
const btnRestart = document.getElementById('btnRestart');
if (!btnRestart)
    throw Error("restartbutton not found");
btnRestart.addEventListener('click', () => {
    newSeed();
    restart();
});
restart();
function restart() {
    if (!boardElem)
        throw Error("could not find board");
    const level = new Level(10, 10, 4);
    const robots = cloneRobots(level.robots);
    const html = createHTMLBoard(level);
    let activeRobotIndex = 0;
    let selectedRobot;
    let otherRobots;
    boardElem.innerHTML = html;
    const robotElems = robots.map(r => {
        const elem = document.createElement('div');
        moveRobot(elem, r.getPos());
        elem.classList.add('robot', 'robot-' + r.color);
        elem.innerText = (r.color + 1).toString();
        return elem;
    });
    robotElems.forEach(robotElem => {
        boardElem.appendChild(robotElem);
    });
    reset();
    switchRobot(0);
    document.body.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
                moveActiveRobot(Solver.goNorth);
                break;
            case 'ArrowDown':
                moveActiveRobot(Solver.goSouth);
                break;
            case 'ArrowLeft':
                moveActiveRobot(Solver.goWest);
                break;
            case 'ArrowRight':
                moveActiveRobot(Solver.goEast);
                break;
            case '1':
                switchRobot(0);
                break;
            case '2':
                switchRobot(1);
                break;
            case '3':
                switchRobot(2);
                break;
            case '4':
                switchRobot(3);
                break;
        }
    });
    if (!btnReset)
        throw Error("reset button not found");
    btnReset.addEventListener('click', reset);
    function reset() {
        setMoveCounter(0);
        switchRobot(0);
        level.robots.forEach((robot, i) => {
            robots[i].setPos(robot.getPos());
            moveRobot(robotElems[i], robot.getPos());
        });
    }
    function moveActiveRobot(moveFunction) {
        const newPos = moveFunction(level.board, selectedRobot, otherRobots);
        if (!newPos)
            return;
        moveRobot(robotElems[activeRobotIndex], newPos.pos);
        selectedRobot.setPos(newPos.pos);
        setMoveCounter(moves + 1);
        if (goalIsReached()) {
            const result = solver.getResult();
            const score = calculateScore(moves, result.route.length);
            setTimeout(() => {
                alert("tjohooo!! Score: " + '⭐'.repeat(score));
            }, 400);
        }
    }
    function moveRobot(robot, newPos) {
        robot.style.transform = `translate(${newPos.x * 41 + 13}px, ${newPos.y * 41 + 13}px)`;
    }
    function goalIsReached() {
        const correctRobot = robots[level.goal.color];
        return correctRobot.x === level.goal.x && correctRobot.y === level.goal.y;
    }
    function switchRobot(index) {
        if (index > robots.length)
            return;
        activeRobotIndex = index;
        selectedRobot = robots[index];
        otherRobots = robots.filter(r => r.color !== index);
        robotElems.forEach((r, i) => {
            r.classList.toggle('active', i === index);
        });
    }
    const solver = new Solver(level.board, robots, level.goal);
    solver.onComplete(result => {
        console.log("onComplete", result);
    });
    solver.solve();
}
function createHTMLBoard(level) {
    return "<table><tr>" + level.board.tiles.map((row, y) => row.map((walls, x) => {
        let text = '';
        const classes = [];
        if (walls & Wall.NORTH)
            classes.push('wall-north');
        if (walls & Wall.EAST)
            classes.push('wall-east');
        if (walls & Wall.WEST)
            classes.push('wall-west');
        if (walls & Wall.SOUTH)
            classes.push('wall-south');
        if (level.goal.x === x && level.goal.y === y) {
            text = `<div class="goal goal-${level.goal.color}"></div>`;
        }
        level.robots.forEach(robot => {
            if (robot.x === x && robot.y === y) {
                text = `<div class="start start-${robot.color}"></div>`;
            }
        });
        return `<td class='${classes.join(' ')}'>${text}</td>`;
    }).join('')).join('</tr><tr>') + '</tr></table>';
}
function calculateScore(moves, optimalMoves) {
    if (moves === optimalMoves)
        return 3;
    if (moves < optimalMoves * 1.3)
        return 2;
    return 1;
}
