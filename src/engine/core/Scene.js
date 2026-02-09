import View from "./View";
import * as ENG from "../index";
import {Container} from "pixi.js";

/**
 * @abstract
 * @class
 * @classdesc - Scene baseclass
 */
export default class Scene extends Container {

    get tweens() {
        return this._tweens;
    }

    static left() {
        if (ENG.view.dynamicView) {
            return (View.V_WIDTH - ENG.view.width) * 0.5;
        } else {
            return  0;
        }
    }

    static right() {
        if (ENG.view.dynamicView) {
            return (View.V_WIDTH + ENG.view.width) * 0.5;
        } else {
            return View.V_WIDTH;
        }
    }

    static top() {
        if (ENG.view.dynamicView) {
            return (View.V_HEIGHT - ENG.view.height) * 0.5;
        } else {
            return 0;
        }
    }

    static bottom() {
        if (ENG.view.dynamicView) {
            return (View.V_HEIGHT + ENG.view.height) * 0.5;
        } else {
            return View.V_HEIGHT;
        }
    }

    constructor() {
        super();
        /**
         * @type {{MiniSignal}}
         */
        this.signals = {};
        this.signals.next = new MiniSignal();
        this.signals.prev = new MiniSignal();
        this.signals.home = new MiniSignal();

        /**
         * @type {_Group}
         */
        this._tweens = new TWEEN.Group();

        /**
         * @type {boolean}
         */
        this.backgroundUpdate = true;
    }

    /**
     * @abstract
     */
    start() {
        this._logger && this._logger.log("start");
        this.resize();
    }

    destroy(options) {
        super.destroy(options);
        // cleanup signals
        this.signals.next.detachAll();
        this.signals.prev.detachAll();
        this.signals.home.detachAll();
    }

    update(dt) {
        this.tweens.update();
    }

    resize() {
        if (ENG.view.dynamicView) {
            if (ENG.view.landscape) {
                this.x = (ENG.view.width - View.V_WIDTH) * 0.5;
            } else {
                this.y = (ENG.view.height - View.V_HEIGHT) * 0.5;
            }
        }
    }
}