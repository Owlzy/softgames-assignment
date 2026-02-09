import {Howl, Howler} from "howler";

/**
 * @class
 */
export default class AudioManager {

    set volume(value) {
        this._volume = value ? 0 : 1;
    }

    get isMuted() {
        return this._isMuted;
    }

    constructor() {
        this._volume = 1;
        this._cache = {};
        this._isMuted = false;
        this._music = null;
    }

    loadFiles(files) {
        for (let i = 0; i < files.length; i++) {
            const uri = "./assets/" + files[i].uri;
            this._addSound(files[i].name, uri);
        }
    }

    playSound(name, options = {loop: false, volume: 1, onComplete: null}) {
        if (this._cache[name]) {
            const howl = this._cache[name];
            const id = howl.play();
            howl.volume(options.volume * this._volume, id);
            howl.loop(options.loop, id);
            howl.idCached = id;
            if (options.onComplete) {
                howl.on("end", options.onComplete);
            }
            return howl;
        } else {
            console.warn("Could not find sound: ", name);
            return null;
        }
    }

    playMusic(name, options = {volume: 1}) {
        this.stopMusic();
        options.loop = true;
        this._music = this.playSound(name, options);
    }

    stopMusic() {
        if (!this._music)
            return;

        this._music.stop();
        this._music = null;
    }

    _addSound(name, uri) {
        const howl = new Howl({
            src: [uri],
            volume: 1,
            loop: false,
            autoplay: false,
            preload: true,
            html5: false
        });
        howl.name = name;
        this._cache[name] = howl;
        return howl;
    }

    mute(muted) {
        if (muted)
            Howler.volume(0);
        else
            Howler.volume(1);

        this._isMuted = muted;
    }

    muteMusic(muted) {
        if (!this._music)
            return;

        if (muted)
            this._music.volume(0);
        else
            this._music.volume(1);
    }

}