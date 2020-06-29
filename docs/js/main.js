!function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=12)}([function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Board=t.Wall=void 0;const n=o(1);var r;!function(e){e[e.NORTH=1]="NORTH",e[e.WEST=2]="WEST",e[e.EAST=4]="EAST",e[e.SOUTH=8]="SOUTH"}(r=t.Wall||(t.Wall={}));t.Board=class{constructor(e,t){this.h=e,this.w=t,this.tiles=new Array(e).fill(null).map(()=>new Array(t).fill(0)),this.addTopWalls(),this.addBottomWalls(),this.addLeftWalls(),this.addRightWalls()}getTilesString(){return this.tiles.map(e=>e.map(e=>e.toString(16)).join("")).join("")}setTiles(e){if(e.length!==this.w*this.h)throw Error(`Unable to set tiles. tiles.length was ${e.length}, expected ${this.w*this.h}`);const t=e.split("").map(e=>parseInt(e,16));this.tiles=new Array(this.h).fill(null).map((e,o)=>t.slice(o*this.w,o*this.w+this.w))}addWall(e,t,o){if(e<0||e>=this.w)throw Error(`x must be between 0 and ${this.w-1}, was: ${e}`);if(t<0||t>=this.h)throw Error(`y must be between 0 and ${this.h-1}, was: ${t}`);this.addSingleWall(e,t,o);const n=this.getTileBehindTheWall(e,t,o);if(n){const e=this.getOppositeWall(o);this.addSingleWall(n.x,n.y,e)}}addRandomWalls(e){let t=0,o=0;for(;t<e&&o<1e3;){o++;const e=n.randomOne([r.NORTH,r.EAST,r.WEST,r.SOUTH]),s=n.randomInt(0,this.w-1),i=n.randomInt(0,this.h-1);this.tiles[i][s]&e||(this.addWall(s,i,e),t++)}}addSingleWall(e,t,o){const n=this.tiles[t][e];this.tiles[t][e]=n|o}getTileBehindTheWall(e,t,o){return o===r.NORTH&&t>0?{x:e,y:t-1}:o===r.WEST&&e>0?{x:e-1,y:t}:o===r.EAST&&e+1<this.w?{x:e+1,y:t}:o===r.SOUTH&&t+1<this.h?{x:e,y:t+1}:null}getOppositeWall(e){switch(e){case r.NORTH:return r.SOUTH;case r.SOUTH:return r.NORTH;case r.EAST:return r.WEST;case r.WEST:return r.EAST;default:throw Error("Invalid wall "+e)}}addTopWalls(){for(let e=0;e<this.w;e++)this.addSingleWall(e,0,r.NORTH)}addBottomWalls(){for(let e=0;e<this.w;e++)this.addSingleWall(e,this.h-1,r.SOUTH)}addLeftWalls(){for(let e=0;e<this.h;e++)this.addSingleWall(0,e,r.WEST)}addRightWalls(){for(let e=0;e<this.h;e++)this.addSingleWall(this.w-1,e,r.EAST)}}},function(e,t,o){"use strict";let n,r;function s(e,t){if(null==e)throw new Error("Invalid parameters, enter max, or max and min values");if(null==t&&(t=0),e<t)var o=e,n=t;else o=t,n=e;return o+Math.floor(a()*(n+1-o))}function i(e,t){if(null==e)throw new Error("Invalid parameters, enter max, or max and min values");if(null==t&&(t=0),e<t)var o=e,n=t;else o=t,n=e;return o+a()*(n-o)}Object.defineProperty(t,"__esModule",{value:!0}),t.getHash=t.shuffleCopy=t.shuffle=t.getSeed=t.setRandomSeed=t.setSeed=t.randomOne=t.randomItems=t.randomBool=t.randomFloats=t.randomFloat=t.randomInts=t.randomInt=void 0,d(),t.randomInt=s,t.randomInts=function(e,t,o){for(var n=[],r=0;r<e;r++)n.push(s(t,o));return n},t.randomFloat=i,t.randomFloats=function(e,t,o){for(var n=[],r=0;r<e;r++)n.push(i(t,o));return n},t.randomBool=function(e){return void 0===e&&(e=.5),a()<e},t.randomItems=function(e,t,o){if(o){for(var n=[],r=0;r<t;r++)n.push(e[s(0,e.length-1)]);return n}return(e=h(e)).slice(0,t)},t.randomOne=function(e){return e[s(0,e.length-1)]};var l,a=(l=Math.pow(2,32),function(){return r=(1664525*r+1013904223)%l,r/l});function c(e){n=e,r=e}function d(){c(Math.floor(Math.random()*Number.MAX_SAFE_INTEGER))}function u(e){var t,o,n;for(n=e.length;n;n-=1)t=Math.floor(a()*n),o=e[n-1],e[n-1]=e[t],e[t]=o;return e}function h(e){return u(e.slice(0))}t.setSeed=c,t.setRandomSeed=d,t.getSeed=function(){return n},t.shuffle=u,t.shuffleCopy=h,t.getHash=function(e){var t,o,n=0;if(0===e.length)return n;for(t=0,o=e.length;t<o;t++)n=(n<<5)-n+e.charCodeAt(t),n|=0;return n}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getElementById=void 0,t.getElementById=function(e){const t=document.getElementById(e);if(!t)throw Error("Could not find element "+e);return t}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.cloneRobots=t.Robot=void 0;class n{constructor(e,t,o){this.id=e,this.color=e,this.x=t,this.y=o}getPos(){return{x:this.x,y:this.y}}setPos(e){this.x=e.x,this.y=e.y}clone(){return new n(this.id,this.x,this.y)}}t.Robot=n,t.cloneRobots=function(e){return e.map(e=>e.clone())}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Level=void 0;const n=o(0),r=o(3),s=o(5),i=o(1);t.Level=class{constructor(e){if("string"==typeof e){const t=e,[o,i,l,...a]=t.split("|"),c=parseInt(o),d=i.length/c,u=parseInt(l);this.goal=new s.Goal(u%c,Math.floor(u/c),0),this.robots=a.map(Number).map((e,t)=>new r.Robot(t,e%c,Math.floor(e/c))),this.board=new n.Board(d,c),this.board.setTiles(i)}else{const{board:t,robots:o,goal:l}=function({width:e,height:t,seed:o,robotCount:l}){i.setSeed(o);const a=new n.Board(t,e);a.addRandomWalls(e*t/5);const c=[];for(let e=0;e<a.w;e++)for(let t=0;t<a.h;t++)c.push({x:e,y:t});const d=i.shuffle(c),u=new Array(l).fill(null).map((e,t)=>{const o=d.pop();return new r.Robot(t,o.x,o.y)}),h=d.pop();return{goal:new s.Goal(h.x,h.y,0),robots:u,board:a}}(e);this.board=t,this.robots=o,this.goal=l}}pos2num(e){return e.x+e.y*this.board.w}getLevelString(){const e=this.pos2num(this.goal),t=this.board.getTilesString(),o=this.robots.map(e=>this.pos2num(e)).join("|");return`${this.board.w}|${t}|${e}|${o}`}}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Goal=void 0;t.Goal=class{constructor(e,t,o){this.x=e,this.y=t,this.color=o}}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.showSolution=t.switchRobot=t.moveRobot=t.moveActiveRobot=t.setRobotPosition=t.setRobotsPostitions=t.resetRobots=t.resetLevel=t.loadLevel=void 0;const n=o(3),r=o(13),s=o(11),i=o(8),l=o(9),a=o(14),c=o(10),d=o(15);let u,h,f=0;const g=[];let v=!1;function b(){m(),S(0),a.reset()}function m(){h=n.cloneRobots(u.robots),p(h)}function p(e){e.forEach((e,t)=>{y(t,e.getPos())})}function y(e,t){h[e].setPos(t),s.moveRobot(e,t)}function E(e,t){const o=function(e){switch(e){case i.Direction.UP:return l.goNorth;case i.Direction.LEFT:return l.goWest;case i.Direction.RIGHT:return l.goEast;case i.Direction.DOWN:return l.goSouth}}(t),s=h.filter(t=>t.color!==e),c=o(u.board,h[e],s);c&&(y(e,c.pos),a.addMove(e,t,n.cloneRobots(h)),function(){const e=h[u.goal.color];return e.x===u.goal.x&&e.y===u.goal.y}()&&setTimeout(()=>{const e=r.getResult();if(!e||e.isAborted)return void d.openModal("Grattis, du klarade det innan solvern");if(e&&e.isAllStatesChecked)return void d.openModal("Öööö... du klarade en omöjlig bana?!");const t=(o=a.getMovesCount(),n=e.route.length,o===n?3:o<=1+Math.floor(1.3*n)?2:1);var o,n;d.openModal([,"Bättre kan du","Bra gjort!","Perfekt!"][t]+"<br>"+"⭐".repeat(t))},400))}function S(e){e<0||e>h.length-1||(f=e,s.setActiveRobot(e),c.activeRobotChanged(e))}function w(){const e=g.shift();e?(v=!0,E(e.robotIndex,e.direction),setTimeout(w,400)):v=!1}t.loadLevel=function(e){u=e,r.solve(u,!1),c.createButtons(u.robots.length),s.loadLevel(u),b()},t.resetLevel=b,t.resetRobots=m,t.setRobotsPostitions=p,t.setRobotPosition=y,t.moveActiveRobot=function(e){!function(e,t){if(g.push({robotIndex:e,direction:t}),v)return;w()}(f,e)},t.moveRobot=E,t.switchRobot=S,t.showSolution=function(){const e=r.getResult();if(!e)return;b(),g.length=0;const t=new Map([["upp",i.Direction.UP],["ner",i.Direction.DOWN],["vänster",i.Direction.LEFT],["höger",i.Direction.RIGHT]]);g.push(...e.route.map(e=>{const o=t.get(e.dir);if(!o)throw Error("Unknown direction:"+e.dir);return{direction:o,robotIndex:e.color}})),setTimeout(w,400)}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SolverWorkerMessage=void 0,function(e){e.PING="PING",e.PONG="PONG",e.SOLVE="SOLVE",e.SOLVE_END="SOLVE_END",e.SOLVE_PROGRESS="SOLVE_PROGRESS"}(t.SolverWorkerMessage||(t.SolverWorkerMessage={}))},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Direction=void 0,function(e){e.UP="UP",e.LEFT="LEFT",e.RIGHT="RIGHT",e.DOWN="DOWN"}(t.Direction||(t.Direction={}))},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.hasWall=t.goEast=t.goWest=t.goSouth=t.goNorth=void 0;const n=o(0);function r(e,t,o,n){return 0!=(e.tiles[o][t]&n)}t.goNorth=function(e,t,o){const s={x:t.x,y:t.y},i=Math.max(...o.filter(e=>e.x===s.x&&e.y<s.y).map(e=>e.y));for(;s.y>0&&(s.y-1!==i&&!r(e,s.x,s.y,n.Wall.NORTH));s.y--);return s.y===t.y?null:{pos:s,dir:"upp"}},t.goSouth=function(e,t,o){const s={x:t.x,y:t.y},i=Math.min(...o.filter(e=>e.x===t.x&&e.y>s.y).map(e=>e.y));for(;s.y<e.h&&(s.y+1!==i&&!r(e,t.x,s.y,n.Wall.SOUTH));s.y++);return s.y===t.y?null:{pos:s,dir:"ner"}},t.goWest=function(e,t,o){const s={x:t.x,y:t.y},i=Math.max(...o.filter(e=>e.y===s.y&&e.x<s.x).map(e=>e.x));for(;s.x>0&&(s.x-1!==i&&!r(e,s.x,s.y,n.Wall.WEST));s.x--);return s.x===t.x?null:{pos:s,dir:"vänster"}},t.goEast=function(e,t,o){const s={x:t.x,y:t.y},i=Math.min(...o.filter(e=>e.y===s.y&&e.x>s.x).map(e=>e.x));for(;s.x<e.w&&(s.x+1!==i&&!r(e,s.x,s.y,n.Wall.EAST));s.x++);return s.x===t.x?null:{pos:s,dir:"höger"}},t.hasWall=r},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.activeRobotChanged=t.onColorSelect=t.createButtons=void 0;const n=o(2);let r=[],s=0;const i=n.getElementById("colorControls");let l;function a(e){s=e,r.forEach((t,o)=>t.classList.toggle("selected",e===o))}i.addEventListener("click",(function(e){const t=e.target;if(!t)return;const o=t.dataset.color;if(!o)return;a(parseInt(o)),l(parseInt(o))})),t.createButtons=function(e){r=new Array(e).fill(null).map((e,t)=>{const o=document.createElement("button");return o.classList.add("color"+t),t===s&&o.classList.add("selected"),o.dataset.color=t.toString(),o.innerText=(t+1).toString(),o}),i.innerHTML="",r.forEach(e=>i.appendChild(e))},t.onColorSelect=function(e){l=e},t.activeRobotChanged=function(e){a(e)}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.onRobotClick=t.setActiveRobot=t.moveRobot=t.setRobotsPositions=t.loadLevel=void 0;const n=o(2),r=o(0),s=o(6),i=o(8),l=n.getElementById("board");let a,c,d,u=null;function h(e){e.forEach((e,t)=>{f(t,e.getPos())})}function f(e,t){!function(e,t){e.style.transform=`translate(${38*t.x+10}px, ${38*t.y+10}px)`}(c[e],t)}document.addEventListener("touchend",e=>u=null),document.addEventListener("touchmove",(function(e){if(null===u)return;const t={x:e.touches[0].screenX,y:e.touches[0].screenY},o={x:d.x-t.x,y:d.y-t.y};Math.abs(o.x)>40&&Math.abs(o.y)<20?(s.moveActiveRobot(o.x>0?i.Direction.LEFT:i.Direction.RIGHT),u=null,d=null):Math.abs(o.y)>40&&Math.abs(o.x)<20&&(s.moveActiveRobot(o.y>0?i.Direction.UP:i.Direction.DOWN),u=null,d=null)})),t.loadLevel=function(e){const t=function(e){return"<table class='boardTable'><tr>"+e.board.tiles.map((t,o)=>t.map((t,n)=>{let s="";const i=[];return t&r.Wall.NORTH&&i.push("wall-north"),t&r.Wall.EAST&&i.push("wall-east"),t&r.Wall.WEST&&i.push("wall-west"),t&r.Wall.SOUTH&&i.push("wall-south"),e.goal.x===n&&e.goal.y===o&&(s=`<div class="goal goal-${e.goal.color}"></div>`),e.robots.forEach(e=>{e.x===n&&e.y===o&&(s=`<div class="start start-${e.color}"></div>`)}),`<td class='${i.join(" ")}'>${s}</td>`}).join("")).join("</tr><tr>")+"</tr></table>"}(e);l.innerHTML=t,c=e.robots.map(e=>{const t=document.createElement("div");return t.classList.add("robot","robot-"+e.color),t.innerText=(e.color+1).toString(),t.addEventListener("click",t=>{return o=e.color,void(a&&a(o));var o}),t.addEventListener("touchstart",t=>function(e,t){e.preventDefault(),u=t,d={x:e.touches[0].screenX,y:e.touches[0].screenY},a&&a(t)}(t,e.color)),t}),c.forEach(e=>{l.appendChild(e)}),h(e.robots)},t.setRobotsPositions=h,t.moveRobot=f,t.setActiveRobot=function(e){c.forEach((t,o)=>{t.classList.toggle("active",o===e)})},t.onRobotClick=function(e){a=e}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=o(4),r=o(2),s=o(10),i=o(6),l=o(11);o(16);const a=o(8);let c;function d(e){i.switchRobot(e)}function u(e=Math.floor(1e6*Math.random())){location.hash=e.toString(),c=new n.Level({width:10,height:10,robotCount:4,seed:e}),i.loadLevel(c)}!function(){const e=location.hash.substr(1);u(e?parseInt(e):void 0),s.onColorSelect(e=>i.switchRobot(e)),l.onRobotClick(d)}(),r.getElementById("btnUp").addEventListener("click",e=>i.moveActiveRobot(a.Direction.UP)),r.getElementById("btnLeft").addEventListener("click",e=>i.moveActiveRobot(a.Direction.LEFT)),r.getElementById("btnRight").addEventListener("click",e=>i.moveActiveRobot(a.Direction.RIGHT)),r.getElementById("btnDown").addEventListener("click",e=>i.moveActiveRobot(a.Direction.DOWN)),document.body.addEventListener("keydown",(function(e){e.key.match(/^\d$/)&&i.switchRobot(parseInt(e.key)-1);switch(e.key){case"F2":u();break;case"Escape":i.resetLevel();break;case"ArrowUp":i.moveActiveRobot(a.Direction.UP);break;case"ArrowLeft":i.moveActiveRobot(a.Direction.LEFT);break;case"ArrowRight":i.moveActiveRobot(a.Direction.RIGHT);break;case"ArrowDown":i.moveActiveRobot(a.Direction.DOWN)}})),r.getElementById("showSolutionButton").addEventListener("click",i.showSolution),r.getElementById("btnNewGame").addEventListener("click",e=>u())},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getResult=t.solve=void 0;const n=o(7),r=o(2),s=["röd","grön","blå","gul"];let i,l,a;const c=r.getElementById("solverButton"),d=r.getElementById("solverInfo"),u=r.getElementById("solverDialog"),h=e=>c.children[0].children[0].setAttribute("xlink:href","icons.svg#icon-"+e);c.addEventListener("click",e=>u.showModal());const f=r.getElementById("showSolutionButton");function g(e){switch(e.data.type){case n.SolverWorkerMessage.SOLVE_END:if(l=e.data.result,c.classList.remove("rotate"),l.isRouteFound){h("check");const e=l.robotsUsed.map(e=>s[e]).join(", ");d.innerHTML=`\n          En lösning på ${l.route.length} drag hittades!<br>\n          Använde robotarna: ${e}<br>\n          ${l.statesChecked} states letades igenom på \n          ${l.duration} sekunder\n        `,f.hidden=!1}else l.isAllStatesChecked?(h("impossible"),d.innerHTML=`\n          Ingen lösning kunde hittas. Omöjlig!<br>\n          ${l.statesChecked} states letades igenom på \n          ${l.duration} sekunder\n        `):(h("info"),d.innerHTML=`\n          Orkade inte leta klar.<br>\n          ${l.statesChecked} states letades igenom på \n          ${l.duration} sekunder\n        `);break;case n.SolverWorkerMessage.SOLVE_PROGRESS:a=e.data.progress,d.innerHTML=`\n        ${a.checkedStates} states undersökta<br>\n        Letar nu efter lösningar med ${a.currentMovesCount} drag\n      `;break;default:throw Error("Unknown message from web worker: "+e.data.type)}}f.addEventListener("click",e=>u.close()),t.solve=function(e,t=!1){i&&i.terminate(),l=null,h("spinner"),c.classList.add("rotate"),f.hidden=!0,i=new Worker("js/solver-worker.js"),i.onmessage=g,i.postMessage({type:n.SolverWorkerMessage.SOLVE,levelString:e.getLevelString(),backAgain:t})},t.getResult=function(){return l}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getMovesCount=t.addMove=t.reset=void 0;const n=o(2),r=o(6),s=[],i=n.getElementById("movesCounter"),l=n.getElementById("undoButton"),a=n.getElementById("resetButton"),c=n.getElementById("movesMade");function d(){s.length=0,u(),r.resetRobots()}function u(){const e=s.length;i.innerText=e.toString(),c.innerHTML=s.map(e=>`<span>${e.robotIndex+1}${e.direction.substr(0,1)}</span>`).join(""),l.disabled=0===s.length,a.disabled=0===s.length}l.addEventListener("click",(function(){if(1===s.length)return void d();s.pop(),u();const e=s[s.length-1].robots;r.setRobotsPostitions(e)})),a.addEventListener("click",d),t.reset=d,t.addMove=function(e,t,o){s.push({direction:t,robotIndex:e,robots:o}),u()},t.getMovesCount=function(){return s.length}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.openModal=void 0,t.openModal=function(e){const t=document.createElement("dialog"),o=document.createElement("button");o.classList.add("button"),o.innerText="OK";const n=document.createElement("div");n.classList.add("dialog-actions"),n.appendChild(o);const r=document.createElement("form");r.method="dialog",r.innerHTML=e,r.appendChild(n),document.body.appendChild(t),t.appendChild(r),t.showModal()}},function(e,t){if("serviceWorker"in navigator){console.log("SW: register service worker"),navigator.serviceWorker.register("sw.js").then((function(e){return console.log("SW: service worker registered"),navigator.serviceWorker.controller||console.log("SW: first visit"),e.waiting?(console.log("SW: new worker ready"),void n(e.waiting)):e.installing?(console.log("SW: new worker installing"),void o(e.installing)):void e.addEventListener("updatefound",(function(t){console.log("SW: new worker found, track installation",t),e.installing&&o(e.installing)}))})).catch((function(e){console.log("SW: Service worker registration failed : ",e)}));let e=!1;navigator.serviceWorker.addEventListener("controllerchange",(function(){if(console.log("SW: Refresh page!",e),e)return;confirm("New version available! Do you want to reload?")&&window.location.reload(),e=!0}));var o=function(e){e.addEventListener("statechange",(function(){console.log("SW: STATE CHANGE",e.state),"installed"==e.state&&n(e)}))},n=function(e){console.log("SW: Update ready!"),e.postMessage({action:"skipWaiting"})};navigator.serviceWorker.onmessage=function(e){console.log("SW: Message form SW:",e.data)}}window.addEventListener("beforeinstallprompt",e=>{e.preventDefault()})}]);