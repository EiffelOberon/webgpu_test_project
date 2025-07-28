export class MatrixUtils {
    static identity() {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    static perspective(fovy, aspect, near, far) {
        const f = 1.0 / Math.tan(fovy / 2);
        const rangeInv = 1.0 / (near - far);

        return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ]);
    }

    static lookAt(eye, center, up) {
        const f = this.normalize(this.subtract(center, eye));
        const s = this.normalize(this.cross(f, up));
        const u = this.cross(s, f);

        return new Float32Array([
            s[0], u[0], -f[0], 0,
            s[1], u[1], -f[1], 0,
            s[2], u[2], -f[2], 0,
            -this.dot(s, eye), -this.dot(u, eye), this.dot(f, eye), 1
        ]);
    }

    static multiply(a, b) {
        const result = new Float32Array(16);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result[i * 4 + j] = 0;
                for (let k = 0; k < 4; k++) {
                    result[i * 4 + j] += a[k * 4 + j] * b[i * 4 + k];
                }
            }
        }
        return result;
    }

    static rotateY(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return new Float32Array([
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1
        ]);
    }

    static rotateX(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return new Float32Array([
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        ]);
    }

    // Helper functions
    static subtract(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }

    static cross(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    }

    static dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    static normalize(v) {
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return [v[0] / length, v[1] / length, v[2] / length];
    }
}