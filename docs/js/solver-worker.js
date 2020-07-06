/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/solver-worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Solver.ts":
/*!***********************!*\
  !*** ./src/Solver.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.Solver = void 0;\nconst solver_utils_1 = __webpack_require__(/*! ./solver-utils */ \"./src/solver-utils.ts\");\nconst Timer_1 = __webpack_require__(/*! ./libs/Timer */ \"./src/libs/Timer.ts\");\nconst STATE_DELIMITER = '|';\nconst notNull = (value) => value !== null;\nclass Solver {\n    constructor(level, options = {}) {\n        this.currentStateIndex = 0;\n        this.statesQueue = [];\n        this.states = new Map();\n        this.routeFound = false;\n        this.aborted = false;\n        this.allStatesChecked = false;\n        this.running = false;\n        this.progressRatio = 1000;\n        this.duration = 0;\n        this.pos2num = (pos) => pos.x + pos.y * this.board.w;\n        this.getState = (robots, goalVisited) => {\n            const mainRobot = this.pos2num(robots[0]);\n            const helpers = robots.slice(1).map(r => this.pos2num(r)).sort().join(STATE_DELIMITER);\n            const hash = mainRobot + (goalVisited ? 'Y' : 'N') + helpers;\n            return hash;\n        };\n        const { backAgain = false, abortAfter = 500000 } = options;\n        this.board = level.board;\n        this.robots = level.robots;\n        this.goal = level.goal;\n        this.goalTile = this.pos2num(this.goal);\n        this.mainHomeTile = this.pos2num(this.robots[this.goal.robotIdx]);\n        this.backAgain = backAgain;\n        this.abortAfter = abortAfter;\n    }\n    solve() {\n        const startState = this.getState(this.robots, false);\n        this.statesQueue.push(startState);\n        this.states.set(startState, { moves: 0, state: startState, lastMoveDirection: null, lastMoveRobotIdx: null, robots: this.robots.slice(), goalVisited: false });\n        const start = new Date();\n        this.running = true;\n        while (this.running) {\n            Timer_1.default.time('check-next', () => this.checkNext());\n        }\n        this.duration = (new Date().getTime() - start.getTime()) / 1000;\n        const result = this.getResult();\n        if (this.completeCallback) {\n            this.completeCallback(result);\n        }\n        this.statesQueue.length = 0;\n        this.states.clear();\n        return result;\n    }\n    isRouteFound() {\n        return this.routeFound;\n    }\n    getResult() {\n        return {\n            duration: this.duration,\n            statesChecked: this.currentStateIndex,\n            isRouteFound: this.routeFound,\n            isAllStatesChecked: this.allStatesChecked,\n            isAborted: this.aborted,\n            route: this.foundRoute,\n            robotsUsed: getUsedRobots(this.foundRoute),\n            minMoves: this.minMoves,\n            timers: Timer_1.default.getTotals()\n        };\n    }\n    onComplete(callback) {\n        this.completeCallback = callback;\n    }\n    onProgress(callback, sendProgressEvery = 1000) {\n        this.progressRatio = sendProgressEvery;\n        this.progressCallback = callback;\n    }\n    checkNext() {\n        const nextStateHash = Timer_1.default.time('get-next-state-hash', () => this.statesQueue[this.currentStateIndex]);\n        if (nextStateHash === undefined) {\n            this.allStatesChecked = true;\n            this.running = false;\n            return;\n        }\n        const state = Timer_1.default.time('get-next-state', () => this.states.get(nextStateHash));\n        if (this.currentStateIndex === this.abortAfter) {\n            this.minMoves = state.moves;\n            this.aborted = true;\n            this.running = false;\n            return;\n        }\n        if (this.progressCallback && (this.currentStateIndex % this.progressRatio === 0)) {\n            this.progressCallback({ checkedStates: this.currentStateIndex, currentMovesCount: state.moves, timers: Timer_1.default.getAndClear() });\n        }\n        // console.debug(\"Checking\", state, robots[nextStateHash.color], nextStateHash.dir, nextStateHash.previous)\n        state.robots.forEach((_, idx) => {\n            Timer_1.default.time('get-new-states', () => this.getNewStates(state, idx))\n                .filter(newState => Timer_1.default.time('has-state', () => !this.states.has(newState.state)))\n                .forEach(newState => {\n                Timer_1.default.time('check-win', () => this.checkIfShortestRouteFound(newState));\n                Timer_1.default.time('add-states', () => {\n                    this.statesQueue.push(newState.state);\n                    this.states.set(newState.state, newState);\n                });\n            });\n        });\n        this.currentStateIndex++;\n    }\n    checkIfShortestRouteFound(state) {\n        if (state.lastMoveRobotIdx !== this.goal.robotIdx)\n            return;\n        const goalRobot = state.robots[this.goal.robotIdx];\n        if (this.isAtGoal(goalRobot)) {\n            if (!this.backAgain) {\n                this.shortestRouteFound(state);\n            }\n            state.goalVisited = true;\n        }\n        else if (this.backAgain && state.goalVisited && this.isAtHome(goalRobot)) {\n            this.shortestRouteFound(state);\n        }\n    }\n    isAtGoal(mainRobot) {\n        return this.pos2num(mainRobot) === this.goalTile;\n    }\n    isAtHome(mainRobot) {\n        return this.pos2num(mainRobot) === this.mainHomeTile;\n    }\n    shortestRouteFound(thisState) {\n        this.routeFound = true;\n        this.running = false;\n        let state = thisState;\n        this.foundRoute = [];\n        while (state.previous) {\n            this.foundRoute.unshift(state);\n            const nextState = this.states.get(state.previous);\n            if (nextState === undefined)\n                throw Error(`state ${state.previous} not found`);\n            state = nextState;\n        }\n    }\n    getNewStates(state, robotIndex) {\n        // TODO:  make faster!!\n        // pre-calculate all stops for every tile (exl. helper robots)?\n        const robot = state.robots[robotIndex];\n        const otherRobots = state.robots.filter(r => r.idx !== robotIndex);\n        return [\n            solver_utils_1.goNorth(this.board, robot, otherRobots),\n            solver_utils_1.goWest(this.board, robot, otherRobots),\n            solver_utils_1.goEast(this.board, robot, otherRobots),\n            solver_utils_1.goSouth(this.board, robot, otherRobots)\n        ].filter(notNull).map(move => {\n            const newRobots = state.robots.slice();\n            newRobots[robotIndex] = { x: move.pos.x, y: move.pos.y, idx: newRobots[robotIndex].idx };\n            const stateHash = this.getState(newRobots, state.goalVisited);\n            return {\n                state: stateHash,\n                previous: state.state,\n                robots: newRobots,\n                lastMoveDirection: move.dir,\n                lastMoveRobotIdx: robotIndex,\n                goalVisited: state.goalVisited,\n                moves: state.moves + 1\n            };\n        });\n    }\n}\nexports.Solver = Solver;\nfunction getUsedRobots(route) {\n    if (!route)\n        return [];\n    const makeUnique = (arr) => [...new Set(arr)];\n    return makeUnique(route.map(route => route.lastMoveRobotIdx)).sort();\n}\n\n\n//# sourceURL=webpack:///./src/Solver.ts?");

