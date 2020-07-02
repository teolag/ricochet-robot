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

/***/ "./src/active-route.ts":
/*!*****************************!*\
  !*** ./src/active-route.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.getMovesCount = exports.addMove = exports.reset = void 0;\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\nconst Game = __webpack_require__(/*! ./game */ \"./src/game.ts\");\nconst route = [];\nconst movesCounter = utils_1.getElementById('movesCounter');\nconst undoButton = utils_1.getButton('btnUndo');\nconst resetButton = utils_1.getButton('btnReset');\nconst movesMade = utils_1.getElementById('movesMade');\nundoButton.addEventListener('click', undoLastMove);\nresetButton.addEventListener('click', reset);\nfunction reset() {\n    route.length = 0;\n    updateUI();\n    Game.resetRobots();\n}\nexports.reset = reset;\nfunction addMove(robotIndex, direction, robots) {\n    route.push({ direction, robotIndex, robots });\n    updateUI();\n}\nexports.addMove = addMove;\nfunction getMovesCount() {\n    return route.length;\n}\nexports.getMovesCount = getMovesCount;\nfunction undoLastMove() {\n    if (route.length === 1) {\n        reset();\n        return;\n    }\n    route.pop();\n    updateUI();\n    const lastRobots = route[route.length - 1].robots;\n    Game.setRobotsPostitions(lastRobots);\n}\nfunction updateUI() {\n    const moves = route.length;\n    movesCounter.innerText = moves.toString();\n    movesMade.innerHTML = route.map(r => `<span>${r.robotIndex + 1}${r.direction.substr(0, 1)}</span>`).join('');\n    undoButton.disabled = route.length === 0;\n    resetButton.disabled = route.length === 0;\n}\n\n\n//# sourceURL=webpack:///./src/active-route.ts?");

/***/ }),

/***/ "./src/components/color-controls.ts":
/*!******************************************!*\
  !*** ./src/components/color-controls.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.activeRobotChanged = exports.onColorSelect = exports.createButtons = void 0;\nconst utils_1 = __webpack_require__(/*! ../utils */ \"./src/utils.ts\");\nlet buttons = [];\nlet activeRobot = 0;\nconst colorControls = utils_1.getElementById('colorControls');\ncolorControls.addEventListener('click', clickHandler);\nlet onColorSelectCallback;\nfunction createButtons(count) {\n    buttons = new Array(count).fill(null).map((_, i) => {\n        const elem = document.createElement(\"button\");\n        elem.classList.add('color' + i);\n        if (i === activeRobot)\n            elem.classList.add('selected');\n        elem.dataset.color = i.toString();\n        elem.innerText = (i + 1).toString();\n        return elem;\n    });\n    colorControls.innerHTML = \"\";\n    buttons.forEach(button => colorControls.appendChild(button));\n}\nexports.createButtons = createButtons;\nfunction onColorSelect(callback) {\n    onColorSelectCallback = callback;\n}\nexports.onColorSelect = onColorSelect;\nfunction activeRobotChanged(color) {\n    activateButton(color);\n}\nexports.activeRobotChanged = activeRobotChanged;\nfunction activateButton(color) {\n    activeRobot = color;\n    buttons.forEach((button, i) => button.classList.toggle('selected', color === i));\n}\nfunction clickHandler(e) {\n    const button = e.target;\n    if (!button)\n        return;\n    const colorStr = button.dataset.color;\n    if (!colorStr)\n        return;\n    activateButton(parseInt(colorStr));\n    onColorSelectCallback(parseInt(colorStr));\n}\n\n\n//# sourceURL=webpack:///./src/components/color-controls.ts?");

/***/ }),

/***/ "./src/components/dialog.ts":
/*!**********************************!*\
  !*** ./src/components/dialog.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.openModal = void 0;\nfunction openModal(html) {\n    const dialog = document.createElement('dialog');\n    const dialogCloseButton = document.createElement('button');\n    dialogCloseButton.classList.add(\"button\");\n    dialogCloseButton.innerText = \"OK\";\n    const actionFooter = document.createElement('div');\n    actionFooter.classList.add('dialog-actions');\n    actionFooter.appendChild(dialogCloseButton);\n    const dialogForm = document.createElement('form');\n    dialogForm.method = 'dialog';\n    dialogForm.innerHTML = html;\n    dialogForm.appendChild(actionFooter);\n    document.body.appendChild(dialog);\n    dialog.appendChild(dialogForm);\n    dialog.showModal();\n}\nexports.openModal = openModal;\n\n\n//# sourceURL=webpack:///./src/components/dialog.ts?");

/***/ }),

