!function(t){var e={};function o(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=t,o.c=e,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=12)}([function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Board=e.Wall=void 0;const n=o(2);var r;!function(t){t[t.NORTH=1]="NORTH",t[t.WEST=2]="WEST",t[t.EAST=4]="EAST",t[t.SOUTH=8]="SOUTH"}(r=e.Wall||(e.Wall={}));e.Board=class{constructor(t,e){this.h=t,this.w=e,this.tiles=new Array(t).fill(null).map(()=>new Array(e).fill(0)),this.addTopWalls(),this.addBottomWalls(),this.addLeftWalls(),this.addRightWalls()}getTilesString(){return this.tiles.map(t=>t.map(t=>t.toString(16)).join("")).join("")}setTiles(t){if(t.length!==this.w*this.h)throw Error(`Unable to set tiles. tiles.length was ${t.length}, expected ${this.w*this.h}`);const e=t.split("").map(t=>parseInt(t,16));this.tiles=new Array(this.h).fill(null).map((t,o)=>e.slice(o*this.w,o*this.w+this.w))}addWall(t,e,o){if(t<0||t>=this.w)throw Error(`x must be between 0 and ${this.w-1}, was: ${t}`);if(e<0||e>=this.h)throw Error(`y must be between 0 and ${this.h-1}, was: ${e}`);this.addSingleWall(t,e,o);const n=this.getTileBehindTheWall(t,e,o);if(n){const t=this.getOppositeWall(o);this.addSingleWall(n.x,n.y,t)}}addRandomWalls(t){let e=0,o=0;for(;e<t&&o<1e3;){o++;const t=n.randomOne([r.NORTH,r.EAST,r.WEST,r.SOUTH]),i=n.randomInt(0,this.w-1),s=n.randomInt(0,this.h-1);this.tiles[s][i]&t||(this.addWall(i,s,t),e++)}}addSingleWall(t,e,o){const n=this.tiles[e][t];this.tiles[e][t]=n|o}getTileBehindTheWall(t,e,o){return o===r.NORTH&&e>0?{x:t,y:e-1}:o===r.WEST&&t>0?{x:t-1,y:e}:o===r.EAST&&t+1<this.w?{x:t+1,y:e}:o===r.SOUTH&&e+1<this.h?{x:t,y:e+1}:null}getOppositeWall(t){switch(t){case r.NORTH:return r.SOUTH;case r.SOUTH:return r.NORTH;case r.EAST:return r.WEST;case r.WEST:return r.EAST;default:throw Error("Invalid wall "+t)}}addTopWalls(){for(let t=0;t<this.w;t++)this.addSingleWall(t,0,r.NORTH)}addBottomWalls(){for(let t=0;t<this.w;t++)this.addSingleWall(t,this.h-1,r.SOUTH)}addLeftWalls(){for(let t=0;t<this.h;t++)this.addSingleWall(0,t,r.WEST)}addRightWalls(){for(let t=0;t<this.h;t++)this.addSingleWall(this.w-1,t,r.EAST)}}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Direction=void 0,function(t){t.UP="UP",t.LEFT="LEFT",t.RIGHT="RIGHT",t.DOWN="DOWN"}(e.Direction||(e.Direction={}))},function(t,e,o){"use strict";let n,r;function i(t,e){if(null==t)throw new Error("Invalid parameters, enter max, or max and min values");if(null==e&&(e=0),t<e)var o=t,n=e;else o=e,n=t;return o+Math.floor(a()*(n+1-o))}function s(t,e){if(null==t)throw new Error("Invalid parameters, enter max, or max and min values");if(null==e&&(e=0),t<e)var o=t,n=e;else o=e,n=t;return o+a()*(n-o)}Object.defineProperty(e,"__esModule",{value:!0}),e.getHash=e.shuffleCopy=e.shuffle=e.getSeed=e.setRandomSeed=e.setSeed=e.randomOne=e.randomItems=e.randomBool=e.randomFloats=e.randomFloat=e.randomInts=e.randomInt=void 0,d(),e.randomInt=i,e.randomInts=function(t,e,o){for(var n=[],r=0;r<t;r++)n.push(i(e,o));return n},e.randomFloat=s,e.randomFloats=function(t,e,o){for(var n=[],r=0;r<t;r++)n.push(s(e,o));return n},e.randomBool=function(t){return void 0===t&&(t=.5),a()<t},e.randomItems=function(t,e,o){if(o){for(var n=[],r=0;r<e;r++)n.push(t[i(0,t.length-1)]);return n}return(t=h(t)).slice(0,e)},e.randomOne=function(t){return t[i(0,t.length-1)]};var l,a=(l=Math.pow(2,32),function(){return r=(1664525*r+1013904223)%l,r/l});function c(t){n=t,r=t}function d(){c(Math.floor(Math.random()*Number.MAX_SAFE_INTEGER))}function u(t){var e,o,n;for(n=t.length;n;n-=1)e=Math.floor(a()*n),o=t[n-1],t[n-1]=t[e],t[e]=o;return t}function h(t){return u(t.slice(0))}e.setSeed=c,e.setRandomSeed=d,e.getSeed=function(){return n},e.shuffle=u,e.shuffleCopy=h,e.getHash=function(t){var e,o,n=0;if(0===t.length)return n;for(e=0,o=t.length;e<o;e++)n=(n<<5)-n+t.charCodeAt(e),n|=0;return n}},function(t,e,o){"use strict";function n(t){const e=document.getElementById(t);if(!e)throw Error("Could not find element "+t);return e}Object.defineProperty(e,"__esModule",{value:!0}),e.getButton=e.getElementById=void 0,e.getElementById=n,e.getButton=function(t){return n(t)}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.cloneRobots=e.Robot=void 0;class n{constructor(t,e,o){this.id=t,this.color=t,this.x=e,this.y=o}getPos(){return{x:this.x,y:this.y}}setPos(t){this.x=t.x,this.y=t.y}clone(){return new n(this.id,this.x,this.y)}}e.Robot=n,e.cloneRobots=function(t){return t.map(t=>t.clone())}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Level=void 0;const n=o(0),r=o(4),i=o(6),s=o(2);e.Level=class{constructor(t){if("string"==typeof t){const e=t,[o,s,l,...a]=e.split("|"),c=parseInt(o),d=s.length/c,u=parseInt(l);this.goal=new i.Goal(u%c,Math.floor(u/c),0),this.robots=a.map(Number).map((t,e)=>new r.Robot(e,t%c,Math.floor(t/c))),this.board=new n.Board(d,c),this.board.setTiles(s)}else{const{board:e,robots:o,goal:l}=function({width:t,height:e,seed:o,robotCount:l}){s.setSeed(o);const a=new n.Board(e,t);a.addRandomWalls(t*e/5);const c=[];for(let t=0;t<a.w;t++)for(let e=0;e<a.h;e++)c.push({x:t,y:e});const d=s.shuffle(c),u=new Array(l).fill(null).map((t,e)=>{const o=d.pop();return new r.Robot(e,o.x,o.y)}),h=d.pop();return{goal:new i.Goal(h.x,h.y,0),robots:u,board:a}}(t);this.board=e,this.robots=o,this.goal=l}}pos2num(t){return t.x+t.y*this.board.w}getLevelString(){const t=this.pos2num(this.goal),e=this.board.getTilesString(),o=this.robots.map(t=>this.pos2num(t)).join("|");return`${this.board.w}|${e}|${t}|${o}`}}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Goal=void 0;e.Goal=class{constructor(t,e,o){this.x=t,this.y=e,this.color=o}}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.showSolution=e.switchRobot=e.moveRobot=e.moveActiveRobot=e.setRobotPosition=e.setRobotsPostitions=e.resetRobots=e.resetLevel=e.loadLevel=void 0;const n=o(4),r=o(13),i=o(11),s=o(1),l=o(9),a=o(14),c=o(10),d=o(15);let u,h,f=0;const g=[];let v=!1;function b(){p(),S(0),a.reset()}function p(){h=n.cloneRobots(u.robots),m(h)}function m(t){t.forEach((t,e)=>{y(e,t.getPos())})}function y(t,e){h[t].setPos(e),i.moveRobot(t,e)}function w(t,e){const o=function(t){switch(t){case s.Direction.UP:return l.goNorth;case s.Direction.LEFT:return l.goWest;case s.Direction.RIGHT:return l.goEast;case s.Direction.DOWN:return l.goSouth}}(e),i=h.filter(e=>e.color!==t),c=o(u.board,h[t],i);c&&(y(t,c.pos),a.addMove(t,e,n.cloneRobots(h)),function(){const t=h[u.goal.color];return t.x===u.goal.x&&t.y===u.goal.y}()&&setTimeout(()=>{const t=r.getResult();if(!t||t.isAborted)return void d.openModal("Grattis, du klarade det innan solvern");if(t&&t.isAllStatesChecked)return void d.openModal("Öööö... du klarade en omöjlig bana?!");const e=(o=a.getMovesCount(),n=t.route.length,o===n?3:o<=1+Math.floor(1.3*n)?2:1);var o,n;d.openModal([,"Bättre kan du","Bra gjort!","Perfekt!"][e]+"<br>"+"⭐".repeat(e))},400))}function S(t){t<0||t>h.length-1||(f=t,i.setActiveRobot(t),c.activeRobotChanged(t))}function E(){const t=g.shift();t?(v=!0,w(t.robotIndex,t.direction),setTimeout(E,400)):v=!1}e.loadLevel=function(t){u=t,r.solve(u,!1),c.createButtons(u.robots.length),i.loadLevel(u),b()},e.resetLevel=b,e.resetRobots=p,e.setRobotsPostitions=m,e.setRobotPosition=y,e.moveActiveRobot=function(t){!function(t,e){if(g.push({robotIndex:t,direction:e}),v)return;E()}(f,t)},e.moveRobot=w,e.switchRobot=S,e.showSolution=function(){const t=r.getResult();t&&(b(),g.length=0,g.push(...t.route.map(t=>({direction:t.dir,robotIndex:t.color}))),setTimeout(E,400))}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SolverWorkerMessage=void 0,function(t){t.PING="PING",t.PONG="PONG",t.SOLVE="SOLVE",t.SOLVE_END="SOLVE_END",t.SOLVE_PROGRESS="SOLVE_PROGRESS"}(e.SolverWorkerMessage||(e.SolverWorkerMessage={}))},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.hasWall=e.goEast=e.goWest=e.goSouth=e.goNorth=void 0;const n=o(0),r=o(1);function i(t,e,o,n){return 0!=(t.tiles[o][e]&n)}e.goNorth=function(t,e,o){const s={x:e.x,y:e.y},l=Math.max(...o.filter(t=>t.x===s.x&&t.y<s.y).map(t=>t.y));for(;s.y>0&&(s.y-1!==l&&!i(t,s.x,s.y,n.Wall.NORTH));s.y--);return s.y===e.y?null:{pos:s,dir:r.Direction.UP}},e.goSouth=function(t,e,o){const s={x:e.x,y:e.y},l=Math.min(...o.filter(t=>t.x===e.x&&t.y>s.y).map(t=>t.y));for(;s.y<t.h&&(s.y+1!==l&&!i(t,e.x,s.y,n.Wall.SOUTH));s.y++);return s.y===e.y?null:{pos:s,dir:r.Direction.DOWN}},e.goWest=function(t,e,o){const s={x:e.x,y:e.y},l=Math.max(...o.filter(t=>t.y===s.y&&t.x<s.x).map(t=>t.x));for(;s.x>0&&(s.x-1!==l&&!i(t,s.x,s.y,n.Wall.WEST));s.x--);return s.x===e.x?null:{pos:s,dir:r.Direction.LEFT}},e.goEast=function(t,e,o){const s={x:e.x,y:e.y},l=Math.min(...o.filter(t=>t.y===s.y&&t.x>s.x).map(t=>t.x));for(;s.x<t.w&&(s.x+1!==l&&!i(t,s.x,s.y,n.Wall.EAST));s.x++);return s.x===e.x?null:{pos:s,dir:r.Direction.RIGHT}},e.hasWall=i},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.activeRobotChanged=e.onColorSelect=e.createButtons=void 0;const n=o(3);let r=[],i=0;const s=n.getElementById("colorControls");let l;function a(t){i=t,r.forEach((e,o)=>e.classList.toggle("selected",t===o))}s.addEventListener("click",(function(t){const e=t.target;if(!e)return;const o=e.dataset.color;if(!o)return;a(parseInt(o)),l(parseInt(o))})),e.createButtons=function(t){r=new Array(t).fill(null).map((t,e)=>{const o=document.createElement("button");return o.classList.add("color"+e),e===i&&o.classList.add("selected"),o.dataset.color=e.toString(),o.innerText=(e+1).toString(),o}),s.innerHTML="",r.forEach(t=>s.appendChild(t))},e.onColorSelect=function(t){l=t},e.activeRobotChanged=function(t){a(t)}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.onRobotClick=e.setActiveRobot=e.moveRobot=e.setRobotsPositions=e.loadLevel=void 0;const n=o(3),r=o(0),i=o(7),s=o(1),l=n.getElementById("board");let a,c,d,u=null;function h(t){t.forEach((t,e)=>{f(e,t.getPos())})}function f(t,e){!function(t,e){t.style.transform=`translate(${38*e.x+10}px, ${38*e.y+10}px)`}(c[t],e)}document.addEventListener("touchend",t=>u=null),document.addEventListener("touchmove",(function(t){if(null===u)return;const e={x:t.touches[0].screenX,y:t.touches[0].screenY},o={x:d.x-e.x,y:d.y-e.y};Math.abs(o.x)>40&&Math.abs(o.y)<20?(i.moveActiveRobot(o.x>0?s.Direction.LEFT:s.Direction.RIGHT),u=null,d=null):Math.abs(o.y)>40&&Math.abs(o.x)<20&&(i.moveActiveRobot(o.y>0?s.Direction.UP:s.Direction.DOWN),u=null,d=null)}),{passive:!0}),e.loadLevel=function(t){const e=function(t){return"<table class='boardTable'><tr>"+t.board.tiles.map((e,o)=>e.map((e,n)=>{let i="";const s=[];return e&r.Wall.NORTH&&s.push("wall-north"),e&r.Wall.EAST&&s.push("wall-east"),e&r.Wall.WEST&&s.push("wall-west"),e&r.Wall.SOUTH&&s.push("wall-south"),t.goal.x===n&&t.goal.y===o&&(i=`<div class="goal goal-${t.goal.color}"></div>`),t.robots.forEach(t=>{t.x===n&&t.y===o&&(i=`<div class="start start-${t.color}"></div>`)}),`<td class='${s.join(" ")}'>${i}</td>`}).join("")).join("</tr><tr>")+"</tr></table>"}(t);l.innerHTML=e,c=t.robots.map(t=>{const e=document.createElement("div");return e.classList.add("robot","robot-"+t.color),e.innerText=(t.color+1).toString(),e.addEventListener("click",e=>{return o=t.color,void(a&&a(o));var o}),e.addEventListener("touchstart",e=>function(t,e){u=e,d={x:t.touches[0].screenX,y:t.touches[0].screenY},a&&a(e)}(e,t.color),{passive:!0}),e}),c.forEach(t=>{l.appendChild(t)}),h(t.robots)},e.setRobotsPositions=h,e.moveRobot=f,e.setActiveRobot=function(t){c.forEach((e,o)=>{e.classList.toggle("active",o===t)})},e.onRobotClick=function(t){a=t}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=o(5),r=o(3),i=o(10),s=o(7),l=o(11),a=o(1);let c;function d(t){s.switchRobot(t)}function u(t=Math.floor(1e6*Math.random())){location.hash=t.toString(),c=new n.Level({width:10,height:10,robotCount:4,seed:t}),s.loadLevel(c)}o(16).registerServiceWorker(),function(){const t=location.hash.substr(1);u(t?parseInt(t):void 0),i.onColorSelect(t=>s.switchRobot(t)),l.onRobotClick(d)}(),r.getButton("btnUp").addEventListener("click",t=>s.moveActiveRobot(a.Direction.UP)),r.getButton("btnLeft").addEventListener("click",t=>s.moveActiveRobot(a.Direction.LEFT)),r.getButton("btnRight").addEventListener("click",t=>s.moveActiveRobot(a.Direction.RIGHT)),r.getButton("btnDown").addEventListener("click",t=>s.moveActiveRobot(a.Direction.DOWN)),document.body.addEventListener("keydown",(function(t){t.key.match(/^\d$/)&&s.switchRobot(parseInt(t.key)-1);switch(t.key){case"F2":u();break;case"Escape":s.resetLevel();break;case"ArrowUp":s.moveActiveRobot(a.Direction.UP);break;case"ArrowLeft":s.moveActiveRobot(a.Direction.LEFT);break;case"ArrowRight":s.moveActiveRobot(a.Direction.RIGHT);break;case"ArrowDown":s.moveActiveRobot(a.Direction.DOWN)}})),r.getButton("btnShowSolution").addEventListener("click",s.showSolution),r.getButton("btnNewGame").addEventListener("click",t=>u()),window.addEventListener("beforeinstallprompt",t=>{t.preventDefault();const e=document.getElementById("btnInstall");e.hidden=!1,e.onclick=()=>t.prompt()})},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getResult=e.solve=void 0;const n=o(8),r=o(3),i=["röd","grön","blå","gul"];let s,l,a;const c=r.getButton("btnSolver"),d=r.getElementById("solverInfo"),u=r.getElementById("solverDialog"),h=t=>c.children[0].children[0].setAttribute("xlink:href","icons.svg#icon-"+t);c.addEventListener("click",t=>u.showModal());const f=r.getButton("btnShowSolution");function g(t){switch(t.data.type){case n.SolverWorkerMessage.SOLVE_END:if(l=t.data.result,c.classList.remove("rotate"),l.isRouteFound){h("check");const t=l.robotsUsed.map(t=>i[t]).join(", ");d.innerHTML=`\n          En lösning på ${l.route.length} drag hittades!<br>\n          Använde robotarna: ${t}<br>\n          ${l.statesChecked} states letades igenom på \n          ${l.duration} sekunder\n        `,f.hidden=!1}else l.isAllStatesChecked?(h("impossible"),d.innerHTML=`\n          Ingen lösning kunde hittas. Omöjlig!<br>\n          ${l.statesChecked} states letades igenom på \n          ${l.duration} sekunder\n        `):(h("info"),d.innerHTML=`\n          Orkade inte leta klar.<br>\n          ${l.statesChecked} states letades igenom på \n          ${l.duration} sekunder. Om en lösning finns är den på minst ${l.minMoves}\n        `);break;case n.SolverWorkerMessage.SOLVE_PROGRESS:a=t.data.progress,d.innerHTML=`\n        ${a.checkedStates} states undersökta<br>\n        Letar nu efter lösningar med ${a.currentMovesCount} drag\n      `;break;default:throw Error("Unknown message from web worker: "+t.data.type)}}f.addEventListener("click",t=>u.close()),e.solve=function(t,e=!1){s&&s.terminate(),l=null,h("spinner"),c.classList.add("rotate"),f.hidden=!0,s=new Worker("js/solver-worker.js"),s.onmessage=g,s.postMessage({type:n.SolverWorkerMessage.SOLVE,levelString:t.getLevelString(),backAgain:e})},e.getResult=function(){return l}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getMovesCount=e.addMove=e.reset=void 0;const n=o(3),r=o(7),i=[],s=n.getElementById("movesCounter"),l=n.getButton("btnUndo"),a=n.getButton("btnReset"),c=n.getElementById("movesMade");function d(){i.length=0,u(),r.resetRobots()}function u(){const t=i.length;s.innerText=t.toString(),c.innerHTML=i.map(t=>`<span>${t.robotIndex+1}${t.direction.substr(0,1)}</span>`).join(""),l.disabled=0===i.length,a.disabled=0===i.length}l.addEventListener("click",(function(){if(1===i.length)return void d();i.pop(),u();const t=i[i.length-1].robots;r.setRobotsPostitions(t)})),a.addEventListener("click",d),e.reset=d,e.addMove=function(t,e,o){i.push({direction:e,robotIndex:t,robots:o}),u()},e.getMovesCount=function(){return i.length}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.openModal=void 0,e.openModal=function(t){const e=document.createElement("dialog"),o=document.createElement("button");o.classList.add("button"),o.innerText="OK";const n=document.createElement("div");n.classList.add("dialog-actions"),n.appendChild(o);const r=document.createElement("form");r.method="dialog",r.innerHTML=t,r.appendChild(n),document.body.appendChild(e),e.appendChild(r),e.showModal()}},function(t,e,o){"use strict";var n=this&&this.__awaiter||function(t,e,o,n){return new(o||(o=Promise))((function(r,i){function s(t){try{a(n.next(t))}catch(t){i(t)}}function l(t){try{a(n.throw(t))}catch(t){i(t)}}function a(t){var e;t.done?r(t.value):(e=t.value,e instanceof o?e:new o((function(t){t(e)}))).then(s,l)}a((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.registerServiceWorker=void 0;let r=!1;const i="serviceWorker"in navigator;function s(t){t.onstatechange=()=>{console.debug("Client: State changed",t.state),"installed"===t.state&&l(t)}}function l(t){console.debug("Client: New worker installed, activate it!"),t.postMessage({action:"skipWaiting"})}function a(t){r||(r=!0,console.debug("Client: New worker active, reload page"),location.reload())}function c(t){console.debug("Client: Message from client:",t.data)}e.registerServiceWorker=function(){return n(this,void 0,void 0,(function*(){if(!i)return void console.warn("Client: Service worker not available");navigator.serviceWorker.oncontrollerchange=a,navigator.serviceWorker.onmessage=c,console.debug("Client: Register service worker");const t=yield navigator.serviceWorker.register("sw.js");console.debug("Client: Service worker registered"),navigator.serviceWorker.controller?t.waiting?l(t.waiting):t.installing?(console.debug("Client: New worker is beeing installed, track it"),s(t.installing)):(console.debug("Client: Listen for new workers"),t.onupdatefound=e=>{console.debug("Client: New worker found, track installation"),s(t.installing)}):console.debug("Client: No active worker found")}))}}]);