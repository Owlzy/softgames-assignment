export function clamp(value, min, max) {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    } else {
        return value;
    }
}

export function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomSign() {
    // Generate a random number between 0 and 1
    var randomNumber = Math.random();

    // Map the random number to -1 or 1
    if (randomNumber < 0.5) {
        return -1;
    } else {
        return 1;
    }
}

export function distance(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

export function lerp(start, end, t) {
    if (typeof start !== 'number' || typeof end !== 'number' || typeof t !== 'number') {
        throw new TypeError('All arguments must be numbers');
    }

    t = Math.max(0, Math.min(1, t)); // Clamp t between 0 and 1

    return start * (1 - t) + end * t;
}

/**
 * Returns a multi-dimensional array of pre defined size with optional default values.
 * @param {number} rows - Number of rows.
 * @param {number} columns - Number of columns.
 * @param {*} [defaultValue] - Default value.
 * @returns {Array<Array>}
 */
export function matrix(rows, columns, defaultValue) {
    const a = [];
    for (let i = 0; i < rows; i++) {
        const x = [];
        for (let j = 0; j < columns; j++) x[j] = defaultValue;
        a[i] = x;
    }
    return a;
}


/**
 * Performs broad phase AABB collision detection, where a collision occurs SAT collision is then performed to ensure a collision actually occurred.
 * Can also handle polygons, although you must maintain a list of points (vertices) for the polygon yourself.
 * @param shape1 {PIXI.Sprite|PIXI.Graphics}
 * @param shape2 {PIXI.Sprite|PIXI.Graphics}
 * @returns {*}
 */
export function collide(shape1, shape2) {
    //--broad phase--//
    if (collideAABB(shape1, shape2)) {
        //--narrow phase--//
        const result = collideSAT(shape1, shape2);
        if (result) return result;
    }
    return false;
}

/**
 * Simple axis aligned bounding box collision.
 * @param r1 {PIXI.DisplayObject}
 * @param r2 {PIXI.DisplayObject}
 * @param scale {PIXI.Point}
 * @returns {boolean}
 */
export function collideAABB(r1, r2, scale = new PIXI.Point(1, 1)) {
    r1 = r1.getBounds();
    r2 = r2.getBounds();

    return !(r2.x > (r1.x + r1.width * scale.x) ||
        (r2.x + r2.width * scale.x) < r1.x ||
        r2.y > (r1.y + r1.height * scale.y) ||
        (r2.y + r2.height * scale.y) < r1.y);
}


/**
 * Collision testing with rotation, also returns overlap if a collision occurs, should be able to use overlap
 * to push the sprite out of whatever it collided with. Can take a normal sprite or graphics with a list
 * of points (the vertices of your polygon as global coordinates, you must maintain this list).
 *
 * Original source - https://gist.github.com/louisstow/807250 - added fixes and adapted to PIXI
 * @param poly1 {PIXI.Sprite}
 * @param poly2 {PIXI.Sprite}
 * @returns {Object|Boolean}
 */
export function collideSAT(poly1, poly2) {
    const points1 = poly1.points === undefined ? convertVertsToVectors(poly1.vertexData) : convertVertsToVectors(poly1.points);
    const points2 = poly2.points === undefined ? convertVertsToVectors(poly2.vertexData) : convertVertsToVectors(poly2.points);

    let l = points1.length,
        k = points2.length,
        normal = {x: 0, y: 0},
        length,
        min1, min2,
        max1, max2,
        interval,
        MTV,
        dot,
        nextPoint,
        currentPoint;

    //loop through the edges of Polygon 1
    for (let i = 0; i < l; i++) {
        nextPoint = points1[(i === l - 1 ? 0 : i + 1)];
        currentPoint = points1[i];

        //generate the normal for the current edge
        normal.x = -(nextPoint[1] - currentPoint[1]);
        normal.y = (nextPoint[0] - currentPoint[0]);

        //normalize the vector
        length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
        normal.x /= length;
        normal.y /= length;

        //default min max
        min1 = min2 = -1;
        max1 = max2 = -1;

        //project all vertices from poly1 onto axis
        for (let j = 0; j < l; ++j) {
            dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
            if (dot > max1 || max1 === -1) max1 = dot;
            if (dot < min1 || min1 === -1) min1 = dot;
        }

        //project all vertices from poly2 onto axis
        for (let j = 0; j < k; ++j) {
            dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
            if (dot > max2 || max2 === -1) max2 = dot;
            if (dot < min2 || min2 === -1) min2 = dot;
        }

        //calculate the minimum translation vector should be negative
        interval = (min1 < min2) ? min2 - max1 : min1 - max2;

        //exit early if positive
        if (interval > 0) {
            return false;
        }
        if (interval > MTV) MTV = interval;
    }

    //loop through the edges of Polygon 1
    for (let i = 0; i < k; i++) {
        nextPoint = points2[(i === k - 1 ? 0 : i + 1)];
        currentPoint = points2[i];

        //generate the normal for the current edge
        normal.x = -(nextPoint[1] - currentPoint[1]);
        normal.y = (nextPoint[0] - currentPoint[0]);

        //normalize the vector
        length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
        normal.x /= length;
        normal.y /= length;

        //default min max
        min1 = min2 = -1;
        max1 = max2 = -1;

        //project all vertices from poly1 onto axis
        for (let j = 0; j < l; ++j) {
            dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
            if (dot > max1 || max1 === -1) max1 = dot;
            if (dot < min1 || min1 === -1) min1 = dot;
        }

        //project all vertices from poly2 onto axis
        for (let j = 0; j < k; ++j) {
            dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
            if (dot > max2 || max2 === -1) max2 = dot;
            if (dot < min2 || min2 === -1) min2 = dot;
        }

        //calculate the minimum translation vector should be negative
        interval = (min1 < min2) ? min2 - max1 : min1 - max2;

        //exit early if positive
        if (interval > 0) {
            return false;
        }
        if (interval > MTV) MTV = interval;
    }

    return {overlap: MTV};

    function convertVertsToVectors(verts) {
        let arr = matrix(4, 2);

        let count = 0;
        for (let i = 0; i < verts.length; i += 2) {
            arr[count][0] = verts[i];
            arr[count][1] = verts[i + 1];
            count++;
        }

        return arr;
    }
}

import Seed from "./Seed";
import Shake from "./Shake";
import SimplexNoise from "./SimplexNoise";
import Vector2 from "./Vector2";
import Vector3 from "./Vector3";

export {Seed, Shake, SimplexNoise, Vector2, Vector3};