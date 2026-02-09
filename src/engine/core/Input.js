export default class Input {
    constructor() {

        this.signals = {
            keydown: new MiniSignal(),
            keyup: new MiniSignal()
        }

        document.addEventListener('keydown', (event) => {
            this.signals.keydown.dispatch(event.key);
        });

        document.addEventListener('keyup', (event) => {
            this.signals.keyup.dispatch(event.key);
        });

    }
}

const KEYS = {
    ARROW_RIGHT: "arrowright",
    ARROW_LEFT: "arrowleft",
    A: "a",
    D: "d",
};

export {KEYS};