/***/ "./src/game-board.ts":
/*!***************************!*\
  !*** ./src/game-board.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.onRobotClick = exports.setActiveRobot = exports.moveRobot = exports.setRobotsPositions = exports.loadLevel = void 0;\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\nconst Board_1 = __webpack_require__(/*! ./models/Board */ \"./src/models/Board.ts\");\nconst Game = __webpack_require__(/*! ./game */ \"./src/game.ts\");\nconst Direction_1 = __webpack_require__(/*! ./models/Direction */ \"./src/models/Direction.ts\");\nconst TOUCH_MOVE_LENGTH = 40;\nconst boardElem = utils_1.getElementById('board');\nlet robotClickCallback;\nlet robotElems;\nlet touchingIndex = null;\nlet touchStart;\ndocument.addEventListener('touchend', _ => touchingIndex = null);\ndocument.addEventListener('touchmove', touchMove, { passive: true });\nfunction loadLevel(level) {\n    const html = createHTMLBoard(level);\n    boardElem.innerHTML = html;\n    robotElems = level.robots.map(r => {\n        const elem = document.createElement('div');\n        elem.classList.add('robot', 'robot-' + r.color);\n        elem.innerText = (r.color + 1).toString();\n        elem.addEventListener('click', _ => robotClick(r.color));\n        elem.addEventListener('touchstart', e => robotTouch(e, r.color), { passive: true });\n        return elem;\n    });\n    robotElems.forEach(robotElem => {\n        boardElem.appendChild(robotElem);\n    });\n    setRobotsPositions(level.robots);\n}\nexports.loadLevel = loadLevel;\nfunction setRobotsPositions(robots) {\n    robots.forEach((robot, i) => {\n        moveRobot(i, robot.getPos());\n    });\n}\nexports.setRobotsPositions = setRobotsPositions;\nfunction moveRobot(robotIndex, newPos) {\n    moveRobotElem(robotElems[robotIndex], newPos);\n}\nexports.moveRobot = moveRobot;\nfunction setActiveRobot(robotIndex) {\n    robotElems.forEach((r, i) => {\n        r.classList.toggle('active', i === robotIndex);\n    });\n}\nexports.setActiveRobot = setActiveRobot;\nfunction moveRobotElem(robot, newPos) {\n    robot.style.transform = `translate(${newPos.x * 38 + 10}px, ${newPos.y * 38 + 10}px)`;\n}\nfunction robotClick(robotIndex) {\n    if (robotClickCallback) {\n        robotClickCallback(robotIndex);\n    }\n}\nfunction onRobotClick(callback) {\n    robotClickCallback = callback;\n}\nexports.onRobotClick = onRobotClick;\nfunction robotTouch(e, robotIndex) {\n    touchingIndex = robotIndex;\n    touchStart = { x: e.touches[0].screenX, y: e.touches[0].screenY };\n    if (robotClickCallback) {\n        robotClickCallback(robotIndex);\n    }\n}\nfunction touchMove(e) {\n    if (touchingIndex === null)\n        return;\n    const touchNow = { x: e.touches[0].screenX, y: e.touches[0].screenY };\n    const diff = { x: touchStart.x - touchNow.x, y: touchStart.y - touchNow.y };\n    if (Math.abs(diff.x) > TOUCH_MOVE_LENGTH && Math.abs(diff.y) < TOUCH_MOVE_LENGTH / 2) {\n        Game.moveActiveRobot(diff.x > 0 ? Direction_1.Direction.LEFT : Direction_1.Direction.RIGHT);\n        touchingIndex = null;\n        touchStart = null;\n    }\n    else if (Math.abs(diff.y) > TOUCH_MOVE_LENGTH && Math.abs(diff.x) < TOUCH_MOVE_LENGTH / 2) {\n        Game.moveActiveRobot(diff.y > 0 ? Direction_1.Direction.UP : Direction_1.Direction.DOWN);\n        touchingIndex = null;\n        touchStart = null;\n    }\n}\nfunction createHTMLBoard(level) {\n    return \"<table class='boardTable'><tr>\" + level.board.tiles.map((row, y) => row.map((walls, x) => {\n        let text = '';\n        const classes = [];\n        if (walls & Board_1.Wall.NORTH)\n            classes.push('wall-north');\n        if (walls & Board_1.Wall.EAST)\n            classes.push('wall-east');\n        if (walls & Board_1.Wall.WEST)\n            classes.push('wall-west');\n        if (walls & Board_1.Wall.SOUTH)\n            classes.push('wall-south');\n        if (level.goal.x === x && level.goal.y === y) {\n            text = `<div class=\"goal goal-${level.goal.color}\"></div>`;\n        }\n        level.robots.forEach(robot => {\n            if (robot.x === x && robot.y === y) {\n                text = `<div class=\"start start-${robot.color}\"></div>`;\n            }\n        });\n        return `<td class='${classes.join(' ')}'>${text}</td>`;\n    }).join('')).join('</tr><tr>') + '</tr></table>';\n}\n\n\n//# sourceURL=webpack:///./src/game-board.ts?");

