!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=5)}([function(t,e,n){"use strict";n.d(e,"b",(function(){return r})),n.d(e,"a",(function(){return a}));var r,o=n(2);!function(t){t[t.NORTH=1]="NORTH",t[t.WEST=2]="WEST",t[t.EAST=4]="EAST",t[t.SOUTH=8]="SOUTH"}(r||(r={}));class a{constructor(t,e){this.h=t,this.w=e,this.tiles=new Array(t).fill(null).map(()=>new Array(e).fill(0)),this.addTopWalls(),this.addBottomWalls(),this.addLeftWalls(),this.addRightWalls()}addWall(t,e,n){if(t<0||t>=this.w)throw Error(`x must be between 0 and ${this.w-1}, was: ${t}`);if(e<0||e>=this.h)throw Error(`y must be between 0 and ${this.h-1}, was: ${e}`);this.addSingleWall(t,e,n);const r=this.getTileBehindTheWall(t,e,n);if(r){const t=this.getOppositeWall(n);this.addSingleWall(r.x,r.y,t)}}addRandomWalls(t){let e=0,n=0;for(;e<t&&n<1e3;){n++;const t=o.b([r.NORTH,r.EAST,r.WEST,r.SOUTH]),a=o.a(0,this.w-1),s=o.a(0,this.h-1);this.tiles[s][a]&t||(this.addWall(a,s,t),e++)}}addSingleWall(t,e,n){const r=this.tiles[e][t];this.tiles[e][t]=r|n}getTileBehindTheWall(t,e,n){return n===r.NORTH&&e>0?{x:t,y:e-1}:n===r.WEST&&t>0?{x:t-1,y:e}:n===r.EAST&&t+1<this.w?{x:t+1,y:e}:n===r.SOUTH&&e+1<this.h?{x:t,y:e+1}:null}getOppositeWall(t){switch(t){case r.NORTH:return r.SOUTH;case r.SOUTH:return r.NORTH;case r.EAST:return r.WEST;case r.WEST:return r.EAST;default:throw Error("Invalid wall "+t)}}addTopWalls(){for(let t=0;t<this.w;t++)this.addSingleWall(t,0,r.NORTH)}addBottomWalls(){for(let t=0;t<this.w;t++)this.addSingleWall(t,this.h-1,r.SOUTH)}addLeftWalls(){for(let t=0;t<this.h;t++)this.addSingleWall(0,t,r.WEST)}addRightWalls(){for(let t=0;t<this.h;t++)this.addSingleWall(this.w-1,t,r.EAST)}}},function(t,e,n){"use strict";n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return a})),n.d(e,"d",(function(){return s})),n.d(e,"a",(function(){return i}));var r=n(0);function o(t,e,n){const o={x:e.x,y:e.y},a=Math.max(...n.filter(t=>t.x===o.x&&t.y<o.y).map(t=>t.y));for(;o.y>0&&(o.y-1!==a&&!l(t,o.x,o.y,r.b.NORTH));o.y--);return o.y===e.y?null:{pos:o,dir:"upp"}}function a(t,e,n){const o={x:e.x,y:e.y},a=Math.min(...n.filter(t=>t.x===e.x&&t.y>o.y).map(t=>t.y));for(;o.y<t.h&&(o.y+1!==a&&!l(t,e.x,o.y,r.b.SOUTH));o.y++);return o.y===e.y?null:{pos:o,dir:"ner"}}function s(t,e,n){const o={x:e.x,y:e.y},a=Math.max(...n.filter(t=>t.y===o.y&&t.x<o.x).map(t=>t.x));for(;o.x>0&&(o.x-1!==a&&!l(t,o.x,o.y,r.b.WEST));o.x--);return o.x===e.x?null:{pos:o,dir:"vänster"}}function i(t,e,n){const o={x:e.x,y:e.y},a=Math.min(...n.filter(t=>t.y===o.y&&t.x>o.x).map(t=>t.x));for(;o.x<t.w&&(o.x+1!==a&&!l(t,o.x,o.y,r.b.EAST));o.x++);return o.x===e.x?null:{pos:o,dir:"höger"}}function l(t,e,n,r){return 0!=(t.tiles[n][e]&r)}},function(t,e,n){"use strict";let r,o;function a(t,e){if(null==t)throw new Error("Invalid parameters, enter max, or max and min values");if(null==e&&(e=0),t<e)var n=t,r=e;else n=e,r=t;return n+Math.floor(l()*(r+1-n))}function s(t){return t[a(0,t.length-1)]}n.d(e,"a",(function(){return a})),n.d(e,"b",(function(){return s})),n.d(e,"c",(function(){return c})),n.d(e,"d",(function(){return d})),c(Math.floor(Math.random()*Number.MAX_SAFE_INTEGER));var i,l=(i=Math.pow(2,32),function(){return(o=(1664525*o+1013904223)%i)/i});function c(t){r=t,o=t}function d(t){var e,n,r;for(r=t.length;r;r-=1)e=Math.floor(l()*r),n=t[r-1],t[r-1]=t[e],t[e]=n;return t}},function(t,e,n){"use strict";var r;n.d(e,"a",(function(){return r})),function(t){t.PING="PING",t.PONG="PONG",t.SOLVE="SOLVE",t.SOLVE_END="SOLVE_END",t.SOLVE_PROGRESS="SOLVE_PROGRESS"}(r||(r={}))},function(t,e,n){"use strict";if("serviceWorker"in navigator){console.log("SW: register service worker"),navigator.serviceWorker.register("/sw.js").then((function(t){return console.log("SW: service worker registered"),navigator.serviceWorker.controller||console.log("SW: first visit"),t.waiting?(console.log("SW: new worker ready"),void o(t.waiting)):t.installing?(console.log("SW: new worker installing"),void r(t.installing)):void t.addEventListener("updatefound",(function(e){console.log("SW: new worker found, track installation",e),t.installing&&r(t.installing)}))})).catch((function(t){console.log("Service worker registration failed : ",t)}));let t=!1;navigator.serviceWorker.addEventListener("controllerchange",(function(){if(console.log("SW: Refresh page!",t),t)return;confirm("New version available! Do you want to reload?")&&window.location.reload(),t=!0}));var r=function(t){t.addEventListener("statechange",(function(){console.log("SW: STATE CHANGE",t.state),"installed"==t.state&&o(t)}))},o=function(t){console.log("SW: Update ready!"),t.postMessage({action:"skipWaiting"})};navigator.serviceWorker.onmessage=function(t){console.log("SW: Message form SW:",t.data)}}window.addEventListener("beforeinstallprompt",t=>{t.preventDefault()})},function(t,e,n){"use strict";n.r(e);var r=n(0);class o{constructor(t,e,n){this.id=t,this.color=t,this.x=e,this.y=n}getPos(){return{x:this.x,y:this.y}}setPos(t){this.x=t.x,this.y=t.y}clone(){return new o(this.id,this.x,this.y)}}class a{constructor(t,e,n){this.x=t,this.y=e,this.color=n}}var s=n(2);class i{constructor(t,e,n){this.board=new r.a(t,e),this.board.addRandomWalls(t*e/5);const i=[];for(let t=0;t<this.board.w;t++)for(let e=0;e<this.board.h;e++)i.push({x:t,y:e});const l=s.d(i);this.robots=new Array(n).fill(null).map((t,e)=>{const n=l.pop();return new o(e,n.x,n.y)});const c=l.pop();this.goal=new a(c.x,c.y,0)}}var l=n(3);let c,d,u;const f=document.getElementById("solverStatus");if(!f)throw Error("Could not find solver status element");const h=t=>f.innerText=t;function g(t){switch(t.data.type){case l.a.SOLVE_END:d=t.data.result,console.log("SOLVE DONE",t.data.result),d.completed?h("Klar!"):h("Hittade igen");break;case l.a.SOLVE_PROGRESS:u=t.data.progress,h("Checked "+u.checkedStates);break;default:throw Error("Unknown message from web worker: "+t.data.type)}}var y=n(1);n(4);let S,E,w,p,v,b=0;function m(){const t=Math.floor(1e6*Math.random());location.hash=t.toString(),s.c(t)}const x=parseInt(location.hash.substr(1));x?s.c(x):m();const T=document.getElementById("movesCounter");if(!T)throw Error("moves counter not found");let W=0;const O=t=>{W=t,T.innerText=t.toString()},k=document.querySelector(".board"),L=document.getElementById("btnReset"),R=document.getElementById("btnRestart");if(!R)throw Error("restartbutton not found");function H(){var t;S=new i(10,10,4),t=S,c&&c.terminate(),d=null,(c=new Worker("js/solver-worker.js")).onmessage=g,c.postMessage({type:l.a.SOLVE,level:t});const e=function(t){return"<table><tr>"+t.board.tiles.map((e,n)=>e.map((e,o)=>{let a="";const s=[];return e&r.b.NORTH&&s.push("wall-north"),e&r.b.EAST&&s.push("wall-east"),e&r.b.WEST&&s.push("wall-west"),e&r.b.SOUTH&&s.push("wall-south"),t.goal.x===o&&t.goal.y===n&&(a=`<div class="goal goal-${t.goal.color}"></div>`),t.robots.forEach(t=>{t.x===o&&t.y===n&&(a=`<div class="start start-${t.color}"></div>`)}),`<td class='${s.join(" ")}'>${a}</td>`}).join("")).join("</tr><tr>")+"</tr></table>"}(S);if(!k)throw Error("could not find board");k.innerHTML=e,(v=S.robots.map(t=>{const e=document.createElement("div");return e.classList.add("robot","robot-"+t.color),e.innerText=(t.color+1).toString(),e.addEventListener("click",e=>U(t.color)),e})).forEach(t=>{k.appendChild(t)}),M()}function M(){var t;S&&(O(0),t=S.robots,(E=t.map(t=>t.clone())).forEach((t,e)=>{_(v[e],t.getPos())}),U(0))}R.addEventListener("click",()=>{m(),H()}),H(),document.body.addEventListener("keydown",t=>{switch(t.key){case"ArrowUp":I(y.b);break;case"ArrowDown":I(y.c);break;case"ArrowLeft":I(y.d);break;case"ArrowRight":I(y.a);break;case"1":U(0);break;case"2":U(1);break;case"3":U(2);break;case"4":U(3)}}),M(),U(0);const N=document.getElementById("btnUp");N&&N.addEventListener("click",t=>I(y.b));const A=document.getElementById("btnDown");A&&A.addEventListener("click",t=>I(y.c));const P=document.getElementById("btnLeft");P&&P.addEventListener("click",t=>I(y.d));const j=document.getElementById("btnRight");if(j&&j.addEventListener("click",t=>I(y.a)),!L)throw Error("reset button not found");function I(t){const e=t(S.board,w,p);if(e&&(_(v[b],e.pos),w.setPos(e.pos),O(W+1),function(){const t=E[S.goal.color];return t.x===S.goal.x&&t.y===S.goal.y}())){const t=d;if(!t)return void alert("Grattis, du klarade det innan solvern");const e=function(t,e){return t===e?3:t<=1+Math.floor(1.3*e)?2:1}(W,t.route.length);setTimeout(()=>{alert("tjohooo!! Score: "+"⭐".repeat(e))},400)}}function _(t,e){t.style.transform=`translate(${38*e.x+10}px, ${38*e.y+10}px)`}function U(t){t>E.length||(b=t,w=E[t],p=E.filter(e=>e.color!==t),v.forEach((e,n)=>{e.classList.toggle("active",n===t)}))}L.addEventListener("click",M)}]);