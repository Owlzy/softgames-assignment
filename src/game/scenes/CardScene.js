import {Button, Scene} from "../../engine";
import {Container, PerspectiveMesh, Sprite} from "pixi.js";
import {randomInt} from "../../engine/math";
import {shuffle} from "../utils";

export default class CardScene extends Scene {
    constructor() {
        super();

        this._bg = new Sprite(ENG.asset.texture("bg-autumn"));
        this._bg.width = ENG.View.V_WIDTH + 2;
        this._bg.height = ENG.View.V_HEIGHT + 2;
        this.addChild(this._bg);

        // add a table mesh
        const texture = ENG.asset.texture("table");
        this._table = new PerspectiveMesh({
            texture,
            verticesX: 10,
            verticesY: 10
        });
        this._table.pivot.set(texture.width / 2, texture.height / 2);
        this._table.position.set(ENG.View.V_WIDTH / 2, ENG.View.V_HEIGHT / 2);
        this._table.scale.set(1.1);
        this.addChild(this._table);

        this._cards = [];
        this._outPoints = [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}];

        this._stacks = [];
        this._moveTimer = 0;

        this.createStacks();
        this.createCards();
        for (const s of this._stacks) this.layoutStack(s); // layout all stacks at start

        this._movingCardHolder = new Container();
        this._movingCardHolder.sortableChildren = true;
        this.addChild(this._movingCardHolder);

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

        this._moveTimer += dt;
        while (this._moveTimer >= 1) {
            this._moveTimer = 0;
            this.moveTopCardToOtherStack();
        }

        const camX = ENG.View.V_WIDTH / 2;
        const camY = ENG.View.V_HEIGHT * 0.75;

        const pitch = 0.6; // table tilt in radians
        const fov = 900;

        CardScene.projectCardTable(this._table, pitch, fov, camX, camY, this._outPoints);
        this._table.setCorners(
            this._outPoints[0].x, this._outPoints[0].y,
            this._outPoints[1].x, this._outPoints[1].y,
            this._outPoints[2].x, this._outPoints[2].y,
            this._outPoints[3].x, this._outPoints[3].y
        );

        for (const card of this._cards) {
            CardScene.projectCardTable(card, pitch, fov, camX, camY, this._outPoints);

            card.setCorners(
                this._outPoints[0].x, this._outPoints[0].y,
                this._outPoints[1].x, this._outPoints[1].y,
                this._outPoints[2].x, this._outPoints[2].y,
                this._outPoints[3].x, this._outPoints[3].y
            );
        }

