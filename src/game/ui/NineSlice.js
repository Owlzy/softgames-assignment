import {Container, NineSliceSprite} from "pixi.js";

export default class NineSlice extends Container {

    set panelWidth(value) {
        this._bg.width = value;
        this._bg.pivot.x = value * 0.5;
    }

    set panelHeight(value) {
        this._bg.height = value;
        this._bg.pivot.y = value * 0.5;
    }

    get image() {
        return this._bg;
    }

    constructor(texture) {
        super();

        const options = {};
        options.texture = texture;
        options.leftWidth = 50;
        options.topHeight = 50;
        options.rightWidth = 50;
        options.bottomHeight = 50;

        this._bg = new NineSliceSprite(options);
        this._bg.pivot.set(this._bg.width * 0.5, this._bg.height * 0.5);
        this.addChild(this._bg);

    }
}