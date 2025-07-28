import { WebGPUInitializer } from './webgpu-init.js';
import { ShaderManager } from './shaders.js';
import { GeometryManager } from './geometry.js';
import { Renderer } from './renderer.js';

export class WebGPUApp {
    constructor() {
        this.canvas = null;
        this.status = null;
        this.initializer = null;
        this.shaderManager = null;
        this.geometryManager = null;
        this.renderer = null;
    }

    async initialize() {
        this.canvas = document.getElementById('canvas');
        this.status = document.getElementById('status');

        if (!this.canvas || !this.status) {
            throw new Error('Canvas or status element not found');
        }

        try {
            // Initialize WebGPU
            this.initializer = new WebGPUInitializer(this.canvas);
            const { device, context, format } = await this.initializer.initialize();

            // Create shader manager and pipeline
            this.shaderManager = new ShaderManager(device);
            const pipeline = this.shaderManager.createRenderPipeline(format);

            // Create geometry
            this.geometryManager = new GeometryManager(device);
            const { vertexBuffer, indexBuffer, indexCount } = this.geometryManager.createBuffers();

            // Create renderer
            this.renderer = new Renderer(device, context, pipeline);
            this.renderer.setGeometry(vertexBuffer, indexBuffer, indexCount);

            this.status.textContent = 'WebGPU initialized successfully! Rendering quad...';

            // Render the quad
            this.renderer.render();

        } catch (error) {
            this.status.textContent = `Error: ${error.message}`;
            console.error(error);
            throw error;
        }
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const app = new WebGPUApp();
    await app.initialize();
});