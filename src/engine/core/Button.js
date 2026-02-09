import {Container, Sprite} from "pixi.js";

/*
    button state interface
 */
export class State {
    constructor() {
        this.up = null;
        this.down = null;
        this.over = null;
        this.icon = null;
        this.iconAlt = null;
    }
}

State.UP = "up";
State.DOWN = "down";
State.OVER = "over";
State.OUT = "out";

export default class Button extends Container {

    get view() {
        return this._view;
    }

    get sprite() {
        return this._sprite;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(value) {
        this._enabled = value;
    }

    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
        this._label.anchor.set(0.5);
        this._view.addChild(this._label);
    }

    constructor(states) {
        super();

        this.signals = {};
        this.signals.clicked = new MiniSignal();

        this._textureStates = states;
        this._enabled = true;
        this._state = null;

        /**
         * @type {Container}
         * @private
         */
        this._view = new Container();
        this.addChild(this._view);

        /**
         * @type {?Text}
         * @private
         */
        this._label = null;

        /**
         * @type {Sprite}
         * @private
         */
        this._sprite = new Sprite(states.up || Texture.EMPTY);
        this._sprite.anchor.set(0.5);
        this._view.addChild(this._sprite);

        this._icon = null;

        if (states.icon) {
            this._icon = new Sprite(states.icon);
            this._icon.anchor.set(0.5);
            this._view.addChild(this._icon);
        }

        // setup interactivity
        this._view.eventMode = 'static';
        this._view.cursor = 'pointer';

        // down
        this._view.on('mousedown', this._onDown.bind(this));
        this._view.on('touchstart', this._onDown.bind(this));

        // up
        this._view.on('mouseup', this._onUp.bind(this));
        this._view.on('touchend', this._onUp.bind(this));
        this._view.on('touchendoutside', this._onUp.bind(this));
        this._view.on('mouseupoutside', this._onUpOutside.bind(this));

        //over
        this._view.on('mouseover', this._onOver.bind(this));
        this._view.on('mouseout', this._onOut.bind(this));

        /**
         * @type {string}
         */
        this.downSound = "";

        /**
         * @type {string}
         */
        this.overSound = "";

        this._setState(this._textureStates.up);
    }

    _setState(state) {
        this._stateEnd();
        const last = this._state;
        this._state = state;
        this._stateBegin(last);
    }

    _stateBegin(last) {
        switch (this._state) {
            case State.UP: {
                if (this._textureStates.up) {
                    this._sprite.texture = this._textureStates.up;
                }
                if (!isMobile.any && this._textureStates.over) {
                    this._sprite.texture = this._textureStates.over;
                }
                new TWEEN.Tween(this._view.scale)
                    .to({x: 1, y: 1}, 90)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start();

                if (isMobile.any && last === State.DOWN) {
                    this._clicked();
                }
                break;
            }
            case State.DOWN: {
                if (this._textureStates.down) {
                    this._sprite.texture = this._textureStates.down;
                }
                new TWEEN.Tween(this._view.scale)
                    .to({x: 0.975, y: 0.975}, 90)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start();
                break;
            }
            case State.OVER: {
                if (this._textureStates.over) {
                    this._sprite.texture = this._textureStates.over;
                }
                new TWEEN.Tween(this._view.scale)
                    .to({x: 1.025, y: 1.025}, 90)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start();
                if (last === State.DOWN) {
                    this._clicked();
                }
                break;
            }
            case State.OUT: {
                if (this._textureStates.up) {
                    this._sprite.texture = this._textureStates.up;
                }
                new TWEEN.Tween(this._view.scale)
                    .to({x: 1, y: 1}, 120)
                    .easing(TWEEN.Easing.Back.Out)
                    .start();
                break;
            }
        }
    }

    _stateEnd() {
        switch (this._state) {
            case State.UP: {
                break;
            }
            case State.DOWN: {
                break;
            }
            case State.OVER: {
                new TWEEN.Tween(this._view.scale)
                    .to({x: 1, y: 1}, 90)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start();
                break;
            }
            case State.OUT: {
                new TWEEN.Tween(this._view.scale)
                    .to({x: 1, y: 1}, 90)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start();
                break;
            }
        }
    }

    _clicked() {
        this.signals.clicked.dispatch();

        if (this.downSound && typeof this.downSound === "string" && this.downSound !== "") {
            ENG.audio.playSound(this.downSound);
        }
    }

    _onDown(event) {
        if (!this._enabled)
            return;
        this._setState(State.DOWN);
    }

    _onUp(event) {
        if (!this._enabled)
            return;
        if (isMobile.any)
            this._setState(State.UP);
        else
            this._setState(State.OVER);
    }

    _onOver(event) {
        if (!this._enabled)
            return;
        this._setState(State.OVER);

        if (this.overSound && typeof this.overSound === "string" && this.overSound !== "") {
            ENG.audio.playSound(this.overSound);
        }
    }

    _onOut(event) {
        if (!this._enabled)
            return;
        this._setState(State.OUT);
    }

    _onUpOutside(event) {
        if (!this._enabled)
            return;
        this._setState(State.UP);
    }

}

Button.State = State;