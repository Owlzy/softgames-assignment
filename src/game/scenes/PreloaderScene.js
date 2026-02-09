import {Scene} from "../../engine";
import {View} from "../../engine";
import {Sprite, Text, Texture} from "pixi.js";

export default class PreloaderScene extends Scene {
    constructor() {
        super();

        // hack to preload fonts // TODO - can actually load webfonts using new Assets class now
        let style = {fontFamily: "archivo_blackregular"}
        this.addChild(new Text({text: "", style}))

        this._logo = new Sprite(ENG.asset.texture("logo_small"));
        this._logo.anchor.set(0.5);
        this._logo.position.set(View.V_WIDTH * 0.5, View.V_HEIGHT * 0.5 - 50);
        this.addChild(this._logo);

        this._barWidth = 444;

        this._bar = new Sprite(Texture.WHITE);
        this._bar.anchor.set(0, 0.5);
        this._bar.width = 0;
        this._bar.height = 8;
        this._bar.position.set(View.V_WIDTH * 0.5 - this._barWidth * 0.5, View.V_HEIGHT * 0.5 + 100);
        this._bar.tint = 0xb1212b;
        this.addChild(this._bar);

        this._loaded = 0;
    }

    start() {
        super.start();
    }

    update(dt) {
        super.update(dt);

        const width = this._loaded * this._barWidth;
        this._bar.width += (width - this._bar.width) * 0.14;
    }

    resize() {
        super.resize();
    }

    onProgress(p) {
        this._loaded = p / 100;
    }
}
