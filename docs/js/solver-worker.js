!function(t){var e={};function o(s){if(e[s])return e[s].exports;var r=e[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=t,o.c=e,o.d=function(t,e,s){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(o.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(s,r,function(e){return t[e]}.bind(null,r));return s},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=18)}([function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Wall=void 0,function(t){t[t.UP=1]="UP",t[t.LEFT=2]="LEFT",t[t.RIGHT=4]="RIGHT",t[t.DOWN=8]="DOWN"}(e.Wall||(e.Wall={}))},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Direction=void 0,function(t){t.UP="UP",t.LEFT="LEFT",t.RIGHT="RIGHT",t.DOWN="DOWN"}(e.Direction||(e.Direction={}))},function(t,e,o){"use strict";let s,r;function n(t,e){if(null==t)throw new Error("Invalid parameters, enter max, or max and min values");if(null==e&&(e=0),t<e)var o=t,s=e;else o=e,s=t;return o+Math.floor(l()*(s+1-o))}function i(t,e){if(null==t)throw new Error("Invalid parameters, enter max, or max and min values");if(null==e&&(e=0),t<e)var o=t,s=e;else o=e,s=t;return o+l()*(s-o)}Object.defineProperty(e,"__esModule",{value:!0}),e.getHash=e.shuffleCopy=e.shuffle=e.getSeed=e.setRandomSeed=e.setSeed=e.randomOne=e.randomItems=e.randomBool=e.randomFloats=e.randomFloat=e.randomInts=e.randomInt=void 0,h(),e.randomInt=n,e.randomInts=function(t,e,o){for(var s=[],r=0;r<t;r++)s.push(n(e,o));return s},e.randomFloat=i,e.randomFloats=function(t,e,o){for(var s=[],r=0;r<t;r++)s.push(i(e,o));return s},e.randomBool=function(t){return void 0===t&&(t=.5),l()<t},e.randomItems=function(t,e,o){if(o){for(var s=[],r=0;r<e;r++)s.push(t[n(0,t.length-1)]);return s}return(t=d(t)).slice(0,e)},e.randomOne=function(t){return t[n(0,t.length-1)]};var a,l=(a=Math.pow(2,32),function(){return r=(1664525*r+1013904223)%a,r/a});function u(t){s=t,r=t}function h(){u(Math.floor(Math.random()*Number.MAX_SAFE_INTEGER))}function c(t){var e,o,s;for(s=t.length;s;s-=1)e=Math.floor(l()*s),o=t[s-1],t[s-1]=t[e],t[e]=o;return t}function d(t){return c(t.slice(0))}e.setSeed=u,e.setRandomSeed=h,e.getSeed=function(){return s},e.shuffle=c,e.shuffleCopy=d,e.getHash=function(t){var e,o,s=0;if(0===t.length)return s;for(e=0,o=t.length;e<o;e++)s=(s<<5)-s+t.charCodeAt(e),s|=0;return s}},,function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.cloneRobots=e.Robot=void 0;class s{constructor(t,e,o){this.idx=t,this.x=e,this.y=o}getPos(){return{x:this.x,y:this.y}}setPos(t){this.x=t.x,this.y=t.y}clone(){return new s(this.idx,this.x,this.y)}}e.Robot=s,e.cloneRobots=function(t){return t.map(t=>t.clone())}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Level=void 0;const s=o(6),r=o(4),n=o(7),i=o(2);e.Level=class{constructor(t){if("string"==typeof t){const e=t,[o,i,a,...l]=e.split("|"),u=parseInt(o),h=i.length/u,c=parseInt(a);this.goal=new n.Goal(c%u,Math.floor(c/u),0),this.robots=l.map(Number).map((t,e)=>new r.Robot(e,t%u,Math.floor(t/u))),this.board=new s.Board(h,u),this.board.setTiles(i)}else{const{board:e,robots:o,goal:a}=function({width:t,height:e,wallsCount:o,seed:a,robotCount:l}){i.setSeed(a);const u=new s.Board(e,t);u.addRandomWalls(o);const h=[];for(let t=0;t<u.w;t++)for(let e=0;e<u.h;e++)h.push({x:t,y:e});const c=i.shuffle(h),d=new Array(l).fill(null).map((t,e)=>{const o=c.pop();return new r.Robot(e,o.x,o.y)}),f=c.pop();return{goal:new n.Goal(f.x,f.y,0),robots:d,board:u}}(t);this.board=e,this.robots=o,this.goal=a}}pos2num(t){return t.x+t.y*this.board.w}getLevelString(){const t=this.pos2num(this.goal),e=this.board.getTilesString(),o=this.robots.map(t=>this.pos2num(t)).join("|");return`${this.board.w}|${e}|${t}|${o}`}}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Board=void 0;const s=o(2),r=o(0);e.Board=class{constructor(t,e){this.h=t,this.w=e,this.tiles=new Array(t).fill(null).map(()=>new Array(e).fill(0)),this.addTopWalls(),this.addBottomWalls(),this.addLeftWalls(),this.addRightWalls()}getTilesString(){return this.tiles.map(t=>t.map(t=>t.toString(16)).join("")).join("")}setTiles(t){if(t.length!==this.w*this.h)throw Error(`Unable to set tiles. tiles.length was ${t.length}, expected ${this.w*this.h}`);const e=t.split("").map(t=>parseInt(t,16));this.tiles=new Array(this.h).fill(null).map((t,o)=>e.slice(o*this.w,o*this.w+this.w))}addWall(t,e,o){if(t<0||t>=this.w)throw Error(`x must be between 0 and ${this.w-1}, was: ${t}`);if(e<0||e>=this.h)throw Error(`y must be between 0 and ${this.h-1}, was: ${e}`);this.addSingleWall(t,e,o);const s=this.getTileBehindTheWall(t,e,o);if(s){const t=this.getOppositeWall(o);this.addSingleWall(s.x,s.y,t)}}addRandomWalls(t){let e=0,o=0;for(;e<t&&o<1e3;){o++;const t=s.randomOne([r.Wall.UP,r.Wall.RIGHT,r.Wall.LEFT,r.Wall.DOWN]),n=s.randomInt(0,this.w-1),i=s.randomInt(0,this.h-1);this.tiles[i][n]&t||(this.addWall(n,i,t),e++)}}addSingleWall(t,e,o){const s=this.tiles[e][t];this.tiles[e][t]=s|o}getTileBehindTheWall(t,e,o){return o===r.Wall.UP&&e>0?{x:t,y:e-1}:o===r.Wall.LEFT&&t>0?{x:t-1,y:e}:o===r.Wall.RIGHT&&t+1<this.w?{x:t+1,y:e}:o===r.Wall.DOWN&&e+1<this.h?{x:t,y:e+1}:null}getOppositeWall(t){switch(t){case r.Wall.UP:return r.Wall.DOWN;case r.Wall.DOWN:return r.Wall.UP;case r.Wall.RIGHT:return r.Wall.LEFT;case r.Wall.LEFT:return r.Wall.RIGHT;default:throw Error("Invalid wall "+t)}}addTopWalls(){for(let t=0;t<this.w;t++)this.addSingleWall(t,0,r.Wall.UP)}addBottomWalls(){for(let t=0;t<this.w;t++)this.addSingleWall(t,this.h-1,r.Wall.DOWN)}addLeftWalls(){for(let t=0;t<this.h;t++)this.addSingleWall(0,t,r.Wall.LEFT)}addRightWalls(){for(let t=0;t<this.h;t++)this.addSingleWall(this.w-1,t,r.Wall.RIGHT)}}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Goal=void 0;e.Goal=class{constructor(t,e,o){this.x=t,this.y=e,this.robotIdx=o}}},,function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SolverWorkerMessage=void 0,function(t){t.PING="PING",t.PONG="PONG",t.SOLVE="SOLVE",t.SOLVE_END="SOLVE_END",t.SOLVE_PROGRESS="SOLVE_PROGRESS"}(e.SolverWorkerMessage||(e.SolverWorkerMessage={}))},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.hasWall=e.goRight=e.goLeft=e.goDown=e.goUp=void 0;const s=o(1),r=o(0);function n(t,e,o){return 0!=(t.tiles[e.y][e.x]&o)}e.goUp=function(t,e,o){const i={x:e.x,y:e.y};if(n(t,i,r.Wall.UP))return null;const a=Math.max(...o.filter(t=>t.x===i.x&&t.y<i.y).map(t=>t.y));for(;i.y>0&&(i.y-1!==a&&!n(t,i,r.Wall.UP));i.y--);return i.y===e.y?null:{pos:i,robotIdx:e.idx,dir:s.Direction.UP}},e.goDown=function(t,e,o){const i={x:e.x,y:e.y};if(n(t,i,r.Wall.DOWN))return null;const a=Math.min(...o.filter(t=>t.x===i.x&&t.y>i.y).map(t=>t.y));for(;i.y<t.h&&(i.y+1!==a&&!n(t,i,r.Wall.DOWN));i.y++);return i.y===e.y?null:{pos:i,robotIdx:e.idx,dir:s.Direction.DOWN}},e.goLeft=function(t,e,o){const i={x:e.x,y:e.y};if(n(t,i,r.Wall.LEFT))return null;const a=Math.max(...o.filter(t=>t.y===i.y&&t.x<i.x).map(t=>t.x));for(;i.x>0&&(i.x-1!==a&&!n(t,i,r.Wall.LEFT));i.x--);return i.x===e.x?null:{pos:i,robotIdx:e.idx,dir:s.Direction.LEFT}},e.goRight=function(t,e,o){const i={x:e.x,y:e.y};if(n(t,i,r.Wall.RIGHT))return null;const a=Math.min(...o.filter(t=>t.y===i.y&&t.x>i.x).map(t=>t.x));for(;i.x<t.w&&(i.x+1!==a&&!n(t,i,r.Wall.RIGHT));i.x++);return i.x===e.x?null:{pos:i,robotIdx:e.idx,dir:s.Direction.RIGHT}},e.hasWall=n},,,,,,,,function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const s=o(19),r=o(9),n=o(5);function i(t){postMessage({type:r.SolverWorkerMessage.SOLVE_END,result:t}),close()}function a(t){postMessage({type:r.SolverWorkerMessage.SOLVE_PROGRESS,progress:t})}self.onmessage=function(t){switch(t.data.type){case r.SolverWorkerMessage.SOLVE:{const e=new n.Level(t.data.levelString),o=new s.Solver(e,{backAgain:t.data.backAgain});o.onComplete(i),o.onProgress(a),o.solve();break}default:throw Error("Worker recieved an unknown message"+t.data.type)}}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Solver=void 0;const s=o(10),r=o(20);function n(t){if(!t)return[];return(e=t.map(t=>t.lastMove.robotIdx),[...new Set(e)]).sort();var e}e.Solver=class{constructor(t,e={}){this.currentStateIndex=0,this.statesQueue=[],this.states=new Map,this.routeFound=!1,this.aborted=!1,this.allStatesChecked=!1,this.running=!1,this.progressRatio=1e3,this.duration=0,this.pos2num=t=>t.x+t.y*this.board.w,this.getStateHash=(t,e)=>{const o=t.slice(1).map(t=>t.posNum).sort().join("|");return t[0].posNum+(e?"Y":"N")+o};const{backAgain:o=!1,abortAfter:s=1e7}=e;this.board=t.board,this.robots=t.robots.map(t=>({...t,posNum:t.x+t.y*this.board.w})),this.goal=t.goal,this.goalTile=this.pos2num(this.goal),this.mainHomeTile=this.pos2num(this.robots[this.goal.robotIdx]),this.backAgain=o,this.abortAfter=s}solve(){const t=this.getStateHash(this.robots,!1);this.statesQueue.push(t),this.states.set(t,{moves:0,hash:t,lastMove:null,robots:this.robots.slice(),goalVisited:!1});const e=new Date;for(this.running=!0;this.running;)this.checkNext();this.duration=((new Date).getTime()-e.getTime())/1e3;const o=this.getResult();return this.completeCallback&&this.completeCallback(o),this.statesQueue.length=0,this.states.clear(),o}isRouteFound(){return this.routeFound}getResult(){return{duration:this.duration,statesChecked:this.currentStateIndex,isRouteFound:this.routeFound,isAllStatesChecked:this.allStatesChecked,isAborted:this.aborted,route:this.foundRoute,robotsUsed:n(this.foundRoute),minMoves:this.minMoves,timers:r.getTotals()}}onComplete(t){this.completeCallback=t}onProgress(t,e=1e3){this.progressRatio=e,this.progressCallback=t}checkNext(){if(this.currentStateIndex+1>this.statesQueue.length)return this.allStatesChecked=!0,void(this.running=!1);const t=this.statesQueue[this.currentStateIndex],e=this.states.get(t);if(this.currentStateIndex===this.abortAfter)return this.minMoves=e.moves,this.aborted=!0,void(this.running=!1);this.progressCallback&&this.currentStateIndex%this.progressRatio==0&&this.progressCallback({checkedStates:this.currentStateIndex,currentMovesCount:e.moves,timers:r.getAndClear()}),this.processState(e),this.currentStateIndex++}checkIfShortestRouteFound(t){if(t.lastMove.robotIdx!==this.goal.robotIdx)return;const e=t.robots[this.goal.robotIdx];this.isAtGoal(e)?(t.goalVisited=!0,this.backAgain||this.shortestRouteFound(t)):this.backAgain&&t.goalVisited&&this.isAtHome(e)&&this.shortestRouteFound(t)}isAtGoal(t){return t.posNum===this.goalTile}isAtHome(t){return t.posNum===this.mainHomeTile}shortestRouteFound(t){this.routeFound=!0,this.running=!1;let e=t;for(this.foundRoute=[];e.previous;){this.foundRoute.unshift(e);const t=this.states.get(e.previous);if(void 0===t)throw Error(`state ${e.previous} not found`);e=t}}processState(t){const e=[];for(const o of t.robots){const r=t.robots.filter(t=>t.idx!==o.idx),n=s.goUp(this.board,o,r);n&&e.push(n);const i=s.goLeft(this.board,o,r);i&&e.push(i);const a=s.goRight(this.board,o,r);a&&e.push(a);const l=s.goDown(this.board,o,r);l&&e.push(l)}for(let o of e){const e=t.robots.slice();e[o.robotIdx]={x:o.pos.x,y:o.pos.y,idx:o.robotIdx,posNum:this.pos2num(o.pos)};const s=this.getStateHash(e,t.goalVisited);if(this.states.has(s))continue;const r={hash:s,previous:t.hash,robots:e,lastMove:{direction:o.dir,robotIdx:o.robotIdx,from:{x:t.robots[o.robotIdx].x,y:t.robots[o.robotIdx].y},to:{x:o.pos.x,y:o.pos.y}},goalVisited:t.goalVisited,moves:t.moves+1};this.checkIfShortestRouteFound(r),this.statesQueue.push(r.hash),this.states.set(r.hash,r)}}}},function(t,e,o){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.getTotals=e.getAndClear=e.pauseTimer=e.startTimer=void 0;const o={},s={};e.startTimer=function(e){s[e]=t?t.hrtime():(new Date).getTime()},e.pauseTimer=function(e){let r;if(t){const o=t.hrtime(s[e]);r=1e3*o[0]+o[1]/1e6}else{const t=s[e];r=(new Date).getTime()-t}o[e]=(o[e]||0)+r,e.startsWith("total-")||(o["total-"+e]=(o["total-"+e]||0)+r)},e.getAndClear=function(){const t={};return Object.entries(o).forEach(([e,s])=>{e.startsWith("total-")||(t[e]=s,o[e]=0)}),t},e.getTotals=function(){const t={};return Object.entries(o).forEach(([e,o])=>{e.startsWith("total-")&&(t[e]=o)}),t}}).call(this,o(21))},function(t,e){var o,s,r=t.exports={};function n(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function a(t){if(o===setTimeout)return setTimeout(t,0);if((o===n||!o)&&setTimeout)return o=setTimeout,setTimeout(t,0);try{return o(t,0)}catch(e){try{return o.call(null,t,0)}catch(e){return o.call(this,t,0)}}}!function(){try{o="function"==typeof setTimeout?setTimeout:n}catch(t){o=n}try{s="function"==typeof clearTimeout?clearTimeout:i}catch(t){s=i}}();var l,u=[],h=!1,c=-1;function d(){h&&l&&(h=!1,l.length?u=l.concat(u):c=-1,u.length&&f())}function f(){if(!h){var t=a(d);h=!0;for(var e=u.length;e;){for(l=u,u=[];++c<e;)l&&l[c].run();c=-1,e=u.length}l=null,h=!1,function(t){if(s===clearTimeout)return clearTimeout(t);if((s===i||!s)&&clearTimeout)return s=clearTimeout,clearTimeout(t);try{s(t)}catch(e){try{return s.call(null,t)}catch(e){return s.call(this,t)}}}(t)}}function p(t,e){this.fun=t,this.array=e}function g(){}r.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var o=1;o<arguments.length;o++)e[o-1]=arguments[o];u.push(new p(t,e)),1!==u.length||h||a(f)},p.prototype.run=function(){this.fun.apply(null,this.array)},r.title="browser",r.browser=!0,r.env={},r.argv=[],r.version="",r.versions={},r.on=g,r.addListener=g,r.once=g,r.off=g,r.removeListener=g,r.removeAllListeners=g,r.emit=g,r.prependListener=g,r.prependOnceListener=g,r.listeners=function(t){return[]},r.binding=function(t){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(t){throw new Error("process.chdir is not supported")},r.umask=function(){return 0}}]);