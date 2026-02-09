import SimplexNoise from "./SimplexNoise";
export default class Shake {
    constructor(width = -1, height = -1) {

        /*
         * Stage width
         * @member {number}
         * @private
         */
        this._width = width;

        /*
        * Stage height
        * @member {number}
        * @private
        */
        this._height = height;

        /**
         * Perlin noise generator
         * @member {SimplexNoise}
         * @private
         */
        this._simplex = new SimplexNoise();

        /**
         * Trauma level, increase to add to trauma
         * @member {number}
         * @private
         */
        this._trauma = 0;

        /**
         * Should shake include rotation?
         * @member{boolean}
         * @private
         */
        this._useRotation = false;

        /**
         * The display object we want to shake
         * @member {null|PIXI.Point|PIXI.DisplayObject}
         * @private
         */
        this._shakeTarget = null;

        /**
         * Position of object before shake, use to reset position each frame and at end of animation.
         * Set when setting the trauma level when the target isn't already shaking
         * @member {null|PIXI.Point}
         * @private
         */
        this._shakeStart = null;

        /**
         * How quickly should the trauma fade, higher levels result in quicker fade
         * @member {number}
         * @private
         */
        this._traumaFade = 0.5;

        /**
         * Max X offset for shake.  Increase to turn up shake violence.
         * @member {number}
         * @private
         */
        this._maxOffsetX = 15;

        /**
         * Max Y offset for shake.  Increase to turn up shake violence.
         * @member {number}
         * @private
         */
        this._maxOffsetY = 15;

        /**
         * Max rotational offset for shake.  Increase to turn up shake violence.
         * @member {number}
         * @private
         */
        this._maxRot = Math.PI * 0.01;

        /**
         * Is shaking flag
         * @member {boolean}
         * @private
         */
        this._shaking = false;

        /**
         * Random seed
         * @member {*|number}
         * @private
         */
        this._seed = Math.random();

        /**
         * Step is incremented each frame, for our stepped procedural noise generator
         * @member {number}
         * @private
         */
        this._step = 0;

        /**
         * Rotational centre point
         * @member {PIXI.Point}
         * @private
         */
        this._centre = null;

        /**
         * Optional callback function for when shake ends
         * @member {null|function}
         * @private
         */
        this._onShakeEnd = null;

    }

    /**
     * @param dt
     */
    update(dt) {

        if (this._width > -1 && this._height > -1 && this._useRotation && this._centre) {
            this._shakeTarget.pivot.set(
                this._centre.x + (this._shakeTarget.x - this._width * 0.5),
                this._centre.y + (this._shakeTarget.y - this._height * 0.5)
            );
        }

        if (!this._shakeTarget || !this._shaking) return;

        this._resetTarget();

        const offsetX = this._trauma * this._maxOffsetX * this._simplex.noise(this._seed, this._step);
        const offsetY = this._trauma * this._maxOffsetY * this._simplex.noise(this._seed + 1, this._step);

        this._shakeTarget.x += offsetX;
        this._shakeTarget.y += offsetY;

        if (this._useRotation) {
            this._shakeTarget.rotation += this._trauma * this._maxRot * this._simplex.noise(this._seed + 2, this._step);
        }

        this._trauma -= dt * this._traumaFade;
        this._step++;

        if (this._trauma < 0) {
            this._end();
        }
    }

    setTarget(target) {
        target = target || this._shakeTarget;
        this._shakeTarget = target;
        this._shakeStart = new PIXI.Point(target.x, target.y);
        this._shakeStartRot = target.rotation;
        this._step = 0;
    }

    setRotCentre(point) {
        this._centre = point;
    }

    _end() {
        this._resetTarget();
        this._shaking = false;
        if (this._onShakeEnd) this._onShakeEnd();//cb
    }

    _resetTarget() {
        this._shakeTarget.position.set(this._shakeStart.x, this._shakeStart.y);
        if (this._useRotation) this._shakeTarget.rotation = this._shakeStartRot;
    }

    get trauma() {
        return this._trauma;
    }

    set trauma(value) {

        //todo - should we make new start when trauma is incremented?
        if (this._shakeTarget && !this._shaking) {
            this._shakeStart = new PIXI.Point(this._shakeTarget.x, this._shakeTarget.y);
        }

        this._shaking = true;
        this._trauma = value;

        //capped at 0-1 range
        if (this._trauma > 1) {
            this._trauma = 1;
        }
    }

    get useRotation() {
        return this._useRotation;
    }

    set useRotation(value) {
        this._useRotation = value;
    }

    get maxOffsetX() {
        return this._maxOffsetX;
    }

    set maxOffsetX(value) {
        this._maxOffsetX = value;
    }

    get maxOffsetY() {
        return this._maxOffsetY;
    }

    set maxOffsetY(value) {
        this._maxOffsetY = value;
    }

    get maxRot() {
        return this._maxRot;
    }

    set maxRot(value) {
        this._maxRot = value;
    }

    get traumaFade() {
        return this._traumaFade;
    }

    set traumaFade(value) {
        this._traumaFade = value;
    }

    set onShakeEnd(value) {
        this._onShakeEnd = value;
    }
}