/***/ }),

/***/ "./src/libs/Slumpa.ts":
/*!****************************!*\
  !*** ./src/libs/Slumpa.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.getHash = exports.shuffleCopy = exports.shuffle = exports.getSeed = exports.setRandomSeed = exports.setSeed = exports.randomOne = exports.randomItems = exports.randomBool = exports.randomFloats = exports.randomFloat = exports.randomInts = exports.randomInt = void 0;\nlet initSeed, seed;\nsetRandomSeed();\nfunction randomInt(a, b) {\n    if (a == undefined) {\n        throw new Error(\"Invalid parameters, enter max, or max and min values\");\n    }\n    if (b == undefined)\n        b = 0;\n    if (a < b)\n        var min = a, max = b;\n    else\n        var min = b, max = a;\n    return min + (Math.floor(rnd() * (max + 1 - min)));\n}\nexports.randomInt = randomInt;\nfunction randomInts(count, a, b) {\n    var ints = [];\n    for (var i = 0; i < count; i++) {\n        ints.push(randomInt(a, b));\n    }\n    return ints;\n}\nexports.randomInts = randomInts;\nfunction randomFloat(a, b) {\n    if (a == undefined) {\n        throw new Error(\"Invalid parameters, enter max, or max and min values\");\n    }\n    if (b == undefined)\n        b = 0;\n    if (a < b)\n        var min = a, max = b;\n    else\n        var min = b, max = a;\n    return min + (rnd() * (max - min));\n}\nexports.randomFloat = randomFloat;\nfunction randomFloats(c, a, b) {\n    var floats = [];\n    for (var i = 0; i < c; i++) {\n        floats.push(randomFloat(a, b));\n    }\n    return floats;\n}\nexports.randomFloats = randomFloats;\nfunction randomBool(probability) {\n    if (probability === undefined)\n        probability = 0.5;\n    return rnd() < probability ? true : false;\n}\nexports.randomBool = randomBool;\nfunction randomItems(arr, values, putBack) {\n    if (putBack) {\n        var result = [];\n        for (var i = 0; i < values; i++) {\n            result.push(arr[randomInt(0, arr.length - 1)]);\n        }\n        return result;\n    }\n    else {\n        arr = shuffleCopy(arr);\n        return arr.slice(0, values);\n    }\n}\nexports.randomItems = randomItems;\nfunction randomOne(arr) {\n    return arr[randomInt(0, arr.length - 1)];\n}\nexports.randomOne = randomOne;\nvar rnd = (function () {\n    var a = 1664525, c = 1013904223, m = Math.pow(2, 32);\n    return function () {\n        seed = (a * seed + c) % m;\n        return seed / m;\n    };\n}());\nfunction setSeed(newSeed) {\n    initSeed = newSeed;\n    seed = newSeed;\n}\nexports.setSeed = setSeed;\nfunction setRandomSeed() {\n    setSeed(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));\n}\nexports.setRandomSeed = setRandomSeed;\nfunction getSeed() {\n    return initSeed;\n}\nexports.getSeed = getSeed;\nfunction shuffle(arr) {\n    var j, tmp, i;\n    for (i = arr.length; i; i -= 1) {\n        j = Math.floor(rnd() * i);\n        tmp = arr[i - 1];\n        arr[i - 1] = arr[j];\n        arr[j] = tmp;\n    }\n    return arr;\n}\nexports.shuffle = shuffle;\nfunction shuffleCopy(arr) {\n    return shuffle(arr.slice(0));\n}\nexports.shuffleCopy = shuffleCopy;\nfunction getHash(str) {\n    var hash = 0, i, chr, len;\n    if (str.length === 0)\n        return hash;\n    for (i = 0, len = str.length; i < len; i++) {\n        chr = str.charCodeAt(i);\n        hash = ((hash << 5) - hash) + chr;\n        hash |= 0; // Convert to 32bit integer\n    }\n    return hash;\n}\nexports.getHash = getHash;\n;\n\n\n//# sourceURL=webpack:///./src/libs/Slumpa.ts?");

/***/ }),

