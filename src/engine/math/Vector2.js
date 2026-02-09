/*

Simple 2D JavaScript Vector Class

Hacked from evanw's lightgl.js
https://github.com/evanw/lightgl.js/blob/master/src/vector.js

*/

export default class Vector2 {
    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        if (v instanceof Vector2) {
            this.x += v.x;
            this.y += v.y;
        } else {
            this.x += v;
            this.y += v;
        }
        return this;
    }

    sub(v) {
        if (v instanceof Vector2) {
            this.x -= v.x;
            this.y -= v.y;
        } else {
            this.x -= v;
            this.y -= v;
        }
        return this;
    }

    mul(v) {
        if (v instanceof Vector2) {
            this.x *= v.x;
            this.y *= v.y;
        } else {
            this.x *= v;
            this.y *= v;
        }
        return this;
    }

    div(v) {
        if (v instanceof Vector2) {
            if (v.x !== 0) this.x /= v.x;
            if (v.y !== 0) this.y /= v.y;
        } else {
            if (v !== 0) {
                this.x /= v;
                this.y /= v;
            }
        }
        return this;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v) {
        return this.x * v.y - this.y * v.x
    }

    length() {
        return Math.sqrt(this.dot(this));
    }

    normalize() {
        return this.divide(this.length());
    }

    toAngles() {
        return -Math.atan2(-this.y, this.x);
    }

    angleTo(a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }

    angleBetween(otherVector) {
        // Calculate the angle between this vector and the other vector
        const angle = Math.atan2(otherVector.y - this.y, otherVector.x - this.x);

        // Ensure the angle is between 0 and 2π (0 to 360 degrees)
        if (angle < 0) {
            return 2 * Math.PI + angle;
        }

        return angle;
    }


    rotate(a) {
        const cos = Math.cos(a);
        const sin = Math.sin(a);

        this.x = cos * this.x - sin * this.y;
        this.y = cos * this.y + sin * this.x;

        return this;
    }

    toArray(n) {
        return [this.x, this.y].slice(0, n || 2);
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
}
