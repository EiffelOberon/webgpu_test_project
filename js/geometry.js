export class GeometryManager {
    constructor(device) {
        this.device = device;
        this.vertexBuffer = null;
        this.indexBuffer = null;
    }

    createQuadGeometry() {
        // Vertex data for a quad (position + color)
        // Normalized device coordinates (-1 to 1)
        const vertices = new Float32Array([
            // Bottom left
            -1.0, -1.0, 0.0,  1, 0, 0, // Red
            // Bottom right  
             1.0, -1.0, 0.0,  0, 1, 0, // Green
            // Top right
             1.0, 1.0, 0.0,  0, 0, 1, // Blue
            // Top left
            -1.0, 1.0, 0.0,  1, 1, 0, // Yellow
        ]);

        const indices = new Uint16Array([
            0, 1, 2,  // First triangle
            0, 2, 3   // Second triangle
        ]);

        return { vertices, indices };
    }

    createCubeGeometry() {
        // Vertex data for a cube (position + color)
        // Each face has 4 vertices with different colors
        const vertices = new Float32Array([
            // Front face (Red)
            -0.5, -0.5,  0.5,  1, 0, 0, // 0
             0.5, -0.5,  0.5,  1, 0, 0, // 1
             0.5,  0.5,  0.5,  1, 0, 0, // 2
            -0.5,  0.5,  0.5,  1, 0, 0, // 3

            // Back face (Green)
            -0.5, -0.5, -0.5,  0, 1, 0, // 4
             0.5, -0.5, -0.5,  0, 1, 0, // 5
             0.5,  0.5, -0.5,  0, 1, 0, // 6
            -0.5,  0.5, -0.5,  0, 1, 0, // 7

            // Left face (Blue)
            -0.5, -0.5, -0.5,  0, 0, 1, // 8
            -0.5, -0.5,  0.5,  0, 0, 1, // 9
            -0.5,  0.5,  0.5,  0, 0, 1, // 10
            -0.5,  0.5, -0.5,  0, 0, 1, // 11

            // Right face (Yellow)
             0.5, -0.5, -0.5,  1, 1, 0, // 12
             0.5, -0.5,  0.5,  1, 1, 0, // 13
             0.5,  0.5,  0.5,  1, 1, 0, // 14
             0.5,  0.5, -0.5,  1, 1, 0, // 15

            // Top face (Magenta)
            -0.5,  0.5, -0.5,  1, 0, 1, // 16
             0.5,  0.5, -0.5,  1, 0, 1, // 17
             0.5,  0.5,  0.5,  1, 0, 1, // 18
            -0.5,  0.5,  0.5,  1, 0, 1, // 19

            // Bottom face (Cyan)
            -0.5, -0.5, -0.5,  0, 1, 1, // 20
             0.5, -0.5, -0.5,  0, 1, 1, // 21
             0.5, -0.5,  0.5,  0, 1, 1, // 22
            -0.5, -0.5,  0.5,  0, 1, 1, // 23
        ]);

        const indices = new Uint16Array([
            // Front face
            0, 1, 2,   0, 2, 3,
            // Back face
            4, 6, 5,   4, 7, 6,
            // Left face
            8, 9, 10,  8, 10, 11,
            // Right face
            12, 14, 13, 12, 15, 14,
            // Top face
            16, 17, 18, 16, 18, 19,
            // Bottom face
            20, 22, 21, 20, 23, 22
        ]);

        return { vertices, indices };
    }

    createBuffers(geometryType = 'quad') {
        const { vertices, indices } = geometryType === 'cube' 
            ? this.createCubeGeometry() 
            : this.createQuadGeometry();

        // Create vertex buffer
        this.vertexBuffer = this.device.createBuffer({
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
        this.device.queue.writeBuffer(this.vertexBuffer, 0, vertices);

        // Create index buffer
        this.indexBuffer = this.device.createBuffer({
            size: indices.byteLength,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        });
        this.device.queue.writeBuffer(this.indexBuffer, 0, indices);

        return {
            vertexBuffer: this.vertexBuffer,
            indexBuffer: this.indexBuffer,
            indexCount: indices.length
        };
    }
}