export default class SimplexNoise {
    constructor() {

        this._grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];

        //--changed to fixed numbers with a good distribution rather than randomised values--//
        this._p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

        // To remove the need for index wrapping, double the permutation table length
        this._perm = new Array(512);

        this._init();
    }

    _init() {
        for (let i = 0; i < this._perm.length; i++) {
            this._perm[i] = this._p[i & 255];
        }
    }

    /**
     * 2D simplex noise, pass in seed as well as a step (time) value
     * @param xIn
     * @param yIn
     * @returns {number}
     */
    noise(xIn, yIn) {
        let n0, n1, n2;//noise contributions from three corners

        // Skew the input space to determine which simplex cell we're in
        const f2 = 0.5 * (Math.sqrt(3) - 1);
        let s = (xIn + yIn) * f2;
        let i = Math.floor(xIn + s);
        let j = Math.floor(yIn + s);

        const g2 = (3 - Math.sqrt(3)) / 6;
        let t = (i + j) * g2;
        let X0 = i - t; //Unskew cell origin back to (x, y) space
        let Y0 = j - t; //^
        let x0 = xIn - X0; //distances from cell origin
        let y0 = yIn - Y0; //^

        //Note - for 2d, the simplex shape is a equilateral triangle
        //determine which simplex we are in
        let i1, j1;//offsets for 2nd (middle) corner of simplex in (i,j) coords

        if (x0 > y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
            i1 = 1;
            j1 = 0;
        } else {// upper triangle, YX order: (0,0)->(0,1)->(1,1)
            i1 = 0;
            j1 = 1;
        }

        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6

        let x1 = x0 - i1 + g2; //offsets for middle corner in (x,y) unskewed coords
        let y1 = y0 - j1 + g2;
        let x2 = x0 - 1 + 2 * g2;
        let y2 = y0 - 1 + 2 * g2;

        // work out the hashed gradient indices of the three simplex corners
        let ii = i & 255;
        let jj = j & 255;
        let gi0 = this._perm[ii + this._perm[jj]] % 12;
        let gi1 = this._perm[ii + i1 + this._perm[jj + j1]] % 12;
        let gi2 = this._perm[ii + 1 + this._perm[jj + 1]] % 12;

        //calculate the contribution from the three corners
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) {
            n0 = 0;
        }
        else {
            t0 *= t0;
            n0 = t0 * t0 * SimplexNoise.dotProduct(this._grad3[gi0][0], this._grad3[gi0][1], x0, y0);// (x,y) of grad3 used for 2D gradient
        }

        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) {
            n1 = 0;
        }
        else {
            t1 *= t1;
            n1 = t1 * t1 * SimplexNoise.dotProduct(this._grad3[gi1][0], this._grad3[gi1][1], x1, y1);
        }

        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) {
            n2 = 0;
        } else {
            t2 *= t2;
            n2 = t2 * t2 * SimplexNoise.dotProduct(this._grad3[gi2][0], this._grad3[gi2][1], x2, y2);
        }

        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70.0 * (n0 + n1 + n2);
    }

    static dotProduct(x0, y0, x1, y1) {
        return x0 * x1 + y0 * y1;
    }
}