/***/ "./src/libs/Timer.ts":
/*!***************************!*\
  !*** ./src/libs/Timer.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.default = (function () {\n    const results = {};\n    function time(name, fn) {\n        const start = new Date().getTime();\n        const resp = fn();\n        const end = new Date().getTime();\n        results[name] = (results[name] || 0) + end - start;\n        if (!name.startsWith('total-')) {\n            results['total-' + name] = (results['total-' + name] || 0) + end - start;\n        }\n        return resp;\n    }\n    function getAndClear() {\n        const out = {};\n        Object.entries(results).forEach(([key, value]) => {\n            if (key.startsWith('total-'))\n                return;\n            out[key] = value;\n            results[key] = 0;\n        });\n        return out;\n    }\n    function getTotals() {\n        const out = {};\n        Object.entries(results).forEach(([key, value]) => {\n            if (!key.startsWith('total-'))\n                return;\n            out[key] = value;\n        });\n        return out;\n    }\n    return {\n        time, getAndClear, getTotals\n    };\n}());\n\n\n//# sourceURL=webpack:///./src/libs/Timer.ts?");

/***/ }),

/***/ "./src/models/Board.ts":
/*!*****************************!*\
  !*** ./src/models/Board.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.Board = exports.Wall = void 0;\nconst Slumpa = __webpack_require__(/*! ../libs/Slumpa */ \"./src/libs/Slumpa.ts\");\nvar Wall;\n(function (Wall) {\n    Wall[Wall[\"NORTH\"] = 1] = \"NORTH\";\n    Wall[Wall[\"WEST\"] = 2] = \"WEST\";\n    Wall[Wall[\"EAST\"] = 4] = \"EAST\";\n    Wall[Wall[\"SOUTH\"] = 8] = \"SOUTH\";\n})(Wall = exports.Wall || (exports.Wall = {}));\nclass Board {\n    constructor(height, width) {\n        this.h = height;\n        this.w = width;\n        this.tiles = new Array(height).fill(null).map(() => new Array(width).fill(0));\n        this.addTopWalls();\n        this.addBottomWalls();\n        this.addLeftWalls();\n        this.addRightWalls();\n    }\n    getTilesString() {\n        return this.tiles.map(row => row.map(tile => tile.toString(16)).join('')).join('');\n    }\n    setTiles(tiles) {\n        if (tiles.length !== this.w * this.h)\n            throw Error(`Unable to set tiles. tiles.length was ${tiles.length}, expected ${this.w * this.h}`);\n        const numbers = tiles.split('').map(t => parseInt(t, 16));\n        this.tiles = new Array(this.h).fill(null).map((_, y) => numbers.slice(y * this.w, y * this.w + this.w));\n    }\n    addWall(x, y, wall) {\n        if (x < 0 || x >= this.w)\n            throw Error(`x must be between 0 and ${this.w - 1}, was: ${x}`);\n        if (y < 0 || y >= this.h)\n            throw Error(`y must be between 0 and ${this.h - 1}, was: ${y}`);\n        this.addSingleWall(x, y, wall);\n        const neighbour = this.getTileBehindTheWall(x, y, wall);\n        if (neighbour) {\n            const oppositeWall = this.getOppositeWall(wall);\n            this.addSingleWall(neighbour.x, neighbour.y, oppositeWall);\n        }\n    }\n    addRandomWalls(wallCount) {\n        let builtWalls = 0;\n        let attempt = 0;\n        while (builtWalls < wallCount && attempt < 1000) {\n            attempt++;\n            const wallType = Slumpa.randomOne([Wall.NORTH, Wall.EAST, Wall.WEST, Wall.SOUTH]);\n            const x = Slumpa.randomInt(0, this.w - 1);\n            const y = Slumpa.randomInt(0, this.h - 1);\n            const hasWall = this.tiles[y][x] & wallType;\n            if (hasWall)\n                continue;\n            this.addWall(x, y, wallType);\n            builtWalls++;\n        }\n    }\n    addSingleWall(x, y, wall) {\n        const value = this.tiles[y][x];\n        this.tiles[y][x] = value | wall;\n    }\n    getTileBehindTheWall(x, y, wall) {\n        if (wall === Wall.NORTH && y > 0)\n            return { x, y: y - 1 };\n        if (wall === Wall.WEST && x > 0)\n            return { x: x - 1, y };\n        if (wall === Wall.EAST && x + 1 < this.w)\n            return { x: x + 1, y };\n        if (wall === Wall.SOUTH && y + 1 < this.h)\n            return { x, y: y + 1 };\n        return null;\n    }\n    getOppositeWall(wall) {\n        switch (wall) {\n            case Wall.NORTH: return Wall.SOUTH;\n            case Wall.SOUTH: return Wall.NORTH;\n            case Wall.EAST: return Wall.WEST;\n            case Wall.WEST: return Wall.EAST;\n            default: throw Error(\"Invalid wall \" + wall);\n        }\n    }\n    addTopWalls() {\n        for (let x = 0; x < this.w; x++) {\n            this.addSingleWall(x, 0, Wall.NORTH);\n        }\n    }\n    addBottomWalls() {\n        for (let x = 0; x < this.w; x++) {\n            this.addSingleWall(x, this.h - 1, Wall.SOUTH);\n        }\n    }\n    addLeftWalls() {\n        for (let y = 0; y < this.h; y++) {\n            this.addSingleWall(0, y, Wall.WEST);\n        }\n    }\n    addRightWalls() {\n        for (let y = 0; y < this.h; y++) {\n            this.addSingleWall(this.w - 1, y, Wall.EAST);\n        }\n    }\n}\nexports.Board = Board;\n\n\n//# sourceURL=webpack:///./src/models/Board.ts?");

