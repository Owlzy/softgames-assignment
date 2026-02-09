import md5 from "md5";

export default class SaveData {

    get data() {
        return this._data;
    }

    constructor(gameId, version) {
        this._gameId = gameId;
        this._version = version;

        this._data = {
            muted: false
        };

        this.isFirstPlay = false;
    }

    saveGame() {
        const data = this._data;

        const save = {};
        save.hash = md5(JSON.stringify(data)) + "d2qsZXv2KtPcXWPzwkUn";
        save.data = data;

        localStorage.setItem(this._gameId + "_" + this._version, JSON.stringify(save));

        return save.hash;
    }

    loadGame() {
        let dataString;

        dataString = localStorage.getItem(this._gameId + "_" + this._version);

        const save = JSON.parse(dataString);
        if (!save) {
            this.saveGame();
            this.isFirstPlay = true;
        } else {
            //cheat protection
            const hash = md5(JSON.stringify(save.data)) + "d2qsZXv2KtPcXWPzwkUn";
            if (hash !== save.hash) {
                this.saveGame();
            } else {
                this._data = save.data;
            }
        }
    }

}