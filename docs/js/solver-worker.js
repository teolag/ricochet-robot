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
/*! exports provided: Solver */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Solver\", function() { return Solver; });\n/* harmony import */ var _solver_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./solver-utils */ \"./src/solver-utils.ts\");\n\nconst MAX_CHECKED = 100000;\nconst notNull = (value) => value !== null;\nclass Solver {\n    constructor(board, robots, goal) {\n        this.checkedStates = new Map();\n        this.statesUnchecked = new Set();\n        this.uncheckedStates = [];\n        this.completed = false;\n        this.running = false;\n        this.foundRoute = [];\n        this.message = '';\n        this.duration = 0;\n        this.tile = (pos) => pos.x + pos.y * this.board.w;\n        this.getState = (robots) => robots.map(r => this.tile(r)).join('|');\n        this.board = board;\n        this.robots = robots;\n        this.goal = goal;\n        console.log(\"GOAL\", goal);\n        this.goalTile = this.tile(this.goal);\n    }\n    solve() {\n        const startState = this.getState(this.robots);\n        this.uncheckedStates = [{ previous: '', color: 0, dir: '', state: startState, robots: this.robots.slice() }];\n        this.statesUnchecked = new Set(startState);\n        const start = new Date();\n        this.running = true;\n        while (this.running) {\n            if (this.progressCallback && (this.checkedStates.size % 100 === 0)) {\n                this.progressCallback({ checkedStates: this.checkedStates.size });\n            }\n            this.checkNext();\n        }\n        this.duration = (new Date().getTime() - start.getTime()) / 1000;\n        if (this.completeCallback) {\n            this.completeCallback(this.getResult());\n        }\n    }\n    isCompleted() {\n        return this.isCompleted;\n    }\n    getResult() {\n        return {\n            duration: this.duration,\n            statesChecked: this.checkedStates.size,\n            completed: this.completed,\n            running: this.running,\n            route: this.foundRoute,\n            message: this.message\n        };\n    }\n    onComplete(callback) {\n        this.completeCallback = callback;\n    }\n    onProgress(callback) {\n        this.progressCallback = callback;\n    }\n    checkNext() {\n        const currentState = this.uncheckedStates.shift();\n        if (currentState === undefined) {\n            this.message = `No more moves to check... I guess this level is impossible`;\n            this.running = false;\n            return;\n        }\n        const { state, robots, previous } = currentState;\n        //console.log(\"Checking\", state, robots[currentState.color].getPos())\n        this.statesUnchecked.delete(state);\n        if (this.isGoalReached(robots)) {\n            this.goalReached(currentState, previous);\n            return;\n        }\n        robots.forEach((robot, i) => {\n            const newStates = this.getNewStates(robots, i)\n                .filter(s => !this.checkedStates.has(s.state))\n                .filter(s => !this.statesUnchecked.has(s.state))\n                .map(s => (Object.assign(Object.assign({}, s), { previous: state })));\n            if (newStates.length) {\n                //console.log(\"add\", i, newStates.map(s => s.robots[i].x + ',' + s.robots[i].y).join('  '))\n                this.uncheckedStates.push(...newStates);\n                newStates.forEach(s => this.statesUnchecked.add(s.state));\n            }\n        });\n        this.checkedStates.set(state, currentState);\n        if (this.checkedStates.size === MAX_CHECKED) {\n            this.message = `Checked ${MAX_CHECKED} states. Abort!`;\n            this.running = false;\n            return;\n        }\n    }\n    isGoalReached(robots) {\n        return this.tile(robots[this.goal.color]) === this.goalTile;\n    }\n    goalReached(thisState, previous) {\n        this.completed = true;\n        this.running = false;\n        let state = thisState;\n        while (state.previous) {\n            this.foundRoute.unshift(state);\n            const nextState = this.checkedStates.get(state.previous);\n            if (nextState === undefined)\n                throw Error(`state ${previous} not found`);\n            state = nextState;\n        }\n        this.message = `Level solved in ${this.foundRoute.length} moves`;\n    }\n    getNewStates(robots, robotIndex) {\n        const robot = robots[robotIndex];\n        const otherRobots = robots.filter(r => r.color !== robotIndex);\n        return [\n            Object(_solver_utils__WEBPACK_IMPORTED_MODULE_0__[\"goNorth\"])(this.board, robot, otherRobots),\n            Object(_solver_utils__WEBPACK_IMPORTED_MODULE_0__[\"goSouth\"])(this.board, robot, otherRobots),\n            Object(_solver_utils__WEBPACK_IMPORTED_MODULE_0__[\"goWest\"])(this.board, robot, otherRobots),\n            Object(_solver_utils__WEBPACK_IMPORTED_MODULE_0__[\"goEast\"])(this.board, robot, otherRobots)\n        ].filter(notNull).map(move => {\n            const newRobots = robots.slice();\n            newRobots[robotIndex] = { x: move.pos.x, y: move.pos.y, color: newRobots[robotIndex].color };\n            const state = this.getState(newRobots);\n            return { state, robots: newRobots, dir: move.dir, color: robotIndex };\n        });\n    }\n}\n/*\nconst boardElem = document.querySelector('.board table')\nif(!boardElem) throw Error(\"could not find board\")\nnewPositions.forEach(pos => {\n  boardElem.innerHTML += `<div class='dot' style='left:${pos.x*41+20}px;top:${pos.y*41+20}px'></div>`\n})\nconsole.log(\"new\", newPositions)\n*/\n\n\n//# sourceURL=webpack:///./src/Solver.ts?");

