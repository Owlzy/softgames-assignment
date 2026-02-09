import common from "../common";
import {delay} from "../engine/utils";
import SaveData from "../SaveData";
import TitleScene from "./scenes/TitleScene";
import CardScene from "./scenes/CardScene";
import DialogueScene from "./scenes/DialogueScene";
import ParticlesScene from "./scenes/ParticlesScene";

export default class SceneManager {

    constructor(sceneStack) {
        this._sceneStack = sceneStack;

        common.save = new SaveData(common.config.save.id, common.config.save.version);
        common.save.loadGame();

        ENG.audio.mute(common.save.data.muted);
    }

    start() {
        this.showTitleScene();
    }

    showTitleScene() {
        const scene = new TitleScene();
        this._sceneStack.push(scene); // push new scene onto stack

        scene.signals.next.once(() => {
            this._sceneStack.pop();
            this.showCardScene();
        });

        scene.signals.home.once(() => {
            this._sceneStack.pop();
            this.showDialogueScene();
        });

        scene.signals.prev.once(() => {
            this._sceneStack.pop();
            this.showParticlesScene();
        });
    }

    showCardScene() {
        const scene = new CardScene();
        this._sceneStack.push(scene); // push new scene onto stack

        scene.signals.next.once(() => {
            this._sceneStack.pop();
            this.showTitleScene();
        });
    }

    showDialogueScene() {
        const scene = new DialogueScene();
        this._sceneStack.push(scene); // push new scene onto stack

        scene.signals.next.once(() => {
            this._sceneStack.pop();
            this.showTitleScene();
        });
    }

    showParticlesScene() {
        const scene = new ParticlesScene();
        this._sceneStack.push(scene); // push new scene onto stack

        scene.signals.next.once(() => {
            this._sceneStack.pop();
            this.showTitleScene();
        });
    }

}