/***/ }),

/***/ "./src/models/Direction.ts":
/*!*********************************!*\
  !*** ./src/models/Direction.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.Direction = void 0;\nvar Direction;\n(function (Direction) {\n    Direction[\"UP\"] = \"UP\";\n    Direction[\"LEFT\"] = \"LEFT\";\n    Direction[\"RIGHT\"] = \"RIGHT\";\n    Direction[\"DOWN\"] = \"DOWN\";\n})(Direction = exports.Direction || (exports.Direction = {}));\n\n\n//# sourceURL=webpack:///./src/models/Direction.ts?");

/***/ }),

/***/ "./src/models/Goal.ts":
/*!****************************!*\
  !*** ./src/models/Goal.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.Goal = void 0;\nclass Goal {\n    constructor(x, y, robotIdx) {\n        this.x = x;\n        this.y = y;\n        this.robotIdx = robotIdx;\n    }\n}\nexports.Goal = Goal;\n\n\n//# sourceURL=webpack:///./src/models/Goal.ts?");

/***/ }),

/***/ "./src/models/Level.ts":
/*!*****************************!*\
  !*** ./src/models/Level.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.Level = void 0;\nconst Board_1 = __webpack_require__(/*! ./Board */ \"./src/models/Board.ts\");\nconst Robot_1 = __webpack_require__(/*! ./Robot */ \"./src/models/Robot.ts\");\nconst Goal_1 = __webpack_require__(/*! ./Goal */ \"./src/models/Goal.ts\");\nconst Slumpa = __webpack_require__(/*! ../libs/Slumpa */ \"./src/libs/Slumpa.ts\");\nconst LEVEL_STRING_DELIMITER = '|';\nclass Level {\n    constructor(input) {\n        if (typeof input === \"string\") {\n            const levelString = input;\n            const [widthStr, tiles, goalStr, ...robotsStr] = levelString.split(LEVEL_STRING_DELIMITER);\n            const width = parseInt(widthStr);\n            const height = tiles.length / width;\n            const goal = parseInt(goalStr);\n            this.goal = new Goal_1.Goal(goal % width, Math.floor(goal / width), 0);\n            this.robots = robotsStr.map(Number).map((r, i) => new Robot_1.Robot(i, r % width, Math.floor(r / width)));\n            this.board = new Board_1.Board(height, width);\n            this.board.setTiles(tiles);\n        }\n        else {\n            const { board, robots, goal } = generateLevelData(input);\n            this.board = board;\n            this.robots = robots;\n            this.goal = goal;\n        }\n    }\n    pos2num(pos) {\n        return pos.x + pos.y * this.board.w;\n    }\n    getLevelString() {\n        const goalStr = this.pos2num(this.goal);\n        const tiles = this.board.getTilesString();\n        const robotsStr = this.robots.map(r => this.pos2num(r)).join(LEVEL_STRING_DELIMITER);\n        return `${this.board.w}|${tiles}|${goalStr}|${robotsStr}`;\n    }\n}\nexports.Level = Level;\nfunction generateLevelData({ width, height, wallsCount, seed, robotCount }) {\n    Slumpa.setSeed(seed);\n    const board = new Board_1.Board(height, width);\n    board.addRandomWalls(wallsCount);\n    const availableTiles = [];\n    for (let x = 0; x < board.w; x++) {\n        for (let y = 0; y < board.h; y++) {\n            availableTiles.push({ x, y });\n        }\n    }\n    const randomTiles = Slumpa.shuffle(availableTiles);\n    const robots = new Array(robotCount).fill(null).map((_, i) => {\n        const tile = randomTiles.pop();\n        return new Robot_1.Robot(i, tile.x, tile.y);\n    });\n    const tile = randomTiles.pop();\n    const robotIndex = 0; //Math.floor(Math.random()*robots)\n    const goal = new Goal_1.Goal(tile.x, tile.y, robotIndex);\n    return { goal, robots, board };\n}\n\n\n//# sourceURL=webpack:///./src/models/Level.ts?");

