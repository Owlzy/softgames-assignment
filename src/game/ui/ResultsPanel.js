import NineSlice from "./NineSlice";
import {Button} from "../../engine";
import {translate} from "../utils";

export default class ResultsPanel extends PIXI.Container {

    get button() {
        return this._replayButton;
    }

    constructor() {
        super();

        this._bg = new NineSlice(ENG.asset.texture("nine-slice"));
        this._bg.panelWidth = 620;
        this._bg.panelHeight = 400;
        this.addChild(this._bg);

        const style = new PIXI.TextStyle({
            align: "center",
            fill: 0xffffff,
            fontFamily: "chewyregular",
            fontSize: 38,
            lineJoin: "round",
            stroke: 0x25414d,
            strokeThickness: 8,
            wordWrap: true,
            wordWrapWidth: 500
        });
        this._label = new PIXI.Text(translate("results"), style);
        this._label.anchor.set(0.5);
        this._label.position.set(0, -100);
        this.addChild(this._label);

        let states = new Button.State();
        states.up = ENG.asset.texture("btn_secondary_up");
        //states.down = ENG.asset.texture("btn_primary_over");
        states.over = ENG.asset.texture("btn_secondary_over");
        states.icon = ENG.asset.texture("icon_replay");

        this._replayButton = new Button(states);
        //this._replayButton.visible = false;
        // this._replayButton.signals.clicked.add(this.onReplayClick, this);
        this._replayButton.overSound = "sfx_btn_over";
        this._replayButton.downSound = "sfx_btn_down";
        this._replayButton.position.set(0, 70);
        this.addChild(this._replayButton);
    }

}