import {Ticker} from "pixi.js";

/**
 * @class
 * @classdesc - Provides delta time calc
 */
export default class GameTime {

    set calculateDelta(value) {
        this._calculateDelta = value;
    }

    get dt() {
        return this._dt;
    }

    constructor() {
        this._elapsed = null;
        this._dt = null;
        this._calculateDelta = true;
        this._tweens = new TWEEN.Group();
    }

    update(dt = 0) {
        // calculate the dt to use for sync of animations
        if (this._calculateDelta || !dt) {
            const now = performance.now();
            this._dt = (now - this._elapsed) * 0.001;
            this._elapsed = now;
        } else {
            this._dt = dt / Ticker.targetFPMS / 1000;
        }
        // update global tween group
        this._tweens.update();
    }

    delay(callback, time) {
        new TWEEN.Tween({}, this._tweens).to({}, time).onComplete(() => callback.call()).start();
    }

}