/***/ }),

/***/ "./src/models/Robot.ts":
/*!*****************************!*\
  !*** ./src/models/Robot.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.cloneRobots = exports.Robot = void 0;\nclass Robot {\n    constructor(idx, x, y) {\n        this.idx = idx;\n        this.x = x;\n        this.y = y;\n    }\n    getPos() {\n        return { x: this.x, y: this.y };\n    }\n    setPos(pos) {\n        this.x = pos.x;\n        this.y = pos.y;\n    }\n    clone() {\n        return new Robot(this.idx, this.x, this.y);\n    }\n}\nexports.Robot = Robot;\nfunction cloneRobots(robots) {\n    return robots.map(r => r.clone());\n}\nexports.cloneRobots = cloneRobots;\n\n\n//# sourceURL=webpack:///./src/models/Robot.ts?");

/***/ }),

/***/ "./src/models/SolverWokerMessages.ts":
/*!*******************************************!*\
  !*** ./src/models/SolverWokerMessages.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.SolverWorkerMessage = void 0;\nvar SolverWorkerMessage;\n(function (SolverWorkerMessage) {\n    SolverWorkerMessage[\"PING\"] = \"PING\";\n    SolverWorkerMessage[\"PONG\"] = \"PONG\";\n    SolverWorkerMessage[\"SOLVE\"] = \"SOLVE\";\n    SolverWorkerMessage[\"SOLVE_END\"] = \"SOLVE_END\";\n    SolverWorkerMessage[\"SOLVE_PROGRESS\"] = \"SOLVE_PROGRESS\";\n})(SolverWorkerMessage = exports.SolverWorkerMessage || (exports.SolverWorkerMessage = {}));\n\n\n//# sourceURL=webpack:///./src/models/SolverWokerMessages.ts?");

/***/ }),

