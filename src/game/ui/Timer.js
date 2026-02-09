export default class Timer extends PIXI.Container {
    constructor(timerLength = 30) {
        super();

        this.completed = new MiniSignal();

        this._duration = timerLength;
        this._time = timerLength;

        // Back sprite
        this._back = new PIXI.Sprite(ENG.asset.texture("timer-back"));
        this._back.anchor.set(0.5);
        this.addChild(this._back);

        // Radial fill
        this._fill = new PIXI.Graphics();
        this.addChild(this._fill); // above _back

        this._fill.position.set(this._back.x, this._back.y); // center the fill
        this._fill.rotation = -Math.PI / 2; // so it starts from top like a clock

        this._running = false;
    }

    destroy() {
        super.destroy();
        this._fill.destroy();
        this.completed.detachAll();
    }

    start() {
        this._time = this._duration;
        this._running = true;
        this._fill.visible = true;
    }

    reset() {
        this._time = this._duration;
        this._fill.clear();
        this._running = false;
    }

    update(dt) {
        if (!this._running) return;

        this._time -= dt;

        const progress = Math.max(0, this._time / this._duration);

        // Clear and redraw the arc
        this._fill.clear();
        this._fill.beginFill(0x30708C, 1); // color and alpha
        this._drawRadial(progress);
        this._fill.endFill();

        if (this._time <= 0) {
            this._running = false;
            this._fill.visible = false;
            this.completed.dispatch();
        }
    }

    _drawRadial(progress) {
        const radius = 70;
        const angle = Math.PI * 2 * progress;

        this._fill.moveTo(0, 0);
        this._fill.arc(0, 0, radius, 0, angle);
        this._fill.lineTo(0, 0);
    }
}
