import {Button, Scene} from "../../engine";
import screenfull from 'screenfull';
import {Sprite, Text} from "pixi.js";

export default class TitleScene extends Scene {
    constructor() {
        super();

        this._bg = new Sprite(ENG.asset.texture("bg-autumn"));
        this._bg.width = ENG.View.V_WIDTH + 2;
        this._bg.height = ENG.View.V_HEIGHT + 2;
        this.addChild(this._bg);

        let states = new Button.State();
        states.up = ENG.asset.texture("btn-primary-up");

        this._cardsButton = new Button(states);
        this._cardsButton.visible = false;
        this._cardsButton.signals.clicked.add(this.onCardButtonClick, this);
        this._cardsButton.overSound = "sfx_btn_over";
        this._cardsButton.downSound = "sfx_btn_down";
        this._cardsButton.visible = false;
        this.addChild(this._cardsButton);

        const style = {
            fontFamily: "archivo_blackregular",
            fontSize: 52,
            fill: 0xfedd9c,
            fontWeight: "bold",
        };

        let text = new Text({text: "Cards", style});
        text.anchor.set(0.5);
        text.position.set(0, -5);
        this._cardsButton.view.addChild(text);

        this._dialogueButton = new Button(states);
        this._dialogueButton.visible = false;
        this._dialogueButton.signals.clicked.add(this.onDialogueButtonClick, this);
        this._dialogueButton.overSound = "sfx_btn_over";
        this._dialogueButton.downSound = "sfx_btn_down";
        this._dialogueButton.visible = false;
        this.addChild(this._dialogueButton);

        text = new Text({text: "Dialogue", style});
        text.anchor.set(0.5);
        text.position.set(0, -5);
        this._dialogueButton.view.addChild(text);

        this._particlesButton = new Button(states);
        this._particlesButton.visible = false;
        this._particlesButton.signals.clicked.add(this.onParticlesButtonClick, this);
        this._particlesButton.overSound = "sfx_btn_over";
        this._particlesButton.downSound = "sfx_btn_down";
        this._particlesButton.visible = false;
        this.addChild(this._particlesButton);

        text = new Text({text: "Particles", style});
        text.anchor.set(0.5);
        text.position.set(0, -5);
        this._particlesButton.view.addChild(text);
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

        this._cardsButton.position.set(ENG.View.V_WIDTH * 0.5, ENG.View.V_HEIGHT * 0.5 + 180);
        this._dialogueButton.position.set(ENG.View.V_WIDTH * 0.5, ENG.View.V_HEIGHT * 0.5 + 280);
        this._particlesButton.position.set(ENG.View.V_WIDTH * 0.5, ENG.View.V_HEIGHT * 0.5 + 380);
    }

    appear() {
        super.appear();
    }

    animateIn() {
        this._cardsButton.scale.set(0);
        new TWEEN.Tween(this._cardsButton.scale, this._tweens)
            .to({x: 1, y: 1}, 340)
            .easing(TWEEN.Easing.Back.Out)
            .delay(120)
            .onStart(() => {
                this._cardsButton.visible = true;
            })
            .start();

        this._dialogueButton.scale.set(0);
        new TWEEN.Tween(this._dialogueButton.scale, this._tweens)
            .to({x: 1, y: 1}, 340)
            .easing(TWEEN.Easing.Back.Out)
            .delay(220)
            .onStart(() => {
                this._dialogueButton.visible = true;
            })
            .start();

        this._particlesButton.scale.set(0);
        new TWEEN.Tween(this._particlesButton.scale, this._tweens)
            .to({x: 1, y: 1}, 340)
            .easing(TWEEN.Easing.Back.Out)
            .delay(320)
            .onStart(() => {
                this._particlesButton.visible = true;
            })
            .start();
    }

    update(dt) {
        super.update(dt);
    }

    onCardButtonClick(button) {
        this.signals.next.dispatch();
        ENG.audio.playMusic("music_loop");
        if (screenfull.isEnabled) {
            screenfull.request();
        }
    }

    onDialogueButtonClick(button) {
        this.signals.home.dispatch();
        ENG.audio.playMusic("music_loop");
        if (screenfull.isEnabled) {
            screenfull.request();
        }
    }

    onParticlesButtonClick(button) {
        this.signals.prev.dispatch();
        ENG.audio.playMusic("music_loop");
        if (screenfull.isEnabled) {
            screenfull.request();
        }
    }
}