/***/ "./src/solver-utils.ts":
/*!*****************************!*\
  !*** ./src/solver-utils.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.hasWall = exports.goEast = exports.goWest = exports.goSouth = exports.goNorth = void 0;\nconst Board_1 = __webpack_require__(/*! ./models/Board */ \"./src/models/Board.ts\");\nconst Direction_1 = __webpack_require__(/*! ./models/Direction */ \"./src/models/Direction.ts\");\nfunction goNorth(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotY = Math.max(...otherRobots.filter(r => r.x === pos.x && r.y < pos.y).map(r => r.y));\n    for (; pos.y > 0; pos.y--) {\n        if (pos.y - 1 === closestRobotY || hasWall(board, pos.x, pos.y, Board_1.Wall.NORTH))\n            break;\n    }\n    if (pos.y === robot.y)\n        return null;\n    return { pos, dir: Direction_1.Direction.UP };\n}\nexports.goNorth = goNorth;\nfunction goSouth(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotY = Math.min(...otherRobots.filter(r => r.x === robot.x && r.y > pos.y).map(r => r.y));\n    for (; pos.y < board.h; pos.y++) {\n        if (pos.y + 1 === closestRobotY || hasWall(board, robot.x, pos.y, Board_1.Wall.SOUTH))\n            break;\n    }\n    if (pos.y === robot.y)\n        return null;\n    return { pos, dir: Direction_1.Direction.DOWN };\n}\nexports.goSouth = goSouth;\nfunction goWest(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotX = Math.max(...otherRobots.filter(r => r.y === pos.y && r.x < pos.x).map(r => r.x));\n    for (; pos.x > 0; pos.x--) {\n        if (pos.x - 1 === closestRobotX || hasWall(board, pos.x, pos.y, Board_1.Wall.WEST))\n            break;\n    }\n    if (pos.x === robot.x)\n        return null;\n    return { pos, dir: Direction_1.Direction.LEFT };\n}\nexports.goWest = goWest;\nfunction goEast(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotX = Math.min(...otherRobots.filter(r => r.y === pos.y && r.x > pos.x).map(r => r.x));\n    for (; pos.x < board.w; pos.x++) {\n        if (pos.x + 1 === closestRobotX || hasWall(board, pos.x, pos.y, Board_1.Wall.EAST))\n            break;\n    }\n    if (pos.x === robot.x)\n        return null;\n    return { pos, dir: Direction_1.Direction.RIGHT };\n}\nexports.goEast = goEast;\nfunction hasWall(board, x, y, wall) {\n    return (board.tiles[y][x] & wall) !== 0;\n}\nexports.hasWall = hasWall;\n\n\n//# sourceURL=webpack:///./src/solver-utils.ts?");

