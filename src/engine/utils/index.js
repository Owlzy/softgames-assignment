import {randomInt} from "../math";

export function objectToArray(obj) {
    const arr = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key))
            arr.push(obj[key]);
    }
    return arr;
}

export function selectRandom(arr) {
    return arr[randomInt(0, arr.length - 1)];
}

export function selectRandomAndRemove(arr) {
    const index = randomInt(0, arr.length - 1);
    const element = arr[index];
    arr.splice(index, 1);
    return element;
}

export function isCordova() {
    return !!window.cordova
}

/**
 * Detaches all signals from an object.
 * @param {object} object - The object from which signals should be detached.
 */
export function detachAllSignals(object) {
    for (const prop in object) {
        if (object.hasOwnProperty(prop) && object[prop] instanceof MiniSignal) {
            object[prop].detachAll();
        }
    }
}

/**
 * Pads a number with zeros up to a certain length.
 * @param {number} number - The number to be padded.
 * @param {number} length - The desired length of the padded number.
 * @returns {string} The padded number as a string.
 */
export function padNumberWithZeros(number, length) {
    number = number.toString();

    if (number.length >= length) {
        return number;
    }

    const zerosToAdd = length - number.length;
    const paddingZeros = "0".repeat(zerosToAdd);

    return paddingZeros + number;
}

/**
 * Delayed call
 * @param callback
 * @param time
 * @param group
 * @returns {_Group.Tween}
 */
export function delay(callback, time, group) {
    return new TWEEN.Tween({x: 0}, group).to({x: 1}, time).onComplete(() => callback.call()).start();
}

export function copyObject(original) {
    return {...original};
}
