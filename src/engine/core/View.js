import MiniSignal from 'mini-signals'
import {autoDetectRenderer, Container} from "pixi.js";

/**
 * @class
 * @classdesc - Handles rendering and screen dimensions / resize
 */
export default class View {

    get landscape() {
        return this._landscape;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get rootNode() {
        return this._rootNode;
    }

    get renderer() {
        if (!this._intialised)
            this.init();
        return this._renderer;
    }

    constructor() {
        // signals
        this.signals = {};
        this.signals.resized = new MiniSignal();

        this._landscape = true;

        this._width = -1;
        this._height = -1;

        this._canvas = document.getElementById("view");

        this._canvas.style.position = "absolute";
        this._canvas.style.left = 0;
        this._canvas.style.top = 0;
        this._canvas.style.width = window.innerWidth + "px";
        this._canvas.style.height = window.innerHeight + "px";

        // root node
        this._rootNode = new Container();

        this._options = null;

        this._intialised = false;

        this._rotateOverlay = document.getElementById("rotate-screen-overlay");
    }

    async init(options = {v_width: 1280, v_height: 720, landscape: true}) {
        // init static
        View.V_WIDTH = options.v_width;
        View.V_HEIGHT = options.v_height;

        this._landscape = options.landscape;

        options.canvas = this._canvas;
        options.transparent = false;
        options.antialias = false;
        options.preserveDrawingBuffer = false;
        options.resolution = 1;
        options.width = View.V_WIDTH;
        options.height = View.V_HEIGHT;

        this.dynamicView = true;

        this._options = options;

        // Pixi Render setup
        this._renderer = await autoDetectRenderer(options);
        this._renderer.autoResize = true;

        // resize listener
        window.addEventListener('resize', () => this._onResize());

        this._intialised = true;
        this.resize();
        this._checkOrientation();
    }

    update() {
        if (!this._intialised)
            this.init();

        this._renderer.render(this._rootNode);
    }

    resize() {
        if (!this._intialised) {
            this.init();
        }

        if ((isMobile.any && !this._landscape) || this.dynamicView) {
            this.dynamicView = true;
            this.dynamicResize();
        } else {
            this.aspectRatioResize();
        }
    }

    _checkOrientation() {
        if (!isMobile.any) return;

        const isPortrait = window.innerHeight > window.innerWidth;
        const needsLandscape = this._landscape;

        const shouldShowOverlay = (needsLandscape && isPortrait) || (!needsLandscape && !isPortrait);

        if (this._rotateOverlay) {
            if (shouldShowOverlay) {
                this._rotateOverlay.classList.add('visible');
                this._rotateOverlay.style.visibility = 'visible';
                this._rotateOverlay.style.zIndex = '9999';
                this._rotateOverlay.style.pointerEvents = 'auto';
                this._canvas.style.zIndex = -1;
            } else {
                this._rotateOverlay.classList.remove('visible');
                this._rotateOverlay.style.visibility = 'hidden';
                this._rotateOverlay.style.zIndex = '-1';
                this._rotateOverlay.style.pointerEvents = 'none';
                this._canvas.style.zIndex = 0;
            }
        }
    }

    dynamicResize() {
        const width = isMobile.any ? document.documentElement.clientWidth : window.innerWidth;
        const height = isMobile.any ? document.documentElement.clientHeight : window.innerHeight;

        if (this._landscape) {
            const rw = width / this._options.width;
            const rh = this._options.height / height;

            this._updateDimensions(Math.floor((this._options.width * rw) * rh), this._options.height);
        } else {
            const rw = this._options.width / width;
            const rh = height / this._options.height;

            this._updateDimensions(this._options.width, Math.floor((this._options.height * rh) * rw));
        }

        this._renderer.resize(this._width, this._height);
        this.signals.resized.dispatch();
    }

    aspectRatioResize() {
        const gameAspectRatio = this._landscape ? View.V_WIDTH / View.V_HEIGHT : View.V_HEIGHT / View.V_WIDTH;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let scale;

        // Check if the game should fit vertically or horizontally
        if ((screenHeight / screenWidth) > gameAspectRatio) {
            // Screen is taller than the game aspect ratio, fit to width and letterbox vertically
            scale = screenWidth / View.V_WIDTH;
        } else {
            // Screen is wider than the game aspect ratio, fit to height and pillarbox horizontally
            scale = screenHeight / View.V_HEIGHT;
        }

        const width = View.V_WIDTH * scale;
        const height = View.V_HEIGHT * scale;

        // Centering the game view
        const horizontalMargin = (screenWidth - width) / 2;
        const verticalMargin = (screenHeight - height) / 2;

        // Apply the new dimensions and center the canvas
        this._canvas.style.width = `${width}px`;
        this._canvas.style.height = `${height}px`;
        this._canvas.style.left = `${horizontalMargin}px`;
        this._canvas.style.top = `${verticalMargin}px`;

        this._width = Math.round(width);
        this._height = Math.round(height);

        // Resize the renderer
        this._renderer.resize(this._width, this._height);

        // Set the scale of the root node (stage)
        this._rootNode.scale.set(scale);

        // Dispatch the resize signal
        this.signals.resized.dispatch();
    }

    _onResize() {
        this.resize();
        this._checkOrientation();
    }

    /**
     * @param {number} width
     * @param {number} height
     * @private
     */
    _updateDimensions(width, height) {
        this._width = Math.round(width);
        this._height = Math.round(height);
        this._canvas.style.width = window.innerWidth + "px";
        this._canvas.style.height = window.innerHeight + "px";
    }
}

/**
 * @type {Number}
 */
View.V_WIDTH = null;

/**
 * @type {Number}
 */
View.V_HEIGHT = null;