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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _models_Level__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/Level */ \"./src/models/Level.ts\");\n/* harmony import */ var _models_Board__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/Board */ \"./src/models/Board.ts\");\n/* harmony import */ var _libs_Slumpa__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./libs/Slumpa */ \"./src/libs/Slumpa.ts\");\n/* harmony import */ var _models_Robot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models/Robot */ \"./src/models/Robot.ts\");\n/* harmony import */ var _solver_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./solver-service */ \"./src/solver-service.ts\");\n/* harmony import */ var _solver_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./solver-utils */ \"./src/solver-utils.ts\");\n/* harmony import */ var _service_worker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./service-worker */ \"./src/service-worker.ts\");\n/* harmony import */ var _service_worker__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_service_worker__WEBPACK_IMPORTED_MODULE_6__);\n\n\n\n\n\n\n\nvar Direction;\n(function (Direction) {\n    Direction[\"UP\"] = \"UP\";\n    Direction[\"LEFT\"] = \"LEFT\";\n    Direction[\"RIGHT\"] = \"RIGHT\";\n    Direction[\"DOWN\"] = \"DOWN\";\n})(Direction || (Direction = {}));\n/*\n\n\n1drag = 4^2 = 16\n2drag = 4^3 = 64\n3drag = 4^4 = 256\n4drag = 4^5 = 1024\n5drag = 4^6 = 4096\n6drag = 4^7 = 16384\n7drag = 4^8 = 65536\n8drag = 4^9 = 262144\nRIMLIGT??\n\n\n* There and back again\n\n* show and play solution\n\n* move robots with keyboard\n  - wasd of arrow-keys to move\n  - 1-x to switch robot\n\n* move robots with touch\n  - swipe on robots to move\n  - virtual controls with arrows and color buttons to change robot\n\n* solver info\n  - service worker\n  - status indicator\n  - click to show\n    - states checked\n    - best route\n    - solve duration\n  - inform user if a level is impossible / too hard?\n\n* Defined levels in different difficulty groups Easy/Medium/Hard\n\n* Collect stars.\n  1 star complete the level  >125%\n  2 stars complete within 5 moves or %? 100-125%\n  3 stars complete with best route 100%\n  \n  * Save progress in local storage\n  \n  */\nlet level;\nlet robots;\nlet activeRobotIndex = 0;\nlet selectedRobot;\nlet otherRobots;\nlet robotElems;\nlet moves = 0;\nconst boardElem = document.querySelector('.board');\nconst movesCounter = getElementById('movesCounter');\nconst moveQueue = [];\nlet processingMoveQueue = false;\nstartup();\ngetElementById('btnUp').addEventListener('click', _ => moveActiveRobot(_solver_utils__WEBPACK_IMPORTED_MODULE_5__[\"goNorth\"]));\ngetElementById('btnDown').addEventListener('click', _ => moveActiveRobot(_solver_utils__WEBPACK_IMPORTED_MODULE_5__[\"goSouth\"]));\ngetElementById('btnLeft').addEventListener('click', _ => moveActiveRobot(_solver_utils__WEBPACK_IMPORTED_MODULE_5__[\"goWest\"]));\ngetElementById('btnRight').addEventListener('click', _ => moveActiveRobot(_solver_utils__WEBPACK_IMPORTED_MODULE_5__[\"goEast\"]));\ngetElementById('btnReset').addEventListener('click', reset);\ndocument.body.addEventListener('keydown', keyHandler);\ngetElementById('btnNewGame').addEventListener('click', () => {\n    ranomizeSeed();\n    newGame();\n});\nwindow[\"show\"] = () => {\n    const result = Object(_solver_service__WEBPACK_IMPORTED_MODULE_4__[\"getResult\"])();\n    if (!result)\n        return;\n    reset();\n    moveQueue.length = 0;\n    const dirToDirection = new Map([['upp', Direction.UP], ['ner', Direction.DOWN], ['vänster', Direction.LEFT], ['höger', Direction.RIGHT]]);\n    moveQueue.push(...result.route.map(step => {\n        const direction = dirToDirection.get(step.dir);\n        if (!direction)\n            throw Error(\"Unknown direction:\" + step.dir);\n        return { direction, robotIndex: step.color };\n    }));\n    processMoveQueue();\n};\nfunction startup() {\n    const seed = parseInt(location.hash.substr(1));\n    if (seed) {\n        _libs_Slumpa__WEBPACK_IMPORTED_MODULE_2__[\"setSeed\"](seed);\n        newGame();\n    }\n    else {\n        ranomizeSeed();\n        newGame();\n    }\n}\nfunction setMoveCounter(value) {\n    moves = value;\n    movesCounter.innerText = value.toString();\n}\nfunction ranomizeSeed() {\n    const newSeed = Math.floor(Math.random() * 1000000);\n    location.hash = newSeed.toString();\n    _libs_Slumpa__WEBPACK_IMPORTED_MODULE_2__[\"setSeed\"](newSeed);\n}\nfunction keyHandler(e) {\n    switch (e.key) {\n        case 'ArrowUp':\n            addToMoveQueue(activeRobotIndex, Direction.UP);\n            break;\n        case 'ArrowDown':\n            addToMoveQueue(activeRobotIndex, Direction.DOWN);\n            break;\n        case 'ArrowLeft':\n            addToMoveQueue(activeRobotIndex, Direction.LEFT);\n            break;\n        case 'ArrowRight':\n            addToMoveQueue(activeRobotIndex, Direction.RIGHT);\n            break;\n        case '1':\n            switchRobot(0);\n            break;\n        case '2':\n            switchRobot(1);\n            break;\n        case '3':\n            switchRobot(2);\n            break;\n        case '4':\n            switchRobot(3);\n            break;\n    }\n}\nfunction newGame() {\n    level = new _models_Level__WEBPACK_IMPORTED_MODULE_0__[\"Level\"](12, 12, 4);\n    Object(_solver_service__WEBPACK_IMPORTED_MODULE_4__[\"solve\"])(level);\n    const html = createHTMLBoard(level);\n    if (!boardElem)\n        throw Error(\"could not find board\");\n    boardElem.innerHTML = html;\n    robotElems = level.robots.map(r => {\n        const elem = document.createElement('div');\n        elem.classList.add('robot', 'robot-' + r.color);\n        elem.innerText = (r.color + 1).toString();\n        elem.addEventListener('click', e => switchRobot(r.color));\n        return elem;\n    });\n    robotElems.forEach(robotElem => {\n        boardElem.appendChild(robotElem);\n    });\n    reset();\n}\nfunction reset() {\n    if (!level)\n        return;\n    setMoveCounter(0);\n    robots = Object(_models_Robot__WEBPACK_IMPORTED_MODULE_3__[\"cloneRobots\"])(level.robots);\n    robots.forEach((robot, i) => {\n        moveRobotElem(robotElems[i], robot.getPos());\n    });\n    switchRobot(0);\n}\nfunction addToMoveQueue(robotIndex, direction) {\n    moveQueue.push({ robotIndex, direction });\n    if (processingMoveQueue)\n        return;\n    processMoveQueue();\n}\nfunction processMoveQueue() {\n    const nextMove = moveQueue.shift();\n    if (!nextMove) {\n        processingMoveQueue = false;\n        return;\n    }\n    processingMoveQueue = true;\n    switchRobot(nextMove.robotIndex);\n    switch (nextMove.direction) {\n        case Direction.UP:\n            moveActiveRobot(_solver_utils__WEBPACK_IMPORTED_MODULE_5__[\"goNorth\"]);\n            break;\n        case Direction.DOWN:\n            moveActiveRobot(_solver_utils__WEBPACK_IMPORTED_MODULE_5__[\"goSouth\"]);\n            break;\n        case Direction.LEFT:\n            moveActiveRobot(_solver_utils__WEBPACK_IMPORTED_MODULE_5__[\"goWest\"]);\n            break;\n        case Direction.RIGHT:\n            moveActiveRobot(_solver_utils__WEBPACK_IMPORTED_MODULE_5__[\"goEast\"]);\n            break;\n    }\n    setTimeout(processMoveQueue, 400);\n}\nfunction moveActiveRobot(moveFunction) {\n    const newPos = moveFunction(level.board, selectedRobot, otherRobots);\n    if (!newPos)\n        return;\n    moveRobotElem(robotElems[activeRobotIndex], newPos.pos);\n    selectedRobot.setPos(newPos.pos);\n    setMoveCounter(moves + 1);\n    if (goalIsReached()) {\n        const result = Object(_solver_service__WEBPACK_IMPORTED_MODULE_4__[\"getResult\"])();\n        if (!result) {\n            alert(\"Grattis, du klarade det innan solvern\");\n            return;\n        }\n        const score = calculateScore(moves, result.route.length);\n        setTimeout(() => {\n            alert(\"tjohooo!! Score: \" + '⭐'.repeat(score));\n        }, 400);\n    }\n}\nfunction moveRobotElem(robot, newPos) {\n    robot.style.transform = `translate(${newPos.x * 38 + 10}px, ${newPos.y * 38 + 10}px)`;\n}\nfunction switchRobot(index) {\n    if (index > robots.length)\n        return;\n    activeRobotIndex = index;\n    selectedRobot = robots[index];\n    otherRobots = robots.filter(r => r.color !== index);\n    robotElems.forEach((r, i) => {\n        r.classList.toggle('active', i === index);\n    });\n}\nfunction createHTMLBoard(level) {\n    return \"<table><tr>\" + level.board.tiles.map((row, y) => row.map((walls, x) => {\n        let text = '';\n        const classes = [];\n        if (walls & _models_Board__WEBPACK_IMPORTED_MODULE_1__[\"Wall\"].NORTH)\n            classes.push('wall-north');\n        if (walls & _models_Board__WEBPACK_IMPORTED_MODULE_1__[\"Wall\"].EAST)\n            classes.push('wall-east');\n        if (walls & _models_Board__WEBPACK_IMPORTED_MODULE_1__[\"Wall\"].WEST)\n            classes.push('wall-west');\n        if (walls & _models_Board__WEBPACK_IMPORTED_MODULE_1__[\"Wall\"].SOUTH)\n            classes.push('wall-south');\n        if (level.goal.x === x && level.goal.y === y) {\n            text = `<div class=\"goal goal-${level.goal.color}\"></div>`;\n        }\n        level.robots.forEach(robot => {\n            if (robot.x === x && robot.y === y) {\n                text = `<div class=\"start start-${robot.color}\"></div>`;\n            }\n        });\n        return `<td class='${classes.join(' ')}'>${text}</td>`;\n    }).join('')).join('</tr><tr>') + '</tr></table>';\n}\nfunction goalIsReached() {\n    const correctRobot = robots[level.goal.color];\n    return correctRobot.x === level.goal.x && correctRobot.y === level.goal.y;\n}\nfunction calculateScore(moves, optimalMoves) {\n    if (moves === optimalMoves)\n        return 3;\n    if (moves <= 1 + Math.floor(optimalMoves * 1.3))\n        return 2;\n    return 1;\n}\nfunction getElementById(id) {\n    const elem = document.getElementById(id);\n    if (!elem)\n        throw Error(\"Could not find element \" + id);\n    return elem;\n}\n\n\n//# sourceURL=webpack:///./src/index.ts?");

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

