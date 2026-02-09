import {audio, Button} from "../index";

export default class MuteButton extends Button {
    constructor(states) {
        super(states);

        if (audio.isMuted) {
            this._icon.texture = this._textureStates.iconAlt;
        }
    }

    _clicked() {
        audio.mute(!audio.isMuted);

        if (audio.isMuted) {
            this._icon.texture = this._textureStates.iconAlt;
        } else {
            this._icon.texture = this._textureStates.icon;
        }

        super._clicked();
    }
}