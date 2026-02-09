import {Button, Scene} from "../../engine";
import {Sprite} from "pixi.js";
import FireParticles from "../vfx/FireParticles";

export default class ParticlesScene extends Scene {
    constructor() {
        super();

        this._bg = new Sprite(ENG.asset.texture("bg-autumn"));
        this._bg.width = ENG.View.V_WIDTH + 2;
        this._bg.height = ENG.View.V_HEIGHT + 2;
        this.addChild(this._bg);

        this._fireParticles = new FireParticles();
        this._fireParticles.position.set(ENG.View.V_WIDTH / 2, ENG.View.V_HEIGHT / 2);
        this.addChild(this._fireParticles);

        let states = new Button.State();
        states.up = ENG.asset.texture("icon-cancel");

        this._backButton = new Button(states);
        this._backButton.visible = false;
        this._backButton.signals.clicked.add(this._onNext, this);
        this._backButton.overSound = "sfx_btn_over";
        this._backButton.downSound = "sfx_btn_down";
        this._backButton.visible = false;
        this.addChild(this._backButton);
    }

    start() {
        super.start();
        this.animateIn();
    }

    destroy() {
        super.destroy();
    }

    resize() {
        super.resize();

        this._backButton.position.set(ENG.Scene.right() - 80, ENG.Scene.top() + 60);
    }

    appear() {
        super.appear();
    }

    animateIn() {
        this._backButton.scale.set(0);
        new TWEEN.Tween(this._backButton.scale, this._tweens)
            .to({x: 1, y: 1}, 340)
            .easing(TWEEN.Easing.Back.Out)
            .delay(120)
            .onStart(() => {
                this._backButton.visible = true;
            })
            .start();
    }

    update(dt) {
        super.update(dt);
        this._fireParticles.update(dt);
    }

    _onNext(button) {
        this.signals.next.dispatch();
    }
}