/***/ "./src/models/Goal.ts":
/*!****************************!*\
  !*** ./src/models/Goal.ts ***!
  \****************************/
/*! exports provided: Goal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Goal\", function() { return Goal; });\nclass Goal {\n    constructor(x, y, color) {\n        this.x = x;\n        this.y = y;\n        this.color = color;\n    }\n}\n\n\n//# sourceURL=webpack:///./src/models/Goal.ts?");

/***/ }),

/***/ "./src/models/Level.ts":
/*!*****************************!*\
  !*** ./src/models/Level.ts ***!
  \*****************************/
/*! exports provided: Level */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Level\", function() { return Level; });\n/* harmony import */ var _Board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Board */ \"./src/models/Board.ts\");\n/* harmony import */ var _Robot__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Robot */ \"./src/models/Robot.ts\");\n/* harmony import */ var _Goal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Goal */ \"./src/models/Goal.ts\");\n/* harmony import */ var _libs_Slumpa__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../libs/Slumpa */ \"./src/libs/Slumpa.ts\");\n\n\n\n\nclass Level {\n    constructor(width, height, robots) {\n        this.board = new _Board__WEBPACK_IMPORTED_MODULE_0__[\"Board\"](width, height);\n        this.board.addRandomWalls(width * height / 5);\n        const availableTiles = [];\n        for (let x = 0; x < this.board.w; x++) {\n            for (let y = 0; y < this.board.h; y++) {\n                availableTiles.push({ x, y });\n            }\n        }\n        const randomTiles = _libs_Slumpa__WEBPACK_IMPORTED_MODULE_3__[\"shuffle\"](availableTiles);\n        this.robots = new Array(robots).fill(null).map((_, i) => {\n            const tile = randomTiles.pop();\n            return new _Robot__WEBPACK_IMPORTED_MODULE_1__[\"Robot\"](i, tile.x, tile.y);\n        });\n        const tile = randomTiles.pop();\n        const color = 0; //Math.floor(Math.random()*robots)\n        this.goal = new _Goal__WEBPACK_IMPORTED_MODULE_2__[\"Goal\"](tile.x, tile.y, color);\n    }\n}\n\n\n//# sourceURL=webpack:///./src/models/Level.ts?");