/***/ }),

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.showSolution = exports.switchRobot = exports.moveRobot = exports.moveActiveRobot = exports.setRobotPosition = exports.setRobotsPostitions = exports.resetRobots = exports.resetLevel = exports.loadLevel = void 0;\nconst Robot_1 = __webpack_require__(/*! ./models/Robot */ \"./src/models/Robot.ts\");\nconst solver_service_1 = __webpack_require__(/*! ./solver-service */ \"./src/solver-service.ts\");\nconst GameBoard = __webpack_require__(/*! ./game-board */ \"./src/game-board.ts\");\nconst Direction_1 = __webpack_require__(/*! ./models/Direction */ \"./src/models/Direction.ts\");\nconst solver_utils_1 = __webpack_require__(/*! ./solver-utils */ \"./src/solver-utils.ts\");\nconst ActiveRoute = __webpack_require__(/*! ./active-route */ \"./src/active-route.ts\");\nconst ColorControls = __webpack_require__(/*! ./components/color-controls */ \"./src/components/color-controls.ts\");\nconst dialog_1 = __webpack_require__(/*! ./components/dialog */ \"./src/components/dialog.ts\");\nlet level;\nlet robots;\nlet activeRobotIndex = 0;\nconst moveQueue = [];\nlet processingMoveQueue = false;\nfunction loadLevel(loadedlevel) {\n    const backAgain = false;\n    level = loadedlevel;\n    solver_service_1.solve(level, backAgain);\n    ColorControls.createButtons(level.robots.length);\n    GameBoard.loadLevel(level);\n    resetLevel();\n}\nexports.loadLevel = loadLevel;\nfunction resetLevel() {\n    resetRobots();\n    switchRobot(0);\n    ActiveRoute.reset();\n}\nexports.resetLevel = resetLevel;\nfunction resetRobots() {\n    robots = Robot_1.cloneRobots(level.robots);\n    setRobotsPostitions(robots);\n}\nexports.resetRobots = resetRobots;\nfunction setRobotsPostitions(robots) {\n    robots.forEach((robot, i) => {\n        setRobotPosition(i, robot.getPos());\n    });\n}\nexports.setRobotsPostitions = setRobotsPostitions;\nfunction setRobotPosition(robotIndex, newPos) {\n    robots[robotIndex].setPos(newPos);\n    GameBoard.moveRobot(robotIndex, newPos);\n}\nexports.setRobotPosition = setRobotPosition;\nfunction moveActiveRobot(direction) {\n    addToMoveQueue(activeRobotIndex, direction);\n}\nexports.moveActiveRobot = moveActiveRobot;\nfunction moveRobot(robotIndex, direction) {\n    const moveFunction = getMoveFunction(direction);\n    const otherRobots = robots.filter(r => r.color !== robotIndex);\n    const newPos = moveFunction(level.board, robots[robotIndex], otherRobots);\n    if (!newPos)\n        return;\n    setRobotPosition(robotIndex, newPos.pos);\n    // gameBoard.moveRobot(activeRobotIndex, newPos.pos)\n    ActiveRoute.addMove(robotIndex, direction, Robot_1.cloneRobots(robots));\n    if (goalIsReached()) {\n        setTimeout(() => {\n            const result = solver_service_1.getResult();\n            if (!result || result.isAborted) {\n                dialog_1.openModal(\"Grattis, du klarade det innan solvern\");\n                return;\n            }\n            if (result && result.isAllStatesChecked) {\n                dialog_1.openModal(\"Öööö... du klarade en omöjlig bana?!\");\n                return;\n            }\n            const score = calculateScore(ActiveRoute.getMovesCount(), result.route.length);\n            const scoreText = [, 'Bättre kan du', 'Bra gjort!', 'Perfekt!'];\n            dialog_1.openModal(scoreText[score] + '<br>' + '⭐'.repeat(score));\n        }, 400);\n    }\n}\nexports.moveRobot = moveRobot;\nfunction switchRobot(index) {\n    if (index < 0 || index > robots.length - 1)\n        return;\n    activeRobotIndex = index;\n    GameBoard.setActiveRobot(index);\n    ColorControls.activeRobotChanged(index);\n}\nexports.switchRobot = switchRobot;\nfunction getMoveFunction(direction) {\n    switch (direction) {\n        case Direction_1.Direction.UP: return solver_utils_1.goNorth;\n        case Direction_1.Direction.LEFT: return solver_utils_1.goWest;\n        case Direction_1.Direction.RIGHT: return solver_utils_1.goEast;\n        case Direction_1.Direction.DOWN: return solver_utils_1.goSouth;\n    }\n}\nfunction goalIsReached() {\n    const correctRobot = robots[level.goal.color];\n    return correctRobot.x === level.goal.x && correctRobot.y === level.goal.y;\n}\nfunction calculateScore(moves, optimalMoves) {\n    if (moves === optimalMoves)\n        return 3;\n    if (moves <= 1 + Math.floor(optimalMoves * 1.3))\n        return 2;\n    return 1;\n}\nfunction addToMoveQueue(robotIndex, direction) {\n    moveQueue.push({ robotIndex, direction });\n    if (processingMoveQueue)\n        return;\n    processMoveQueue();\n}\nfunction processMoveQueue() {\n    const nextMove = moveQueue.shift();\n    if (!nextMove) {\n        processingMoveQueue = false;\n        return;\n    }\n    processingMoveQueue = true;\n    //switchRobot(nextMove.robotIndex)\n    moveRobot(nextMove.robotIndex, nextMove.direction);\n    setTimeout(processMoveQueue, 400);\n}\nfunction showSolution() {\n    const result = solver_service_1.getResult();\n    if (!result)\n        return;\n    resetLevel();\n    moveQueue.length = 0;\n    const dirToDirection = new Map([['upp', Direction_1.Direction.UP], ['ner', Direction_1.Direction.DOWN], ['vänster', Direction_1.Direction.LEFT], ['höger', Direction_1.Direction.RIGHT]]);\n    moveQueue.push(...result.route.map(step => {\n        const direction = dirToDirection.get(step.dir);\n        if (!direction)\n            throw Error(\"Unknown direction:\" + step.dir);\n        return { direction, robotIndex: step.color };\n    }));\n    setTimeout(processMoveQueue, 400);\n}\nexports.showSolution = showSolution;\n\n\n//# sourceURL=webpack:///./src/game.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst Level_1 = __webpack_require__(/*! ./models/Level */ \"./src/models/Level.ts\");\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\nconst ColorControls = __webpack_require__(/*! ./components/color-controls */ \"./src/components/color-controls.ts\");\nconst Game = __webpack_require__(/*! ./game */ \"./src/game.ts\");\nconst GameBoard = __webpack_require__(/*! ./game-board */ \"./src/game-board.ts\");\nconst Direction_1 = __webpack_require__(/*! ./models/Direction */ \"./src/models/Direction.ts\");\nconst service_worker_1 = __webpack_require__(/*! ./service-worker */ \"./src/service-worker.ts\");\n/*\n\n!!!IMPROVEMENTS!!!\n\n* om två hjälprobotar byter plats är det ett redan besökt state ---- KLAR!\n* om en hjälprobot kommer tillbaka till en plats utan att ha krockat med någon annan är det ett onödigt drag\n\n!!!!!!!!!!!!!!!!!!!!!\n\n\n\n\n1drag = 4^2 = 16\n2drag = 4^3 = 64\n3drag = 4^4 = 256\n4drag = 4^5 = 1024\n5drag = 4^6 = 4096\n6drag = 4^7 = 16384\n7drag = 4^8 = 65536\n8drag = 4^9 = 262144\nRIMLIGT??\n\n\n* There and back again\n\n* show and play solution\n\n* move robots with keyboard\n  - wasd of arrow-keys to move\n  - 1-x to switch robot\n\n* move robots with touch\n  - swipe on robots to move\n  - virtual controls with arrows and color buttons to change robot\n\n* solver info\n  - service worker\n  - status indicator\n  - click to show\n    - states checked\n    - best route\n    - solve duration\n  - inform user if a level is impossible / too hard?\n\n* Defined levels in different difficulty groups Easy/Medium/Hard\n\n* Collect stars.\n  1 star complete the level  >125%\n  2 stars complete within 5 moves or %? 100-125%\n  3 stars complete with best route 100%\n  \n  * Save progress in local storage\n  \n*/\nlet level;\n// let gameBoard: GameBoard\nservice_worker_1.registerServiceWorker();\nstartup();\nutils_1.getButton('btnUp').addEventListener('click', _ => Game.moveActiveRobot(Direction_1.Direction.UP));\nutils_1.getButton('btnLeft').addEventListener('click', _ => Game.moveActiveRobot(Direction_1.Direction.LEFT));\nutils_1.getButton('btnRight').addEventListener('click', _ => Game.moveActiveRobot(Direction_1.Direction.RIGHT));\nutils_1.getButton('btnDown').addEventListener('click', _ => Game.moveActiveRobot(Direction_1.Direction.DOWN));\ndocument.body.addEventListener('keydown', keyHandler);\nutils_1.getButton('btnShowSolution').addEventListener('click', Game.showSolution);\nutils_1.getButton('btnNewGame').addEventListener('click', _ => newGame());\nfunction startup() {\n    const seedStr = location.hash.substr(1);\n    newGame(seedStr ? parseInt(seedStr) : undefined);\n    ColorControls.onColorSelect(color => Game.switchRobot(color));\n    GameBoard.onRobotClick(robotClick);\n}\nfunction robotClick(robotIndex) {\n    Game.switchRobot(robotIndex);\n}\nfunction keyHandler(e) {\n    if (e.key.match(/^\\d$/)) {\n        Game.switchRobot(parseInt(e.key) - 1);\n    }\n    switch (e.key) {\n        case 'F2':\n            newGame();\n            break;\n        case 'Escape':\n            Game.resetLevel();\n            break;\n        case 'ArrowUp':\n            Game.moveActiveRobot(Direction_1.Direction.UP);\n            break;\n        case 'ArrowLeft':\n            Game.moveActiveRobot(Direction_1.Direction.LEFT);\n            break;\n        case 'ArrowRight':\n            Game.moveActiveRobot(Direction_1.Direction.RIGHT);\n            break;\n        case 'ArrowDown':\n            Game.moveActiveRobot(Direction_1.Direction.DOWN);\n            break;\n    }\n}\nfunction newGame(seed = Math.floor(Math.random() * 1000000)) {\n    location.hash = seed.toString();\n    level = new Level_1.Level({\n        width: 10,\n        height: 10,\n        robotCount: 4,\n        seed\n    });\n    Game.loadLevel(level);\n    // gameBoard = new GameBoard(level.board.tiles, level.robots.map(r => ({x: r.x, y: r.y})), level.goal)\n}\nwindow.addEventListener('beforeinstallprompt', (beforeInstallEvent) => {\n    beforeInstallEvent.preventDefault();\n    const installButton = document.getElementById(\"btnInstall\");\n    installButton.hidden = false;\n    installButton.onclick = () => beforeInstallEvent.prompt();\n});\n\n\n//# sourceURL=webpack:///./src/index.ts?");

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
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.Goal = void 0;\nclass Goal {\n    constructor(x, y, color) {\n        this.x = x;\n        this.y = y;\n        this.color = color;\n    }\n}\nexports.Goal = Goal;\n\n\n//# sourceURL=webpack:///./src/models/Goal.ts?");

