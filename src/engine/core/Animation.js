// TODO
export default class Animation extends PIXI.Sprite {

    /**
     * @param frames
     */
    constructor(frames) {
        super(frames[0]);

        this._frames = frames;
        this._speed = 20;

        this._time = 0;
        this._frameIndex = 0;
    }

    update(dt) {
        this._time += dt;
        if (Math.floor(this._time) > this._frames.length / this._speed) {
            this._frameIndex++;
        }
    }

}