/***/ }),

/***/ "./src/solver-worker.ts":
/*!******************************!*\
  !*** ./src/solver-worker.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst Solver_1 = __webpack_require__(/*! ./Solver */ \"./src/Solver.ts\");\nconst SolverWokerMessages_1 = __webpack_require__(/*! ./models/SolverWokerMessages */ \"./src/models/SolverWokerMessages.ts\");\nconst Level_1 = __webpack_require__(/*! ./models/Level */ \"./src/models/Level.ts\");\nself.onmessage = processIncomingMessage;\nfunction processIncomingMessage(event) {\n    switch (event.data.type) {\n        case SolverWokerMessages_1.SolverWorkerMessage.SOLVE: {\n            const level = new Level_1.Level(event.data.levelString);\n            const solver = new Solver_1.Solver(level, { backAgain: event.data.backAgain });\n            solver.onComplete(onComplete);\n            solver.onProgress(onProgress);\n            solver.solve();\n            break;\n        }\n        default: {\n            throw Error(\"Worker recieved an unknown message\" + event.data.type);\n        }\n    }\n}\nfunction onComplete(result) {\n    postMessage({ type: SolverWokerMessages_1.SolverWorkerMessage.SOLVE_END, result });\n    close();\n}\nfunction onProgress(progress) {\n    postMessage({ type: SolverWokerMessages_1.SolverWorkerMessage.SOLVE_PROGRESS, progress });\n}\n\n\n//# sourceURL=webpack:///./src/solver-worker.ts?");

/***/ })

/******/ });