/***/ }),

/***/ "./src/models/Level.ts":
/*!*****************************!*\
  !*** ./src/models/Level.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.Level = void 0;\nconst Board_1 = __webpack_require__(/*! ./Board */ \"./src/models/Board.ts\");\nconst Robot_1 = __webpack_require__(/*! ./Robot */ \"./src/models/Robot.ts\");\nconst Goal_1 = __webpack_require__(/*! ./Goal */ \"./src/models/Goal.ts\");\nconst Slumpa = __webpack_require__(/*! ../libs/Slumpa */ \"./src/libs/Slumpa.ts\");\nconst LEVEL_STRING_DELIMITER = '|';\nclass Level {\n    constructor(input) {\n        if (typeof input === \"string\") {\n            const levelString = input;\n            const [widthStr, tiles, goalStr, ...robotsStr] = levelString.split(LEVEL_STRING_DELIMITER);\n            const width = parseInt(widthStr);\n            const height = tiles.length / width;\n            const goal = parseInt(goalStr);\n            this.goal = new Goal_1.Goal(goal % width, Math.floor(goal / width), 0);\n            this.robots = robotsStr.map(Number).map((r, i) => new Robot_1.Robot(i, r % width, Math.floor(r / width)));\n            this.board = new Board_1.Board(height, width);\n            this.board.setTiles(tiles);\n        }\n        else {\n            const { board, robots, goal } = generateLevelData(input);\n            this.board = board;\n            this.robots = robots;\n            this.goal = goal;\n        }\n    }\n    pos2num(pos) {\n        return pos.x + pos.y * this.board.w;\n    }\n    getLevelString() {\n        const goalStr = this.pos2num(this.goal);\n        const tiles = this.board.getTilesString();\n        const robotsStr = this.robots.map(r => this.pos2num(r)).join(LEVEL_STRING_DELIMITER);\n        return `${this.board.w}|${tiles}|${goalStr}|${robotsStr}`;\n    }\n}\nexports.Level = Level;\nfunction generateLevelData({ width, height, seed, robotCount }) {\n    Slumpa.setSeed(seed);\n    const board = new Board_1.Board(height, width);\n    board.addRandomWalls(width * height / 5);\n    const availableTiles = [];\n    for (let x = 0; x < board.w; x++) {\n        for (let y = 0; y < board.h; y++) {\n            availableTiles.push({ x, y });\n        }\n    }\n    const randomTiles = Slumpa.shuffle(availableTiles);\n    const robots = new Array(robotCount).fill(null).map((_, i) => {\n        const tile = randomTiles.pop();\n        return new Robot_1.Robot(i, tile.x, tile.y);\n    });\n    const tile = randomTiles.pop();\n    const color = 0; //Math.floor(Math.random()*robots)\n    const goal = new Goal_1.Goal(tile.x, tile.y, color);\n    return { goal, robots, board };\n}\n\n\n//# sourceURL=webpack:///./src/models/Level.ts?");

