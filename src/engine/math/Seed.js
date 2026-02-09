import SimplexNoise from "./SimplexNoise";

/**
 * @class Class representing a noise generator
 */
export default class Seed {
    /**
     * Simple hashing function takes a string and returns and integer
     * @param string
     * @returns {number}
     */
    static getHash(string) {
        let hash = 0;
        if (string.length === 0) {
            return hash;
        }
        for (let i = 0; i < string.length; i++) {
            const char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // convert to 32 bit integer
        }
        return Math.abs(hash);
    }

    /**
     * Takes a string used to generate a seed integer
     * @param seedingString
     */
    constructor(seedingString) {

        this._simplex = new SimplexNoise();
        this._value = Seed.getHash(seedingString);

    }

    /**
     * returns a float between 0-1
     * @param x - X coordinate to fetch from noise function
     * @returns {number}
     */
    random(x) {
        return (this._simplex.noise(x, this._value * 0.01) + 1) / 2
    }

    /**
     * returns integer from noise generator
     * @param x - X coordinate to fetch from noise function
     * @param min - min value in range
     * @param max - max value in range
     * @returns {number}
     */
    randomInt(x, min, max) {
        return Math.floor(this.randomFloat(x, min, max));
    }

    /**
     * returns integer from noise generator
     * @param x - X coordinate to fetch from noise function
     * @param min - min value in range
     * @param max - max value in range
     * @returns {number}
     */
    randomFloat(x, min, max) {
        return this.random(x) * (max - min + 1) + min;
    }

    /**
     * Selects element from array using simplex noise
     * @param x - X coordinate to fetch from noise function
     * @param arr
     * @returns {*}
     */
    selectRandom(x, arr) {
        return arr[Math.floor(this.random(x) * arr.length)];
    }

    randomSign(x) {
        return this.randomInt(x, 0, 1) * 2 - 1;
    }

    /**
     * returns noise, a float in range -1 to 1
     * @param x - X coordinate to fetch from noise function
     * @returns {number}
     */
    noise(x) {
        return this._simplex.noise(x, this._value);
    }

    get value() {
        return this._value;
    }
}