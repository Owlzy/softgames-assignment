import {Button, Scene} from "../../engine";
import {Container, TextStyle, Assets, Sprite} from "pixi.js";
import {RichText} from "../ui/RichText";

const ENDPOINT = "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords";

export default class DialogueScene extends Scene {
    constructor() {
        super();

        this._bg = new Sprite(ENG.asset.texture("bg-autumn"));
        this._bg.width = ENG.View.V_WIDTH + 2;
        this._bg.height = ENG.View.V_HEIGHT + 2;
        this.addChild(this._bg);

        this._loadedUrls = new Set();
        this._destroyed = false;

        this._emojiTex = {};
        this._avatar = {};

        this._chat = new Container();
        this.addChild(this._chat);

        this._data = null;

        // add a mask to dialogue so we can fade it out a bit
        this._dialogueMask = new Sprite(ENG.asset.texture("mask"));
        this._dialogueMask.anchor.set(0, 1);
        this._dialogueMask.position.set(0, ENG.View.V_HEIGHT - 80);
        this._dialogueMask.width = ENG.View.V_WIDTH;
        this._dialogueMask.height = 800;
        this._chat.mask = this._dialogueMask;
        this.addChild(this._dialogueMask);

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
        this.startDialogue();
    }

    async startDialogue() {
        await this.loadDialogueData();
        // start rendering
        this.renderDialogue();
    }

    async loadDialogueData() {
        const res = await fetch(ENDPOINT);
        this._data = await res.json();

        // load emoji textures (name -> Texture)
        await Promise.all(
            this._data.emojies.map(async (e) => {
                this._loadedUrls.add(e.url);
                this._emojiTex[e.name] = await Assets.load({
                    src: e.url,
                    loadParser: "loadTextures",
                });
            })
        );

        // load avatars (name -> { tex, position })
        await Promise.all(
            this._data.avatars.map(async (a) => {
                this._loadedUrls.add(a.url);
                this._avatar[a.name] = {
                    tex: await Assets.load({
                        src: a.url,
                        loadParser: "loadTextures",
                    }),
                    position: a.position, // "left" or "right"
                };
            })
        );
    }

    async renderDialogue() {
        const style = new TextStyle({
            fontFamily: "Arial",
            fontSize: 26,
            fill: 0xffffff,
            lineHeight: 32,
            wordWrap: false,
        });

        let y = ENG.View.V_HEIGHT - 160;
        const spacing = 18;

        const avatarSize = 102;

        for (const line of this._data.dialogue) {
            const who = this._avatar[line.name] ?? {position: "left", tex: null};

            const row = new Container();
            row.position.set(0, y);
            this._chat.addChild(row);

            const bubbleMaxW = Math.min(700, ENG.View.V_WIDTH - 160);

            let avatar;
            if (who.tex) {
                avatar = new Sprite(who.tex);
                avatar.anchor.set(0.5);
                row.addChild(avatar);
            }

            const rich = new RichText(style, this._emojiTex, bubbleMaxW);
            rich.setText(line.text);
            row.addChild(rich);

            // basic left/right alignment
            if (who.position === "right") {
                const bubbleRightX = ENG.View.V_WIDTH - 280;
                if (avatar) avatar.position.set(bubbleRightX, 0);

                // place bubble to left of avatar
                rich.position.set(bubbleRightX - avatarSize - rich.width, -avatarSize * 0.5);
            } else {
                const bubbleLeftX = 280;
                if (avatar) avatar.position.set(bubbleLeftX, 0);

                rich.position.set(bubbleLeftX + avatarSize, -avatarSize * 0.5);
            }

            // measure row height
            const rowH = Math.max(avatarSize, rich.height);

            // shift existing rows up while bringing in new dialogue
            const shift = rowH + spacing;
            for (const child of this._chat.children) {
                new TWEEN.Tween(child, this._tweens)
                    .to({y: child.y - shift}, 300)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();
            }

            await sleep(3000);
            if (this._destroyed) return;
        }
    }

    destroy() {
        super.destroy();
        this._destroyed = true;

        for (const url of this._loadedUrls) {
            Assets.unload(url);
        }
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
    }

    _onNext(button){
        this.signals.next.dispatch();
    }
}

/**
 * Helper function for pausing exec with a promise
 * @param ms
 * @returns {Promise<unknown>}
 */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
