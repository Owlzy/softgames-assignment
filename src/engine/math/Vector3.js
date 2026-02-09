/**
 * Represents a 3D vector.
 */
export default class Vector3 {
    /**
     * The length of the vector.
     * @type {number}
     */
    get length() {
        return this.magnitude();
    }

    /**
     * The squared length of the vector.
     * @type {number}
     */
    get lengthSq() {
        return this.x ** 2 + this.y ** 2 + this.z ** 2;
    }

    /**
     * Creates a new Vector3 instance.
     * @param {number} x - The x-component of the vector.
     * @param {number} y - The y-component of the vector.
     * @param {number} z - The z-component of the vector.
     */
    constructor(x, y, z) {
        this.set(x, y, z);
    }

    /**
     * Sets the components of the vector.
     * @param {number} [x=0] - The x-component of the vector.
     * @param {number} [y=x] - The y-component of the vector.
     * @param {number} [z=y] - The z-component of the vector.
     */
    set(x = 0, y = x, z = y) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Calculates the magnitude (length) of the vector.
     * @returns {number} The magnitude of the vector.
     */
    magnitude() {
        return Math.sqrt(this.lengthSq);
    }

    /**
     * Calculates the dot product between this vector and another vector.
     * @param {Vector3} vector - The vector to calculate the dot product with.
     * @returns {number} The dot product of the two vectors.
     */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    /**
     * Calculates the cross product between this vector and another vector.
     * @param {Vector3} vector - The vector to calculate the cross product with.
     * @returns {Vector3} The cross product of the two vectors.
     */
    cross(vector) {
        const crossX = this.y * vector.z - this.z * vector.y;
        const crossY = this.z * vector.x - this.x * vector.z;
        const crossZ = this.x * vector.y - this.y * vector.x;
        return new Vector3(crossX, crossY, crossZ);
    }

    /**
     * Adds another vector to this vector and returns the result as a new vector.
     * @param {Vector3} vector - The vector to add.
     * @returns {Vector3} The resulting vector after addition.
     */
    add(vector) {
        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    /**
     * Subtracts another vector from this vector and returns the result as a new vector.
     * @param {Vector3} vector - The vector to subtract.
     * @returns {Vector3} The resulting vector after subtraction.
     */
    subtract(vector) {
        return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    /**
     * Scales the vector by a scalar value and returns the result as a new vector.
     * @param {number} scalar - The scalar value to scale the vector by.
     * @returns {Vector3} The resulting scaled vector.
     */
    scale(scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    /**
     * Returns a normalized (unit) vector in the same direction as this vector.
     * If the vector has a magnitude of zero, a default vector is returned.
     * @returns {Vector3} The normalized vector.
     */
    normalize() {
        const magnitude = this.magnitude();

        if (magnitude === 0) {
            // Handle the zero magnitude case
            return new Vector3(); // or return any default vector
        }

        return new Vector3(this.x / magnitude, this.y / magnitude, this.z / magnitude);
    }

    /**
     * Checks if this vector is equal to another vector.
     * @param {Vector3} vector - The vector to compare.
     * @returns {boolean} True if the vectors are equal, false otherwise.
     */
    equals(vector) {
        return this.x === vector.x && this.y === vector.y && this.z === vector.z;
    }
}