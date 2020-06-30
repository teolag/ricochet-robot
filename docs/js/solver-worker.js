!function(t){var e={};function s(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=t,s.c=e,s.d=function(t,e,o){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(s.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)s.d(o,r,function(e){return t[e]}.bind(null,r));return o},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=17)}([function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Board=e.Wall=void 0;const o=s(1);var r;!function(t){t[t.NORTH=1]="NORTH",t[t.WEST=2]="WEST",t[t.EAST=4]="EAST",t[t.SOUTH=8]="SOUTH"}(r=e.Wall||(e.Wall={}));e.Board=class{constructor(t,e){this.h=t,this.w=e,this.tiles=new Array(t).fill(null).map(()=>new Array(e).fill(0)),this.addTopWalls(),this.addBottomWalls(),this.addLeftWalls(),this.addRightWalls()}getTilesString(){return this.tiles.map(t=>t.map(t=>t.toString(16)).join("")).join("")}setTiles(t){if(t.length!==this.w*this.h)throw Error(`Unable to set tiles. tiles.length was ${t.length}, expected ${this.w*this.h}`);const e=t.split("").map(t=>parseInt(t,16));this.tiles=new Array(this.h).fill(null).map((t,s)=>e.slice(s*this.w,s*this.w+this.w))}addWall(t,e,s){if(t<0||t>=this.w)throw Error(`x must be between 0 and ${this.w-1}, was: ${t}`);if(e<0||e>=this.h)throw Error(`y must be between 0 and ${this.h-1}, was: ${e}`);this.addSingleWall(t,e,s);const o=this.getTileBehindTheWall(t,e,s);if(o){const t=this.getOppositeWall(s);this.addSingleWall(o.x,o.y,t)}}addRandomWalls(t){let e=0,s=0;for(;e<t&&s<1e3;){s++;const t=o.randomOne([r.NORTH,r.EAST,r.WEST,r.SOUTH]),i=o.randomInt(0,this.w-1),n=o.randomInt(0,this.h-1);this.tiles[n][i]&t||(this.addWall(i,n,t),e++)}}addSingleWall(t,e,s){const o=this.tiles[e][t];this.tiles[e][t]=o|s}getTileBehindTheWall(t,e,s){return s===r.NORTH&&e>0?{x:t,y:e-1}:s===r.WEST&&t>0?{x:t-1,y:e}:s===r.EAST&&t+1<this.w?{x:t+1,y:e}:s===r.SOUTH&&e+1<this.h?{x:t,y:e+1}:null}getOppositeWall(t){switch(t){case r.NORTH:return r.SOUTH;case r.SOUTH:return r.NORTH;case r.EAST:return r.WEST;case r.WEST:return r.EAST;default:throw Error("Invalid wall "+t)}}addTopWalls(){for(let t=0;t<this.w;t++)this.addSingleWall(t,0,r.NORTH)}addBottomWalls(){for(let t=0;t<this.w;t++)this.addSingleWall(t,this.h-1,r.SOUTH)}addLeftWalls(){for(let t=0;t<this.h;t++)this.addSingleWall(0,t,r.WEST)}addRightWalls(){for(let t=0;t<this.h;t++)this.addSingleWall(this.w-1,t,r.EAST)}}},function(t,e,s){"use strict";let o,r;function i(t,e){if(null==t)throw new Error("Invalid parameters, enter max, or max and min values");if(null==e&&(e=0),t<e)var s=t,o=e;else s=e,o=t;return s+Math.floor(l()*(o+1-s))}function n(t,e){if(null==t)throw new Error("Invalid parameters, enter max, or max and min values");if(null==e&&(e=0),t<e)var s=t,o=e;else s=e,o=t;return s+l()*(o-s)}Object.defineProperty(e,"__esModule",{value:!0}),e.getHash=e.shuffleCopy=e.shuffle=e.getSeed=e.setRandomSeed=e.setSeed=e.randomOne=e.randomItems=e.randomBool=e.randomFloats=e.randomFloat=e.randomInts=e.randomInt=void 0,u(),e.randomInt=i,e.randomInts=function(t,e,s){for(var o=[],r=0;r<t;r++)o.push(i(e,s));return o},e.randomFloat=n,e.randomFloats=function(t,e,s){for(var o=[],r=0;r<t;r++)o.push(n(e,s));return o},e.randomBool=function(t){return void 0===t&&(t=.5),l()<t},e.randomItems=function(t,e,s){if(s){for(var o=[],r=0;r<e;r++)o.push(t[i(0,t.length-1)]);return o}return(t=d(t)).slice(0,e)},e.randomOne=function(t){return t[i(0,t.length-1)]};var a,l=(a=Math.pow(2,32),function(){return r=(1664525*r+1013904223)%a,r/a});function h(t){o=t,r=t}function u(){h(Math.floor(Math.random()*Number.MAX_SAFE_INTEGER))}function c(t){var e,s,o;for(o=t.length;o;o-=1)e=Math.floor(l()*o),s=t[o-1],t[o-1]=t[e],t[e]=s;return t}function d(t){return c(t.slice(0))}e.setSeed=h,e.setRandomSeed=u,e.getSeed=function(){return o},e.shuffle=c,e.shuffleCopy=d,e.getHash=function(t){var e,s,o=0;if(0===t.length)return o;for(e=0,s=t.length;e<s;e++)o=(o<<5)-o+t.charCodeAt(e),o|=0;return o}},,function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.cloneRobots=e.Robot=void 0;class o{constructor(t,e,s){this.id=t,this.color=t,this.x=e,this.y=s}getPos(){return{x:this.x,y:this.y}}setPos(t){this.x=t.x,this.y=t.y}clone(){return new o(this.id,this.x,this.y)}}e.Robot=o,e.cloneRobots=function(t){return t.map(t=>t.clone())}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Level=void 0;const o=s(0),r=s(3),i=s(5),n=s(1);e.Level=class{constructor(t){if("string"==typeof t){const e=t,[s,n,a,...l]=e.split("|"),h=parseInt(s),u=n.length/h,c=parseInt(a);this.goal=new i.Goal(c%h,Math.floor(c/h),0),this.robots=l.map(Number).map((t,e)=>new r.Robot(e,t%h,Math.floor(t/h))),this.board=new o.Board(u,h),this.board.setTiles(n)}else{const{board:e,robots:s,goal:a}=function({width:t,height:e,seed:s,robotCount:a}){n.setSeed(s);const l=new o.Board(e,t);l.addRandomWalls(t*e/5);const h=[];for(let t=0;t<l.w;t++)for(let e=0;e<l.h;e++)h.push({x:t,y:e});const u=n.shuffle(h),c=new Array(a).fill(null).map((t,e)=>{const s=u.pop();return new r.Robot(e,s.x,s.y)}),d=u.pop();return{goal:new i.Goal(d.x,d.y,0),robots:c,board:l}}(t);this.board=e,this.robots=s,this.goal=a}}pos2num(t){return t.x+t.y*this.board.w}getLevelString(){const t=this.pos2num(this.goal),e=this.board.getTilesString(),s=this.robots.map(t=>this.pos2num(t)).join("|");return`${this.board.w}|${e}|${t}|${s}`}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Goal=void 0;e.Goal=class{constructor(t,e,s){this.x=t,this.y=e,this.color=s}}},,function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SolverWorkerMessage=void 0,function(t){t.PING="PING",t.PONG="PONG",t.SOLVE="SOLVE",t.SOLVE_END="SOLVE_END",t.SOLVE_PROGRESS="SOLVE_PROGRESS"}(e.SolverWorkerMessage||(e.SolverWorkerMessage={}))},,function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.hasWall=e.goEast=e.goWest=e.goSouth=e.goNorth=void 0;const o=s(0);function r(t,e,s,o){return 0!=(t.tiles[s][e]&o)}e.goNorth=function(t,e,s){const i={x:e.x,y:e.y},n=Math.max(...s.filter(t=>t.x===i.x&&t.y<i.y).map(t=>t.y));for(;i.y>0&&(i.y-1!==n&&!r(t,i.x,i.y,o.Wall.NORTH));i.y--);return i.y===e.y?null:{pos:i,dir:"upp"}},e.goSouth=function(t,e,s){const i={x:e.x,y:e.y},n=Math.min(...s.filter(t=>t.x===e.x&&t.y>i.y).map(t=>t.y));for(;i.y<t.h&&(i.y+1!==n&&!r(t,e.x,i.y,o.Wall.SOUTH));i.y++);return i.y===e.y?null:{pos:i,dir:"ner"}},e.goWest=function(t,e,s){const i={x:e.x,y:e.y},n=Math.max(...s.filter(t=>t.y===i.y&&t.x<i.x).map(t=>t.x));for(;i.x>0&&(i.x-1!==n&&!r(t,i.x,i.y,o.Wall.WEST));i.x--);return i.x===e.x?null:{pos:i,dir:"vänster"}},e.goEast=function(t,e,s){const i={x:e.x,y:e.y},n=Math.min(...s.filter(t=>t.y===i.y&&t.x>i.x).map(t=>t.x));for(;i.x<t.w&&(i.x+1!==n&&!r(t,i.x,i.y,o.Wall.EAST));i.x++);return i.x===e.x?null:{pos:i,dir:"höger"}},e.hasWall=r},,,,,,,,function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const o=s(18),r=s(7),i=s(4);function n(t){postMessage({type:r.SolverWorkerMessage.SOLVE_END,result:t}),close()}function a(t){postMessage({type:r.SolverWorkerMessage.SOLVE_PROGRESS,progress:t})}self.onmessage=function(t){switch(t.data.type){case r.SolverWorkerMessage.SOLVE:{const e=new i.Level(t.data.levelString),s=new o.Solver(e,{backAgain:t.data.backAgain});s.onComplete(n),s.onProgress(a),s.solve();break}default:throw Error("Worker recieved an unknown message"+t.data.type)}}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Solver=void 0;const o=s(9),r=t=>null!==t;function i(t){if(!t)return[];return e=t.map(t=>t.color),[...new Set(e)];var e}e.Solver=class{constructor(t,e={}){this.checkedStates=new Map,this.statesUnchecked=new Set,this.uncheckedStates=[],this.routeFound=!1,this.aborted=!1,this.allStatesChecked=!1,this.running=!1,this.message="",this.duration=0,this.pos2num=t=>t.x+t.y*this.board.w,this.getState=(t,e)=>this.pos2num(t[0])+(e?"Y":"N")+t.slice(1).map(t=>this.pos2num(t)).sort().join("|");const{backAgain:s=!1}=e;this.board=t.board,this.robots=t.robots,this.goal=t.goal,this.goalTile=this.pos2num(this.goal),this.homeTile=this.pos2num(this.robots[this.goal.color]),this.backAgain=s}solve(){const t=this.getState(this.robots,!1);this.uncheckedStates=[{moves:0,previous:"",color:0,dir:"",state:t,robots:this.robots.slice(),goalVisited:!1}],this.statesUnchecked=new Set(t);const e=new Date;for(this.running=!0;this.running;)this.checkNext();this.duration=((new Date).getTime()-e.getTime())/1e3;const s=this.getResult();return this.completeCallback&&this.completeCallback(s),this.statesUnchecked.clear(),this.uncheckedStates.length=0,this.checkedStates.clear(),s}isRouteFound(){return this.routeFound}getResult(){return{duration:this.duration,statesChecked:this.checkedStates.size,isRouteFound:this.routeFound,isAllStatesChecked:this.allStatesChecked,isAborted:this.aborted,route:this.foundRoute,robotsUsed:i(this.foundRoute),message:this.message}}onComplete(t){this.completeCallback=t}onProgress(t){this.progressCallback=t}checkNext(){const t=this.uncheckedStates.shift();if(void 0===t)return this.message="No more moves to check... I guess this level is impossible",this.allStatesChecked=!0,void(this.running=!1);this.progressCallback&&this.checkedStates.size%100==0&&this.progressCallback({checkedStates:this.checkedStates.size,currentMovesCount:t.moves});const{state:e,robots:s,previous:o,moves:r}=t;this.statesUnchecked.delete(e);let i=t.goalVisited;if(this.isGoalReached(s)){if(!this.backAgain)return void this.goalReached(t,o);i=!0}if(!(this.backAgain&&i&&this.isBackAgain(s)))return s.forEach((t,o)=>{const n=this.getNewStates(s,o,i).filter(t=>!this.checkedStates.has(t.state)).filter(t=>!this.statesUnchecked.has(t.state)).map(t=>Object.assign(Object.assign({},t),{previous:e,moves:r+1}));n.length&&n.forEach(t=>{this.uncheckedStates.push(t),this.statesUnchecked.add(t.state)})}),this.checkedStates.set(e,t),2e5===this.checkedStates.size?(this.message="Checked 200000 states. Abort!",this.aborted=!0,void(this.running=!1)):void 0;this.goalReached(t,o)}isGoalReached(t){return this.pos2num(t[this.goal.color])===this.goalTile}isBackAgain(t){return this.pos2num(t[this.goal.color])===this.homeTile}goalReached(t,e){this.routeFound=!0,this.running=!1;let s=t;for(this.foundRoute=[];s.previous;){this.foundRoute.unshift(s);const t=this.checkedStates.get(s.previous);if(void 0===t)throw Error(`state ${e} not found`);s=t}this.message=`Level solved in ${this.foundRoute.length} moves`}getNewStates(t,e,s){const i=t[e],n=t.filter(t=>t.color!==e);return[o.goNorth(this.board,i,n),o.goWest(this.board,i,n),o.goEast(this.board,i,n),o.goSouth(this.board,i,n)].filter(r).map(o=>{const r=t.slice();r[e]={x:o.pos.x,y:o.pos.y,color:r[e].color};return{state:this.getState(r,s),robots:r,dir:o.dir,color:e,goalVisited:s}})}}}]);