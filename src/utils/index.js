import common from "../common";

/**
 * @param key
 * @returns {string}
 */
export function translate(key) {
    key = key.toLowerCase();
    return common.strings[key][common.language];
}

export function isCordova() {
    return !!window.cordova;
}