/***/ }),

/***/ "./src/models/Robot.ts":
/*!*****************************!*\
  !*** ./src/models/Robot.ts ***!
  \*****************************/
/*! exports provided: Robot, cloneRobots */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Robot\", function() { return Robot; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cloneRobots\", function() { return cloneRobots; });\nclass Robot {\n    constructor(id, x, y) {\n        this.id = id;\n        this.color = id;\n        this.x = x;\n        this.y = y;\n    }\n    getPos() {\n        return { x: this.x, y: this.y };\n    }\n    setPos(pos) {\n        this.x = pos.x;\n        this.y = pos.y;\n    }\n    clone() {\n        return new Robot(this.id, this.x, this.y);\n    }\n}\nfunction cloneRobots(robots) {\n    return robots.map(r => r.clone());\n}\n\n\n//# sourceURL=webpack:///./src/models/Robot.ts?");

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

/***/ "./src/service-worker.ts":
/*!*******************************!*\
  !*** ./src/service-worker.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n// Service Worker stuff\nif ('serviceWorker' in navigator) {\n    console.log(\"SW: register service worker\");\n    navigator.serviceWorker.register('sw.js')\n        .then(function (registration) {\n        console.log(`SW: service worker registered`);\n        // no service worker active, first visit\n        if (!navigator.serviceWorker.controller) {\n            console.log(\"SW: first visit\");\n            //return;\n        }\n        if (registration.waiting) {\n            console.log(\"SW: new worker ready\");\n            updateReady(registration.waiting);\n            return;\n        }\n        if (registration.installing) {\n            console.log(\"SW: new worker installing\");\n            trackInstalling(registration.installing);\n            return;\n        }\n        registration.addEventListener('updatefound', function (e) {\n            console.log(\"SW: new worker found, track installation\", e);\n            if (registration.installing) {\n                trackInstalling(registration.installing);\n            }\n        });\n    })\n        .catch(function (err) {\n        console.log(\"Service worker registration failed : \", err);\n    });\n    let refreshing = false;\n    navigator.serviceWorker.addEventListener('controllerchange', function () {\n        console.log(\"SW: Refresh page!\", refreshing);\n        if (refreshing)\n            return;\n        const reload = confirm(\"New version available! Do you want to reload?\");\n        if (reload)\n            window.location.reload();\n        refreshing = true;\n    });\n    var trackInstalling = function (worker) {\n        // var indexController = this;\n        worker.addEventListener('statechange', function () {\n            console.log(\"SW: STATE CHANGE\", worker.state);\n            if (worker.state == 'installed') {\n                updateReady(worker);\n            }\n        });\n    };\n    var updateReady = function (worker) {\n        console.log(\"SW: Update ready!\");\n        worker.postMessage({ action: 'skipWaiting' });\n    };\n    navigator.serviceWorker.onmessage = function (e) {\n        console.log(\"SW: Message form SW:\", e.data);\n    };\n}\nwindow.addEventListener('beforeinstallprompt', (e) => {\n    e.preventDefault();\n    const deferredPrompt = e;\n    /*\n    const installButton = document.getElementById(\"install-button\")\n    installButton.hidden = false\n    installButton.addEventListener(\"click\", () => {\n        deferredPrompt.prompt()\n    })\n    */\n});\n\n\n//# sourceURL=webpack:///./src/service-worker.ts?");