/***/ }),

/***/ "./src/models/Robot.ts":
/*!*****************************!*\
  !*** ./src/models/Robot.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.cloneRobots = exports.Robot = void 0;\nclass Robot {\n    constructor(id, x, y) {\n        this.id = id;\n        this.color = id;\n        this.x = x;\n        this.y = y;\n    }\n    getPos() {\n        return { x: this.x, y: this.y };\n    }\n    setPos(pos) {\n        this.x = pos.x;\n        this.y = pos.y;\n    }\n    clone() {\n        return new Robot(this.id, this.x, this.y);\n    }\n}\nexports.Robot = Robot;\nfunction cloneRobots(robots) {\n    return robots.map(r => r.clone());\n}\nexports.cloneRobots = cloneRobots;\n\n\n//# sourceURL=webpack:///./src/models/Robot.ts?");

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

/***/ "./src/service-worker.ts":
/*!*******************************!*\
  !*** ./src/service-worker.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.registerServiceWorker = void 0;\nfunction registerServiceWorker() {\n    return __awaiter(this, void 0, void 0, function* () {\n        if (!('serviceWorker' in navigator)) {\n            console.warn(\"Service worker not available\");\n            return;\n        }\n        let refreshing = false;\n        navigator.serviceWorker.addEventListener('controllerchange', e => {\n            const serviceWorkerContainer = e.target;\n            if (!serviceWorkerContainer.controller) {\n                console.debug(\"Client: NO Controller =(\");\n                return;\n            }\n            if (refreshing)\n                return;\n            refreshing = true;\n            console.debug(\"Client: RELOAD\");\n            location.reload();\n        });\n        navigator.serviceWorker.onmessage = function (e) {\n            console.debug(\"Client: Message form Client:\", e.data);\n        };\n        console.debug(\"Client: Register service worker\");\n        const registration = yield navigator.serviceWorker.register('sw.js');\n        console.debug(\"Client: Service worker registered\");\n        if (!navigator.serviceWorker.controller) {\n            // no service worker active, first visit\n            console.debug(\"Client: First visit?\");\n            return;\n        }\n        if (registration.waiting) {\n            console.debug(\"Client: New worker ready to be installed\");\n            updateReady(registration.waiting);\n        }\n        else if (registration.installing) {\n            console.debug(\"Client: New worker is beeing installed\");\n            trackInstalling(registration.installing);\n        }\n        else {\n            registration.onupdatefound = e => {\n                console.debug(\"Client: New worker found, track installation\");\n                trackInstalling(registration.installing);\n            };\n        }\n    });\n}\nexports.registerServiceWorker = registerServiceWorker;\nfunction trackInstalling(worker) {\n    worker.onstatechange = () => {\n        console.debug(\"Client: State changed\", worker.state);\n        if (worker.state === 'installed') {\n            updateReady(worker);\n        }\n    };\n}\nfunction updateReady(worker) {\n    console.debug(\"Client: Update ready, send skip soooon!\");\n    setTimeout(() => worker.postMessage({ action: 'skipWaiting' }), 1000);\n}\n\n\n//# sourceURL=webpack:///./src/service-worker.ts?");

/***/ }),