        this.sortMoving();
    }

    sortMoving() {
        for (const child of this._movingCardHolder.children) {
            child.zIndex = child.y; // can just index by y
        }

        this._movingCardHolder.sortChildren(); // probably unneeded, but shouldn't hurt
    }

    createCards() {
        const suits = ["clubs", "diamonds", "hearts", "spades"];
        const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "a"];

        // build a list of region names
        let deckNames = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                deckNames.push(`${suit}${rank}`);
            }
        }

        // give it a quick shuffle, won't hurt, isn't properly shuffled cards, we actually have 3 decks shuffled the same, but is good enough
        deckNames = shuffle(deckNames);

        const total = 144;

        for (let i = 0; i < total; i++) {
            const name = deckNames[i % deckNames.length];
            const texture = ENG.asset.texture(name);

            const card = new PerspectiveMesh({
                texture,
                verticesX: 10,
                verticesY: 10
            });

            const w = texture.width;
            const h = texture.height;

            card.pivot.set(w / 2, h / 2);

            const stack = this._stacks[randomInt(0, this._stacks.length - 1)]; // random stack
            stack.addChild(card);
            this._cards.push(card);
        }
    }

    createStacks() {
        const cols = 3;

        for (let i = 0; i < cols; i++) {
            const stack = new Container();
            stack.sortableChildren = true;

            this.addChild(stack);
            this._stacks.push(stack);
        }
    }

    layoutStack(stack) {
        const stackIndex = this._stacks.indexOf(stack);

        const centerX = ENG.View.V_WIDTH / 2;
        const centerY = ENG.View.V_HEIGHT / 2;

        const colSpacing = 260;
        const startX = centerX - colSpacing;

        const baseX = startX + stackIndex * colSpacing;
        const baseY = centerY;

        const offsetY = 2;

        for (let i = 0; i < stack.children.length; i++) {
            const card = stack.children[i];

            card.position.set(baseX, baseY - i * offsetY);
            card.zIndex = i;
        }
    }

    moveTopCardToOtherStack() {
        // first lets pick a random stack to draw from
        const startStack = this._stacks[randomInt(0, this._stacks.length - 1)];

        // ensure it's moved to a different stack
        let endStack = startStack;
        while (startStack === endStack) {
            endStack = this._stacks[randomInt(0, this._stacks.length - 1)];
            if (endStack.children.length <= 10) {
                endStack = startStack; // if we pick a stack with little cards lets stay in the loop TODO - should probably add a max tries for safety
            }
        }

        const insertIndex = randomInt(0, endStack.children.length - 3); // we don't want to insert near to top of stack, this gives us some leeway
        const targetCard = endStack.children[insertIndex];

        const card = startStack.children[startStack.children.length - 1]; // take top card
        this._movingCardHolder.addChild(card); // we can move to a new container while we tween so its on top

        const moveTime = 1500;
        const insertTime = 500; // total 2 seconds

        const insertOffset = card.texture.height * 0.8;
        const edgeOffset = 30;

        const endIndex = this._stacks.indexOf(endStack);
        const xOffset = endIndex === 0 ? -edgeOffset : (endIndex === 1 ? 0 : edgeOffset); // only works for three stacks but is enough to fake the 3d effect

        // move it down below our target position so we can do a nice insert animation
        new TWEEN.Tween(card, this._tweens)
            .to({
                x: targetCard.x + xOffset,
                y: targetCard.y + insertOffset
            }, moveTime)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                // move to next stack container and ensure sorting is correct
                endStack.addChildAt(card, insertIndex);
                card.zIndex = insertIndex;

                // slide it into the deck
                new TWEEN.Tween(card, this._tweens)
                    .to({x: targetCard.x, y: targetCard.y}, insertTime)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onComplete(() => {
                        this.layoutStack(endStack);
                    })
                    .start();
            })
            .start();

        // add a couple of scale tweens so its like it's being picked up and coming towards the screen
        const a = new TWEEN.Tween(card.scale, this._tweens)
            .to({x: 1.1, y: 1.1}, moveTime)
            .easing(TWEEN.Easing.Quadratic.InOut);

        const b = new TWEEN.Tween(card.scale, this._tweens)
            .to({x: 1, y: 1}, insertTime)
            .easing(TWEEN.Easing.Quadratic.InOut);

        a.chain(b);
        a.start();
    }

    _onNext() {
        this.signals.next.dispatch();
    }

    /**
     *  Calculates a very basic 3d projection
     * @param mesh
     * @param pitchRad
     * @param fov
     * @param camX
     * @param camY
     * @param out
     */
    static projectCardTable(mesh, pitchRad, fov, camX, camY, out) {
        const w = mesh.texture.width;
        const h = mesh.texture.height;

        // corners in card centered space
        const local = [
            {x: -w / 2, y: -h / 2, z: 0}, // tl
            {x: w / 2, y: -h / 2, z: 0}, // tr
            {x: w / 2, y: h / 2, z: 0}, // br
            {x: -w / 2, y: h / 2, z: 0}, // bl
        ];

        const cosX = Math.cos(pitchRad);
        const sinX = Math.sin(pitchRad);

        const p = mesh.position;
        const cx = p.x;
        const cy = p.y;

        for (let i = 0; i < 4; i++) {
            let x = local[i].x;
            let y = local[i].y;
            let z = local[i].z;

            const y2 = cosX * y - sinX * z;
            const z2 = sinX * y + cosX * z;
            y = y2;
            z = z2;

            // convert to world before projection
            const wx = cx + x;
            const wy = cy + y;

            // rule of triangles, currently z is always zero so we don't get any scaling with depth, could easily extend projected mesh to add a z dimension, but we don't really need it
            const scale = fov / (fov - z);

            const sx = camX + (wx - camX) * scale;
            const sy = camY + (wy - camY) * scale;

            // convert projected screen back to local mesh space
            out[i].x = (sx - cx) + w / 2;
            out[i].y = (sy - cy) + h / 2;
        }
    }
}
