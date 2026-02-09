import Logger from './Logger'

/**
 * @class - handles updating scenes and order of scenes
 */
export default class SceneStack {

    constructor(stage) {
        this._scenes = [];
        this._stage = stage;
        this._logger = new Logger("SceneStack");
    }

    add(scene, index) {
        this._scenes.splice(scene, 0, index);
        this._stage.addChildAt(scene, index);
        scene.start();
    }

    remove(scene) {
        scene.destroy();
        this._scenes.splice(this._scenes.indexOf(scene), 1);
    }

    swap() {
        // todo
    }

    push(scene) {
        this._scenes.push(scene);
        this._stage.addChild(scene);
        scene.start();
        scene.resize();
    }

    pop() {
        const scene = this._scenes.pop();
        scene.destroy({children: true});
        /*
        this._scenes.splice[this._scenes.length - 1].destroy();
        this._scenes.splice(this._scenes.length - 1, 1);
         */
    }

    update(dt) {
        // always update top most scene
        if (this._scenes.length > 0) {
            this._scenes[this._scenes.length - 1].update(dt);

            // cycle array backwards to ovoid issues with splicing
            for (let i = this._scenes.length - 2; i >= 0; i--) {
                if (this._scenes[i].backgroundUpdate)
                    this._scenes[i].update(dt);
            }
        } else {
            //this._logger.log("no scenes in scene stack");
        }
    }

    resize() {
        for (let i = 0; i < this._scenes.length; i++) {
            this._scenes[i].resize();
        }
    }

}