/***/ "./src/solver-service.ts":
/*!*******************************!*\
  !*** ./src/solver-service.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.getResult = exports.solve = void 0;\nconst SolverWokerMessages_1 = __webpack_require__(/*! ./models/SolverWokerMessages */ \"./src/models/SolverWokerMessages.ts\");\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\nconst colorNames = ['röd', 'grön', 'blå', 'gul'];\nlet solverWorker;\nlet result;\nlet progress;\nconst solverButton = utils_1.getButton('btnSolver');\nconst solverInfo = utils_1.getElementById('solverInfo');\nconst dialog = utils_1.getElementById('solverDialog');\nconst setSolverButtonIcon = (icon) => solverButton.children[0].children[0].setAttribute('xlink:href', `icons.svg#icon-${icon}`);\nsolverButton.addEventListener('click', _ => dialog.showModal());\nconst showSolutionButton = utils_1.getButton('btnShowSolution');\nshowSolutionButton.addEventListener('click', _ => dialog.close());\nfunction solve(level, backAgain = false) {\n    if (solverWorker) {\n        solverWorker.terminate();\n    }\n    result = null;\n    setSolverButtonIcon('spinner');\n    solverButton.classList.add(\"rotate\");\n    showSolutionButton.hidden = true;\n    solverWorker = new Worker('js/solver-worker.js');\n    solverWorker.onmessage = onWorkerMessage;\n    solverWorker.postMessage({ type: SolverWokerMessages_1.SolverWorkerMessage.SOLVE, levelString: level.getLevelString(), backAgain });\n}\nexports.solve = solve;\nfunction getResult() {\n    return result;\n}\nexports.getResult = getResult;\nfunction onWorkerMessage(e) {\n    switch (e.data.type) {\n        case SolverWokerMessages_1.SolverWorkerMessage.SOLVE_END: {\n            result = e.data.result;\n            solverButton.classList.remove(\"rotate\");\n            if (result.isRouteFound) {\n                setSolverButtonIcon('check');\n                const usedRobots = result.robotsUsed.map(r => colorNames[r]).join(', ');\n                solverInfo.innerHTML = `\n          En lösning på ${result.route.length} drag hittades!<br>\n          Använde robotarna: ${usedRobots}<br>\n          ${result.statesChecked} states letades igenom på \n          ${result.duration} sekunder\n        `;\n                showSolutionButton.hidden = false;\n            }\n            else if (result.isAllStatesChecked) {\n                setSolverButtonIcon('impossible');\n                solverInfo.innerHTML = `\n          Ingen lösning kunde hittas. Omöjlig!<br>\n          ${result.statesChecked} states letades igenom på \n          ${result.duration} sekunder\n        `;\n            }\n            else {\n                setSolverButtonIcon('info');\n                solverInfo.innerHTML = `\n          Orkade inte leta klar.<br>\n          ${result.statesChecked} states letades igenom på \n          ${result.duration} sekunder\n        `;\n            }\n            break;\n        }\n        case SolverWokerMessages_1.SolverWorkerMessage.SOLVE_PROGRESS: {\n            progress = e.data.progress;\n            solverInfo.innerHTML = `\n        ${progress.checkedStates} states undersökta<br>\n        Letar nu efter lösningar med ${progress.currentMovesCount} drag\n      `;\n            break;\n        }\n        default: {\n            throw Error(\"Unknown message from web worker: \" + e.data.type);\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/solver-service.ts?");