/***/ }),

/***/ "./src/solver-service.ts":
/*!*******************************!*\
  !*** ./src/solver-service.ts ***!
  \*******************************/
/*! exports provided: solve, getResult */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"solve\", function() { return solve; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getResult\", function() { return getResult; });\n/* harmony import */ var _models_SolverWokerMessages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/SolverWokerMessages */ \"./src/models/SolverWokerMessages.ts\");\n\nlet solverWorker;\nlet result;\nlet progress;\nconst elem = document.getElementById('solverStatus');\nif (!elem)\n    throw Error(\"Could not find solver status element\");\nconst setText = (text) => elem.innerText = text;\nfunction solve(level) {\n    if (solverWorker) {\n        solverWorker.terminate();\n    }\n    result = null;\n    solverWorker = new Worker('js/solver-worker.js');\n    solverWorker.onmessage = onWorkerMessage;\n    solverWorker.postMessage({ type: _models_SolverWokerMessages__WEBPACK_IMPORTED_MODULE_0__[\"SolverWorkerMessage\"].SOLVE, level });\n}\nfunction getResult() {\n    return result;\n}\nfunction onWorkerMessage(e) {\n    switch (e.data.type) {\n        case _models_SolverWokerMessages__WEBPACK_IMPORTED_MODULE_0__[\"SolverWorkerMessage\"].SOLVE_END: {\n            result = e.data.result;\n            console.log(\"SOLVE DONE\", e.data.result);\n            if (result.completed) {\n                setText(\"Klar!\");\n            }\n            else {\n                setText('Hittade ingen');\n            }\n            break;\n        }\n        case _models_SolverWokerMessages__WEBPACK_IMPORTED_MODULE_0__[\"SolverWorkerMessage\"].SOLVE_PROGRESS: {\n            progress = e.data.progress;\n            setText('Checked ' + progress.checkedStates);\n            break;\n        }\n        default: {\n            throw Error(\"Unknown message from web worker: \" + e.data.type);\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/solver-service.ts?");