/***/ }),

/***/ "./src/libs/Slumpa.ts":
/*!****************************!*\
  !*** ./src/libs/Slumpa.ts ***!
  \****************************/
/*! exports provided: randomInt, randomInts, randomFloat, randomFloats, randomBool, randomItems, randomOne, setSeed, setRandomSeed, getSeed, shuffle, shuffleCopy, getHash */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"randomInt\", function() { return randomInt; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"randomInts\", function() { return randomInts; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"randomFloat\", function() { return randomFloat; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"randomFloats\", function() { return randomFloats; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"randomBool\", function() { return randomBool; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"randomItems\", function() { return randomItems; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"randomOne\", function() { return randomOne; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setSeed\", function() { return setSeed; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setRandomSeed\", function() { return setRandomSeed; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getSeed\", function() { return getSeed; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"shuffle\", function() { return shuffle; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"shuffleCopy\", function() { return shuffleCopy; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getHash\", function() { return getHash; });\nlet initSeed, seed;\nsetRandomSeed();\nfunction randomInt(a, b) {\n    if (a == undefined) {\n        throw new Error(\"Invalid parameters, enter max, or max and min values\");\n    }\n    if (b == undefined)\n        b = 0;\n    if (a < b)\n        var min = a, max = b;\n    else\n        var min = b, max = a;\n    return min + (Math.floor(rnd() * (max + 1 - min)));\n}\nfunction randomInts(count, a, b) {\n    var ints = [];\n    for (var i = 0; i < count; i++) {\n        ints.push(randomInt(a, b));\n    }\n    return ints;\n}\nfunction randomFloat(a, b) {\n    if (a == undefined) {\n        throw new Error(\"Invalid parameters, enter max, or max and min values\");\n    }\n    if (b == undefined)\n        b = 0;\n    if (a < b)\n        var min = a, max = b;\n    else\n        var min = b, max = a;\n    return min + (rnd() * (max - min));\n}\nfunction randomFloats(c, a, b) {\n    var floats = [];\n    for (var i = 0; i < c; i++) {\n        floats.push(randomFloat(a, b));\n    }\n    return floats;\n}\nfunction randomBool(probability) {\n    if (probability === undefined)\n        probability = 0.5;\n    return rnd() < probability ? true : false;\n}\nfunction randomItems(arr, values, putBack) {\n    if (putBack) {\n        var result = [];\n        for (var i = 0; i < values; i++) {\n            result.push(arr[randomInt(0, arr.length - 1)]);\n        }\n        return result;\n    }\n    else {\n        arr = shuffleCopy(arr);\n        return arr.slice(0, values);\n    }\n}\nfunction randomOne(arr) {\n    return arr[randomInt(0, arr.length - 1)];\n}\nvar rnd = (function () {\n    var a = 1664525, c = 1013904223, m = Math.pow(2, 32);\n    return function () {\n        seed = (a * seed + c) % m;\n        return seed / m;\n    };\n}());\nfunction setSeed(newSeed) {\n    initSeed = newSeed;\n    seed = newSeed;\n}\nfunction setRandomSeed() {\n    setSeed(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));\n}\nfunction getSeed() {\n    return initSeed;\n}\nfunction shuffle(arr) {\n    var j, tmp, i;\n    for (i = arr.length; i; i -= 1) {\n        j = Math.floor(rnd() * i);\n        tmp = arr[i - 1];\n        arr[i - 1] = arr[j];\n        arr[j] = tmp;\n    }\n    return arr;\n}\nfunction shuffleCopy(arr) {\n    return shuffle(arr.slice(0));\n}\nfunction getHash(str) {\n    var hash = 0, i, chr, len;\n    if (str.length === 0)\n        return hash;\n    for (i = 0, len = str.length; i < len; i++) {\n        chr = str.charCodeAt(i);\n        hash = ((hash << 5) - hash) + chr;\n        hash |= 0; // Convert to 32bit integer\n    }\n    return hash;\n}\n;\n\n\n//# sourceURL=webpack:///./src/libs/Slumpa.ts?");