/***/ }),

/***/ "./src/solver-utils.ts":
/*!*****************************!*\
  !*** ./src/solver-utils.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.hasWall = exports.goEast = exports.goWest = exports.goSouth = exports.goNorth = void 0;\nconst Board_1 = __webpack_require__(/*! ./models/Board */ \"./src/models/Board.ts\");\nfunction goNorth(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotY = Math.max(...otherRobots.filter(r => r.x === pos.x && r.y < pos.y).map(r => r.y));\n    for (; pos.y > 0; pos.y--) {\n        if (pos.y - 1 === closestRobotY || hasWall(board, pos.x, pos.y, Board_1.Wall.NORTH))\n            break;\n    }\n    if (pos.y === robot.y)\n        return null;\n    return { pos, dir: 'upp' };\n}\nexports.goNorth = goNorth;\nfunction goSouth(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotY = Math.min(...otherRobots.filter(r => r.x === robot.x && r.y > pos.y).map(r => r.y));\n    for (; pos.y < board.h; pos.y++) {\n        if (pos.y + 1 === closestRobotY || hasWall(board, robot.x, pos.y, Board_1.Wall.SOUTH))\n            break;\n    }\n    if (pos.y === robot.y)\n        return null;\n    return { pos, dir: 'ner' };\n}\nexports.goSouth = goSouth;\nfunction goWest(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotX = Math.max(...otherRobots.filter(r => r.y === pos.y && r.x < pos.x).map(r => r.x));\n    for (; pos.x > 0; pos.x--) {\n        if (pos.x - 1 === closestRobotX || hasWall(board, pos.x, pos.y, Board_1.Wall.WEST))\n            break;\n    }\n    if (pos.x === robot.x)\n        return null;\n    return { pos, dir: 'vänster' };\n}\nexports.goWest = goWest;\nfunction goEast(board, robot, otherRobots) {\n    const pos = { x: robot.x, y: robot.y };\n    const closestRobotX = Math.min(...otherRobots.filter(r => r.y === pos.y && r.x > pos.x).map(r => r.x));\n    for (; pos.x < board.w; pos.x++) {\n        if (pos.x + 1 === closestRobotX || hasWall(board, pos.x, pos.y, Board_1.Wall.EAST))\n            break;\n    }\n    if (pos.x === robot.x)\n        return null;\n    return { pos, dir: 'höger' };\n}\nexports.goEast = goEast;\nfunction hasWall(board, x, y, wall) {\n    return (board.tiles[y][x] & wall) !== 0;\n}\nexports.hasWall = hasWall;\n\n\n//# sourceURL=webpack:///./src/solver-utils.ts?");

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.getButton = exports.getElementById = void 0;\nfunction getElementById(id) {\n    const elem = document.getElementById(id);\n    if (!elem)\n        throw Error(\"Could not find element \" + id);\n    return elem;\n}\nexports.getElementById = getElementById;\nfunction getButton(id) {\n    return getElementById(id);\n}\nexports.getButton = getButton;\n\n\n//# sourceURL=webpack:///./src/utils.ts?");

/***/ })

/******/ });