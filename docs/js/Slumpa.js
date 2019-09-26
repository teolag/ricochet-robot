let initSeed, seed;
setRandomSeed();
export function randomInt(a, b) {
    if (a == undefined) {
        throw new Error("Invalid parameters, enter max, or max and min values");
    }
    if (b == undefined)
        b = 0;
    if (a < b)
        var min = a, max = b;
    else
        var min = b, max = a;
    return min + (Math.floor(rnd() * (max + 1 - min)));
}
export function randomInts(count, a, b) {
    var ints = [];
    for (var i = 0; i < count; i++) {
        ints.push(randomInt(a, b));
    }
    return ints;
}
export function randomFloat(a, b) {
    if (a == undefined) {
        throw new Error("Invalid parameters, enter max, or max and min values");
    }
    if (b == undefined)
        b = 0;
    if (a < b)
        var min = a, max = b;
    else
        var min = b, max = a;
    return min + (rnd() * (max - min));
}
export function randomFloats(c, a, b) {
    var floats = [];
    for (var i = 0; i < c; i++) {
        floats.push(randomFloat(a, b));
    }
    return floats;
}
export function randomBool(probability) {
    if (probability === undefined)
        probability = 0.5;
    return rnd() < probability ? true : false;
}
export function randomItems(arr, values, putBack) {
    if (putBack) {
        var result = [];
        for (var i = 0; i < values; i++) {
            result.push(arr[randomInt(0, arr.length - 1)]);
        }
        return result;
    }
    else {
        arr = shuffleCopy(arr);
        return arr.slice(0, values);
    }
}
export function randomOne(arr) {
    return arr[randomInt(0, arr.length - 1)];
}
var rnd = (function () {
    var a = 1664525, c = 1013904223, m = Math.pow(2, 32);
    return function () {
        seed = (a * seed + c) % m;
        return seed / m;
    };
}());
export function setSeed(newSeed) {
    initSeed = newSeed;
    seed = newSeed;
}
export function setRandomSeed() {
    setSeed(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
}
export function getSeed() {
    return initSeed;
}
export function shuffle(arr) {
    var j, tmp, i;
    for (i = arr.length; i; i -= 1) {
        j = Math.floor(rnd() * i);
        tmp = arr[i - 1];
        arr[i - 1] = arr[j];
        arr[j] = tmp;
    }
    return arr;
}
export function shuffleCopy(arr) {
    return shuffle(arr.slice(0));
}
export function getHash(str) {
    var hash = 0, i, chr, len;
    if (str.length === 0)
        return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
;
