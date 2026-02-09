export default class Camera {

    /**
     * @returns {PIXI.Point}
     */
    get position() {
        return this._position;
    }

    /**
     * @returns {PIXI.Rectangle}
     */
    get bounds() {
        return this._bounds;
    }

    /**
     * @returns {*}
     */
    get target() {
        return this._target;
    }

    /**
     * @returns {Array.<CameraLayer>}
     */
    get layers() {
        return this._layers.slice();
    }

    /**
     * @param {PIXI.Point} [focus]
     * @param {PIXI.Point} [offset]
     */
    constructor(focus = new PIXI.Point(), offset = new PIXI.Point()) {
        /**
         * @member {PIXI.Point}
         */
        this.focus = focus;

        /**
         * @member {PIXI.Point}
         */
        this.offset = offset;

        /**
         * @member {number}
         */
        this.zoom = 1;

        /**
         * @member {PIXI.Point}
         * @private
         */
        this._position = new PIXI.Point();

        /**
         * @member {PIXI.Rectangle}
         * @private
         */
        this._bounds = new PIXI.Rectangle(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);

        /**
         * @member {Array.<CameraLayer>}
         * @private
         */
        this._layers = [];

        /**
         * @member {PIXI.Point}
         * @private
         */
        this._parallax = new PIXI.Point(1, 1);

        /**
         * @member {*}
         * @private
         */
        this._target = null;
    }

    destroy() {
        this.removeAllLayers();
    }

    update() {
        this._target && this._position.set(this._target.x * this._parallax.x, this._target.y * this._parallax.y);
        this._clampToBounds(this._position);

        for (let i = 0; i < this._layers.length; ++i) {
            const layer = this._layers[i];
            const position = new PIXI.Point(this._target.x * layer.parallax.x, this._target.y * layer.parallax.y);
            layer.view.pivot.set(this.focus.x + position.x, this.focus.y + position.y);
            layer.view.position.set(layer.view.pivot.x + this.offset.x + (this._position.x * -layer.parallax.x),
                layer.view.pivot.y + this.offset.y + (this._position.y * -layer.parallax.y));
            layer.view.scale.set(this.zoom, this.zoom);
        }
    }

    /**
     * @param {...CameraLayer} layer - The layer(s) to add to the camera.
     * @returns {CameraLayer} The first layer that was added.
     */
    addLayer(layer) {
        const len = arguments.length;
        if (len > 1) {
            for (let i = 0; i < len; ++i) {
                this._layers.push(arguments[i]);
            }
        } else {
            this._layers.push(layer);
        }
        return layer;
    }

    /**
     * @param {...CameraLayer} layer - The layer(s) to remove from the camera.
     * @returns {CameraLayer} The first layer that was added.
     */
    removeLayer(layer) {
        const len = arguments.length;
        if (len > 1) {
            for (let i = len - 1; i >= 0; --i) {
                this.removeLayer(arguments[i]);
            }
        } else {
            const i = this._layers.indexOf(layer);
            if (i !== -1) {
                this._layers.splice(i, 1);
            } else {
                throw new Error("Layer does not exit!");
            }
        }
        return layer;
    }

    removeAllLayers() {
        this._layers = [];
    }

    /**
     * @param {PIXI.DisplayObject} displayObject
     * @param {boolean} [recursive=false]
     */
    findLayer(displayObject, recursive = false) {
        let result = null;
        for (let i = 0; i < this._layers.length; ++i) {
            const layer = this._layers[i];
            if (layer.view === displayObject || searchChildren.call(this, layer.view, recursive)) {
                result = layer;
            }
        }

        function searchChildren(obj, recursive) {
            for (let i = 0; i < obj.children.length; ++i) {
                const child = obj.children[i];
                if (child === displayObject) {
                    return true;
                } else if (recursive) {
                    searchChildren.call(this, child, recursive);
                }
            }
            return false;
        }

        return result;
    }

    /**
     * @param {*} target
     */
    setTarget(target) {
        this._target = target;

        const layer = this.findLayer(this._target, true);
        this._parallax.x = layer ? layer.parallax.x : 1;
        this._parallax.y = layer ? layer.parallax.y : 1;
    }

    /**
     * @param position
     * @returns {PIXI.Point}
     * @private
     */
    _clampToBounds(position) {
        if (position.x < this._bounds.x && this._bounds.x !== Number.NEGATIVE_INFINITY) {
            position.x = this._bounds.x;
        } else if (position.x > this._bounds.width && this._bounds.width !== Number.POSITIVE_INFINITY) {
            position.x = this._bounds.width;
        }
        if (position.y < this._bounds.y && this._bounds.y !== Number.NEGATIVE_INFINITY) {
            position.y = this._bounds.y;
        } else if (position.y > this._bounds.height && this._bounds.height !== Number.POSITIVE_INFINITY) {
            position.y = this._bounds.height;
        }
    }
}