/***/ }),

/***/ "./src/models/Board.ts":
/*!*****************************!*\
  !*** ./src/models/Board.ts ***!
  \*****************************/
/*! exports provided: Wall, Board */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Wall\", function() { return Wall; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Board\", function() { return Board; });\n/* harmony import */ var _libs_Slumpa__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libs/Slumpa */ \"./src/libs/Slumpa.ts\");\n\nvar Wall;\n(function (Wall) {\n    Wall[Wall[\"NORTH\"] = 1] = \"NORTH\";\n    Wall[Wall[\"WEST\"] = 2] = \"WEST\";\n    Wall[Wall[\"EAST\"] = 4] = \"EAST\";\n    Wall[Wall[\"SOUTH\"] = 8] = \"SOUTH\";\n})(Wall || (Wall = {}));\nclass Board {\n    constructor(height, width) {\n        this.h = height;\n        this.w = width;\n        this.tiles = new Array(height).fill(null).map(() => new Array(width).fill(0));\n        this.addTopWalls();\n        this.addBottomWalls();\n        this.addLeftWalls();\n        this.addRightWalls();\n    }\n    addWall(x, y, wall) {\n        if (x < 0 || x >= this.w)\n            throw Error(`x must be between 0 and ${this.w - 1}, was: ${x}`);\n        if (y < 0 || y >= this.h)\n            throw Error(`y must be between 0 and ${this.h - 1}, was: ${y}`);\n        this.addSingleWall(x, y, wall);\n        const neighbour = this.getTileBehindTheWall(x, y, wall);\n        if (neighbour) {\n            const oppositeWall = this.getOppositeWall(wall);\n            this.addSingleWall(neighbour.x, neighbour.y, oppositeWall);\n        }\n    }\n    addRandomWalls(wallCount) {\n        let builtWalls = 0;\n        let attempt = 0;\n        while (builtWalls < wallCount && attempt < 1000) {\n            attempt++;\n            const wallType = _libs_Slumpa__WEBPACK_IMPORTED_MODULE_0__[\"randomOne\"]([Wall.NORTH, Wall.EAST, Wall.WEST, Wall.SOUTH]);\n            const x = _libs_Slumpa__WEBPACK_IMPORTED_MODULE_0__[\"randomInt\"](0, this.w - 1);\n            const y = _libs_Slumpa__WEBPACK_IMPORTED_MODULE_0__[\"randomInt\"](0, this.h - 1);\n            const hasWall = this.tiles[y][x] & wallType;\n            if (hasWall)\n                continue;\n            this.addWall(x, y, wallType);\n            builtWalls++;\n        }\n    }\n    addSingleWall(x, y, wall) {\n        const value = this.tiles[y][x];\n        this.tiles[y][x] = value | wall;\n    }\n    getTileBehindTheWall(x, y, wall) {\n        if (wall === Wall.NORTH && y > 0)\n            return { x, y: y - 1 };\n        if (wall === Wall.WEST && x > 0)\n            return { x: x - 1, y };\n        if (wall === Wall.EAST && x + 1 < this.w)\n            return { x: x + 1, y };\n        if (wall === Wall.SOUTH && y + 1 < this.h)\n            return { x, y: y + 1 };\n        return null;\n    }\n    getOppositeWall(wall) {\n        switch (wall) {\n            case Wall.NORTH: return Wall.SOUTH;\n            case Wall.SOUTH: return Wall.NORTH;\n            case Wall.EAST: return Wall.WEST;\n            case Wall.WEST: return Wall.EAST;\n            default: throw Error(\"Invalid wall \" + wall);\n        }\n    }\n    addTopWalls() {\n        for (let x = 0; x < this.w; x++) {\n            this.addSingleWall(x, 0, Wall.NORTH);\n        }\n    }\n    addBottomWalls() {\n        for (let x = 0; x < this.w; x++) {\n            this.addSingleWall(x, this.h - 1, Wall.SOUTH);\n        }\n    }\n    addLeftWalls() {\n        for (let y = 0; y < this.h; y++) {\n            this.addSingleWall(0, y, Wall.WEST);\n        }\n    }\n    addRightWalls() {\n        for (let y = 0; y < this.h; y++) {\n            this.addSingleWall(this.w - 1, y, Wall.EAST);\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/models/Board.ts?");

