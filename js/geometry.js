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
            -0.5, -0.5,  1, 0, 0, // Red
            // Bottom right  
             0.5, -0.5,  0, 1, 0, // Green
            // Top right
             0.5,  0.5,  0, 0, 1, // Blue
            // Top left
            -0.5,  0.5,  1, 1, 0, // Yellow
        ]);

        const indices = new Uint16Array([
            0, 1, 2,  // First triangle
            0, 2, 3   // Second triangle
        ]);

        return { vertices, indices };
    }

    createBuffers() {
        const { vertices, indices } = this.createQuadGeometry();

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