/***/ }),

/***/ "./src/solver-utils.ts":
/*!*****************************!*\
  !*** ./src/solver-utils.ts ***!
  \*****************************/
/*! exports provided: goNorth, goSouth, goWest, goEast, hasWall */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"goNorth\", function() { return goNorth; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"goSouth\", function() { return goSouth; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"goWest\", function() { return goWest; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"goEast\", function() { return goEast; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hasWall\", function() { return hasWall; });\n/* harmony import */ var _models_Board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/Board */ \"./src/models/Board.ts\");\n\nfunction goNorth(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotY = Math.max(...otherRobots.filter(r => r.x === pos.x && r.y < pos.y).map(r => r.y));\n    for (; pos.y > 0; pos.y--) {\n        if (pos.y - 1 === closestRobotY || hasWall(board, pos.x, pos.y, _models_Board__WEBPACK_IMPORTED_MODULE_0__[\"Wall\"].NORTH))\n            break;\n    }\n    if (pos.y === robot.y)\n        return null;\n    return { pos, dir: 'upp' };\n}\nfunction goSouth(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotY = Math.min(...otherRobots.filter(r => r.x === robot.x && r.y > pos.y).map(r => r.y));\n    for (; pos.y < board.h; pos.y++) {\n        if (pos.y + 1 === closestRobotY || hasWall(board, robot.x, pos.y, _models_Board__WEBPACK_IMPORTED_MODULE_0__[\"Wall\"].SOUTH))\n            break;\n    }\n    if (pos.y === robot.y)\n        return null;\n    return { pos, dir: 'ner' };\n}\nfunction goWest(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotX = Math.max(...otherRobots.filter(r => r.y === pos.y && r.x < pos.x).map(r => r.x));\n    for (; pos.x > 0; pos.x--) {\n        if (pos.x - 1 === closestRobotX || hasWall(board, pos.x, pos.y, _models_Board__WEBPACK_IMPORTED_MODULE_0__[\"Wall\"].WEST))\n            break;\n    }\n    if (pos.x === robot.x)\n        return null;\n    return { pos, dir: 'vänster' };\n}\nfunction goEast(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotX = Math.min(...otherRobots.filter(r => r.y === pos.y && r.x > pos.x).map(r => r.x));\n    for (; pos.x < board.w; pos.x++) {\n        if (pos.x + 1 === closestRobotX || hasWall(board, pos.x, pos.y, _models_Board__WEBPACK_IMPORTED_MODULE_0__[\"Wall\"].EAST))\n            break;\n    }\n    if (pos.x === robot.x)\n        return null;\n    return { pos, dir: 'höger' };\n}\nfunction hasWall(board, x, y, wall) {\n    return (board.tiles[y][x] & wall) !== 0;\n}\n\n\n//# sourceURL=webpack:///./src/solver-utils.ts?");

/***/ })

/******/ });