import { Wall } from './Board.js';
import { cloneRobots } from './Robot.js';
const MAX_CHECKED = 100000;
const notNull = (value) => value !== null;
export class Solver {
    constructor(board, robots, goal) {
        this.checkedStates = new Map();
        this.statesUnchecked = new Set();
        this.uncheckedStates = [];
        this.completed = false;
        this.running = false;
        this.foundRoute = [];
        this.message = '';
        this.duration = 0;
        this.tile = (pos) => pos.x + pos.y * this.board.w;
        this.getState = (robots) => robots.map(r => this.tile(r)).join('|');
        this.board = board;
        this.robots = robots;
        this.goal = goal;
        this.goalTile = this.tile(this.goal);
    }
    solve() {
        const startState = this.getState(this.robots);
        this.uncheckedStates = [{ previous: '', color: 0, dir: '', state: startState, robots: cloneRobots(this.robots) }];
        this.statesUnchecked = new Set(startState);
        const start = new Date();
        this.running = true;
        while (this.running) {
            this.checkNext();
        }
        this.duration = (new Date().getTime() - start.getTime()) / 1000;
        if (this.completeCallback) {
            this.completeCallback(this.getResult());
        }
    }
    isCompleted() {
        return this.isCompleted;
    }
    getResult() {
        return {
            duration: this.duration,
            statesChecked: this.checkedStates.size,
            completed: this.completed,
            running: this.running,
            route: this.foundRoute,
            message: this.message
        };
    }
    onComplete(callback) {
        this.completeCallback = callback;
    }
    checkNext() {
        const currentState = this.uncheckedStates.shift();
        if (currentState === undefined) {
            this.message = `No more moves to check... I guess this level is impossible`;
            this.running = false;
            return;
        }
        const { state, robots, previous } = currentState;
        //console.log("Checking", state, robots[currentState.color].getPos())
        this.statesUnchecked.delete(state);
        if (this.isGoalReached(robots)) {
            this.goalReached(currentState, previous);
            return;
        }
        robots.forEach((robot, i) => {
            const newStates = this.getNewStates(robots, i)
                .filter(s => !this.checkedStates.has(s.state))
                .filter(s => !this.statesUnchecked.has(s.state))
                .map(s => (Object.assign(Object.assign({}, s), { previous: state })));
            if (newStates.length) {
                //console.log("add", i, newStates.map(s => s.robots[i].x + ',' + s.robots[i].y).join('  '))
                this.uncheckedStates.push(...newStates);
                newStates.forEach(s => this.statesUnchecked.add(s.state));
            }
        });
        this.checkedStates.set(state, currentState);
        if (this.checkedStates.size === MAX_CHECKED) {
            this.message = `Checked ${MAX_CHECKED} states. Abort!`;
            this.running = false;
            return;
        }
    }
    isGoalReached(robots) {
        return this.tile(robots[this.goal.color]) === this.goalTile;
    }
    goalReached(thisState, previous) {
        this.completed = true;
        this.running = false;
        let state = thisState;
        while (state.previous) {
            this.foundRoute.unshift(state);
            const nextState = this.checkedStates.get(state.previous);
            if (nextState === undefined)
                throw Error(`state ${previous} not found`);
            state = nextState;
        }
        this.message = `Level solved in ${this.foundRoute.length} moves`;
    }
    getNewStates(robots, robotIndex) {
        const robot = robots[robotIndex];
        const otherRobots = robots.filter(r => r.color !== robotIndex);
        return [
            Solver.goNorth(this.board, robot, otherRobots),
            Solver.goSouth(this.board, robot, otherRobots),
            Solver.goWest(this.board, robot, otherRobots),
            Solver.goEast(this.board, robot, otherRobots)
        ].filter(notNull).map(move => {
            const newRobots = cloneRobots(robots);
            newRobots[robotIndex].setPos(move.pos);
            const state = this.getState(newRobots);
            return { state, robots: newRobots, dir: move.dir, color: robotIndex };
        });
    }
    static goNorth(board, robot, otherRobots) {
        const pos = robot.getPos();
        const closestRobotY = Math.max(...otherRobots.filter(r => r.x === pos.x && r.y < pos.y).map(r => r.y));
        for (; pos.y > 0; pos.y--) {
            if (pos.y - 1 === closestRobotY || board.hasWall(pos.x, pos.y, Wall.NORTH))
                break;
        }
        if (pos.y === robot.y)
            return null;
        return { pos, dir: 'upp' };
    }
    static goSouth(board, robot, otherRobots) {
        const pos = robot.getPos();
        const closestRobotY = Math.min(...otherRobots.filter(r => r.x === robot.x && r.y > pos.y).map(r => r.y));
        for (; pos.y < board.h; pos.y++) {
            if (pos.y + 1 === closestRobotY || board.hasWall(robot.x, pos.y, Wall.SOUTH))
                break;
        }
        if (pos.y === robot.y)
            return null;
        return { pos, dir: 'ner' };
    }
    static goWest(board, robot, otherRobots) {
        const pos = robot.getPos();
        const closestRobotX = Math.max(...otherRobots.filter(r => r.y === pos.y && r.x < pos.x).map(r => r.x));
        for (; pos.x > 0; pos.x--) {
            if (pos.x - 1 === closestRobotX || board.hasWall(pos.x, pos.y, Wall.WEST))
                break;
        }
        if (pos.x === robot.x)
            return null;
        return { pos, dir: 'vänster' };
    }
    static goEast(board, robot, otherRobots) {
        const pos = robot.getPos();
        const closestRobotX = Math.min(...otherRobots.filter(r => r.y === pos.y && r.x > pos.x).map(r => r.x));
        for (; pos.x < board.w; pos.x++) {
            if (pos.x + 1 === closestRobotX || board.hasWall(pos.x, pos.y, Wall.EAST))
                break;
        }
        if (pos.x === robot.x)
            return null;
        return { pos, dir: 'höger' };
    }
}
/*
const boardElem = document.querySelector('.board table')
if(!boardElem) throw Error("could not find board")
newPositions.forEach(pos => {
  boardElem.innerHTML += `<div class='dot' style='left:${pos.x*41+20}px;top:${pos.y*41+20}px'></div>`
})
console.log("new", newPositions)
*/
