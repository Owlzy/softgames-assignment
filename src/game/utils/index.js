import common from "../../common";

export function translate(key) {
    const lang = common.config.language || "en";

    if (common.strings[key] && lang in common.strings[key]) {
        return common.strings[key][lang]; // Return translation if it exists
    }

    return key; // Return original key if no translation is found
}

export function isCordova() {
    return !!window.cordova
}

export function networkConnection() {

    if (!isCordova())
        return false;

    if (navigator.connection) {
        return (navigator.connection.type !== Connection.NONE &&
            navigator.connection.type !== Connection.UNKNOWN)
    }

    return false;
}

export function shuffle(array) {
    const shuffled = array.slice(); // Create a shallow copy
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
    }
    return shuffled;
}