import {Container, ParticleContainer} from "pixi.js";
import {Emitter, upgradeConfig} from "@spd789562/particle-emitter";
import config from "../../config";

export default class FireParticles extends Container {
    constructor() {
        super();

        let config = ENG.asset.data("emitter-flame");

        this._particleContainer = new ParticleContainer();
        this.addChild(this._particleContainer);

        this._flameEmitter = new Emitter(this._particleContainer, upgradeConfig(config, [ENG.asset.texture("particle-fire"), ENG.asset.texture("particle-mote")]));
        this._flameEmitter.autoUpdate = false;
        this._flameEmitter.emit = true;

        config = ENG.asset.data("emitter-smoke");

        this._smokeEmitter = new Emitter(this._particleContainer, upgradeConfig(config, [ENG.asset.texture("particle-mote")]));
        this._smokeEmitter.autoUpdate = false;
        this._smokeEmitter.emit = true;
    }

    update(dt) {
        this._flameEmitter.update(dt);
        this._smokeEmitter.update(dt);
    }
}