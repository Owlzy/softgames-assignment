import common from "./common";
import PreloaderScene from "./game/scenes/PreloaderScene";
import SceneManager from "./game/SceneManager";
import {Resolver, BaseTexture, MIPMAP_MODES, Ticker} from 'pixi.js';

/**
 * @class
 * @classdesc - Application class sets up scene stack, file loading, listeners etc.
 */
export default class App {
    constructor() {
        /**
         * @type {Logger}
         * @private
         */
        this._logger = new ENG.Logger("App");

        /**
         * @type {SceneStack}
         * @private
         */
        this._sceneStack = null;

        /**
         *
         * @type {null | SceneManager}
         * @private
         */
        this._sceneManager = null;
    }

    init() {
        window.addEventListener('blur', function () {
            ENG.audio.muteMusic(true);
        }, false);

        window.addEventListener('focus', function () {
            ENG.audio.muteMusic(false);
        }, false);

        // change suffix to “_2x” style (instead of Pixi’s default @2x, needed for some clients)
        //Resolver.RETINA_PREFIX = /_(?=[^_]*$)(.+)x/;

        // ENG.Logger.LOG = false; // disable logging
        ENG.gameTime.calculateDelta = false;

        ENG.view.init({
            v_width: 2520,
            v_height: 1080,
            landscape: true,
            backgroundColor: 0xffffff,
        })
            .then(() => {
                // now the app, renderer, stage, resize‑plugin, etc. are all ready

                // install your resize listener
                ENG.view.signals.resized.add(this._onResize, this);

                // and now it’s safe to build a scene stack
                this._sceneStack = new ENG.SceneStack(ENG.view.rootNode);

                const ext = ".mp3";
                ENG.audio.loadFiles([
                    // sfx
                    {name: "sfx_btn_down", uri: "audio/sfx/sfx_btn_down" + ext},
                    {name: "sfx_btn_over", uri: "audio/sfx/sfx_btn_over" + ext},
                    // music
                    {name: "music_loop", uri: "audio/music/music_loop" + ext},
                ]);

                Ticker.shared.add(this.update, this);

                ENG.asset.load([
                    // data
                    {name: "logo_small", uri: "assets/textures/logo_small.png"},
                ]);

                let isMute = ENG.audio.isMuted;

                window.pauseGame = function () {
                    console.log("game pause");
                    isMute = ENG.audio.isMuted;
                    ENG.audio.mute(true);
                }

                window.startGame = function () {
                    console.log("game start");
                    ENG.audio.mute(isMute);
                }
            })
            .catch(err => {
                console.error('View.init failed:', err);
            });

        // attach preloader loaded signal
        ENG.asset.signals.loadCompleted.once(() => {
            ENG.asset.signals.loadProgressed.add(this._onLoadingProgress, this); // setup loading event
            ENG.asset.signals.loadCompleted.add(this._onLoadingCompleted, this); // setup loading complete event

            setTimeout(() => {
                // load main assets
                ENG.asset.load([
                    // data
                    {name: "config", uri: "assets/data/config.json"},
                    {name: "strings", uri: "assets/data/strings.json"},
                    // particles
                    {name: "emitter-flame", uri: "assets/data/emitters/emitter-flame.json"},
                    {name: "emitter-smoke", uri: "assets/data/emitters/emitter-smoke.json"},
                    // texture
                    {name: "main@1x", uri: "assets/textures/main@1x.json"},
                    {name: "bg-autumn", uri: "assets/textures/bg-autumn.png"},
                ]);

                // push preloader onto scene stack
                this._preloader = new PreloaderScene();
                this._sceneStack.push(this._preloader);

            }, 50);
        });
    }

    update(ticker) {
        const deltaTime = ticker.deltaTime;
        TWEEN.update(); // update tween engine
        ENG.gameTime.update(deltaTime); // update delta calc
        this._sceneStack && this._sceneStack.update(ENG.gameTime.dt); // update scenes
        ENG.view.update(); // render
    }

    resize() {
        this._sceneStack.resize();
    }

    /**
     * @param progress
     * @private
     */
    _onLoadingProgress(progress) {
        this._logger.log(progress);
        this._preloader && this._preloader.onProgress(progress);
    }

    /**
     * @private
     */
    _onLoadingCompleted() {
        common.config = ENG.asset.data("config");
        common.strings = ENG.asset.data("strings");

        setTimeout(() => {
            this._preloader && this._sceneStack.remove(this._preloader);
            this._sceneManager = new SceneManager(this._sceneStack);
            this._sceneManager.start();
        }, 1000);
    }

    /**
     * @private
     */
    _onResize() {
        this.resize();
    }
}
