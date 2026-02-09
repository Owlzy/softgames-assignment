export default class CameraLayer {
    /**
     * @param {PIXI.Container} view
     * @param {PIXI.Point} [parallax]
     */
    constructor(view, parallax) {
        /**
         * @type {PIXI.Container}
         * @private
         */
        this._view = view;

        /**
         * @type {PIXI.Point}
         * @private
         */
        this._parallax = parallax || new PIXI.Point();
    }

    /**
     * @returns {PIXI.Container}
     */
    get view() {
        return this._view;
    }

    /**
     * @returns {PIXI.Point}
     */
    get parallax() {
        return this._parallax;
    }
}