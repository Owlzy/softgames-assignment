import Logger from './Logger'
import MiniSignal from "mini-signals";

export default class Timer {
    constructor(amount) {
        this._logger = new Logger("Timer");

        this.signals = {};
        this.signals.timerFinish = new MiniSignal();

        this._remainingTime = amount;
        this._originalTime = amount;
    }

    // addListener: callback(cb) and context(ctx)
    addListener(cb, ctx) {
        this.signals.timerFinish.add(cb, ctx);
        return this;
    }

    update(dt) {
        this._remainingTime -= dt;
        if (this._remainingTime < 0) {
            this._remainingTime = this._originalTime;
            this.signals.timerFinish.dispatch(1);
        }
    }

    get TimerSignal() {
        return this.signals.timerFinish;
    }
}