/***/ }),

/***/ "./src/models/SolverWokerMessages.ts":
/*!*******************************************!*\
  !*** ./src/models/SolverWokerMessages.ts ***!
  \*******************************************/
/*! exports provided: SolverWorkerMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SolverWorkerMessage\", function() { return SolverWorkerMessage; });\nvar SolverWorkerMessage;\n(function (SolverWorkerMessage) {\n    SolverWorkerMessage[\"PING\"] = \"PING\";\n    SolverWorkerMessage[\"PONG\"] = \"PONG\";\n    SolverWorkerMessage[\"SOLVE\"] = \"SOLVE\";\n    SolverWorkerMessage[\"SOLVE_END\"] = \"SOLVE_END\";\n    SolverWorkerMessage[\"SOLVE_PROGRESS\"] = \"SOLVE_PROGRESS\";\n})(SolverWorkerMessage || (SolverWorkerMessage = {}));\n\n\n//# sourceURL=webpack:///./src/models/SolverWokerMessages.ts?");

/***/ }),

/***/ "./src/solver-utils.ts":
/*!*****************************!*\
  !*** ./src/solver-utils.ts ***!
  \*****************************/
/*! exports provided: goNorth, goSouth, goWest, goEast, hasWall */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"goNorth\", function() { return goNorth; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"goSouth\", function() { return goSouth; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"goWest\", function() { return goWest; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"goEast\", function() { return goEast; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hasWall\", function() { return hasWall; });\n/* harmony import */ var _models_Board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/Board */ \"./src/models/Board.ts\");\n\nfunction goNorth(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotY = Math.max(...otherRobots.filter(r => r.x === pos.x && r.y < pos.y).map(r => r.y));\n    for (; pos.y > 0; pos.y--) {\n        if (pos.y - 1 === closestRobotY || hasWall(board, pos.x, pos.y, _models_Board__WEBPACK_IMPORTED_MODULE_0__[\"Wall\"].NORTH))\n            break;\n    }\n    if (pos.y === robot.y)\n        return null;\n    return { pos, dir: 'upp' };\n}\nfunction goSouth(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotY = Math.min(...otherRobots.filter(r => r.x === robot.x && r.y > pos.y).map(r => r.y));\n    for (; pos.y < board.h; pos.y++) {\n        if (pos.y + 1 === closestRobotY || hasWall(board, robot.x, pos.y, _models_Board__WEBPACK_IMPORTED_MODULE_0__[\"Wall\"].SOUTH))\n            break;\n    }\n    if (pos.y === robot.y)\n        return null;\n    return { pos, dir: 'ner' };\n}\nfunction goWest(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotX = Math.max(...otherRobots.filter(r => r.y === pos.y && r.x < pos.x).map(r => r.x));\n    for (; pos.x > 0; pos.x--) {\n        if (pos.x - 1 === closestRobotX || hasWall(board, pos.x, pos.y, _models_Board__WEBPACK_IMPORTED_MODULE_0__[\"Wall\"].WEST))\n            break;\n    }\n    if (pos.x === robot.x)\n        return null;\n    return { pos, dir: 'vänster' };\n}\nfunction goEast(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotX = Math.min(...otherRobots.filter(r => r.y === pos.y && r.x > pos.x).map(r => r.x));\n    for (; pos.x < board.w; pos.x++) {\n        if (pos.x + 1 === closestRobotX || hasWall(board, pos.x, pos.y, _models_Board__WEBPACK_IMPORTED_MODULE_0__[\"Wall\"].EAST))\n            break;\n    }\n    if (pos.x === robot.x)\n        return null;\n    return { pos, dir: 'höger' };\n}\nfunction hasWall(board, x, y, wall) {\n    return (board.tiles[y][x] & wall) !== 0;\n}\n\n\n//# sourceURL=webpack:///./src/solver-utils.ts?");

/***/ }),

/***/ "./src/solver-worker.ts":
/*!******************************!*\
  !*** ./src/solver-worker.ts ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Solver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Solver */ \"./src/Solver.ts\");\n/* harmony import */ var _models_SolverWokerMessages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/SolverWokerMessages */ \"./src/models/SolverWokerMessages.ts\");\n\n\nself.onmessage = processIncomingMessage;\nfunction processIncomingMessage(e) {\n    switch (e.data.type) {\n        case _models_SolverWokerMessages__WEBPACK_IMPORTED_MODULE_1__[\"SolverWorkerMessage\"].SOLVE: {\n            const { board, robots, goal } = e.data.level;\n            const solver = new _Solver__WEBPACK_IMPORTED_MODULE_0__[\"Solver\"](board, robots, goal);\n            solver.onComplete(onComplete);\n            solver.onProgress(onProgress);\n            solver.solve();\n            break;\n        }\n        default: {\n            throw Error(\"Worker recieved an unknown message\" + e.data.type);\n        }\n    }\n}\nfunction onComplete(result) {\n    postMessage({ type: _models_SolverWokerMessages__WEBPACK_IMPORTED_MODULE_1__[\"SolverWorkerMessage\"].SOLVE_END, result });\n    close();\n}\nfunction onProgress(progress) {\n    postMessage({ type: _models_SolverWokerMessages__WEBPACK_IMPORTED_MODULE_1__[\"SolverWorkerMessage\"].SOLVE_PROGRESS, progress });\n}\n\n\n//# sourceURL=webpack:///./src/solver-worker.ts?");

/***/ })

/******/ });