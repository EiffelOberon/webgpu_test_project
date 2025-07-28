import { WebGPUInitializer } from './webgpu-init.js';
import { ShaderManager } from './shaders.js';
import { GeometryManager } from './geometry.js';
import { Renderer2D, Renderer3D } from './renderer.js';
import { MatrixUtils } from './matrix-utils.js';

export class WebGPUApp {
    constructor() {
        this.canvas = null;
        this.status = null;
        this.initializer = null;
        this.shaderManager2D = null;
        this.shaderManager3D = null;
        this.geometryManager = null;
        this.renderer2D = null;
        this.renderer3D = null;
        this.currentMode = '3d'; // Start with 3D mode
        this.rotationY = 0;
        this.animationId = null;
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

            // Create 2D shader manager and pipeline
            this.shaderManager2D = new ShaderManager(device, 'shaders/raster2DColoredVertex.wgsl');
            const pipeline2D = await this.shaderManager2D.createRenderPipeline(format, false);

            // Create 3D shader manager and pipeline
            this.shaderManager3D = new ShaderManager(device, 'shaders/raster3DColoredVertex.wgsl');
            const pipeline3D = await this.shaderManager3D.createRenderPipeline(format, true);

            // Create geometry manager
            this.geometryManager = new GeometryManager(device);

            // Create renderers
            this.renderer2D = new Renderer2D(device, context, pipeline2D);
            this.renderer3D = new Renderer3D(device, context, pipeline3D);

            this.status.textContent = 'WebGPU initialized successfully! Rendering 3D cube...';

            // Start with 3D rendering
            this.startAnimation();

        } catch (error) {
            this.status.textContent = `Error: ${error.message}`;
            console.error(error);
            throw error;
        }
    }

    startAnimation() {
        this.animate();
    }

    animate() {
        this.rotationY += 0.01;
        
        if (this.currentMode === '3d') {
            this.render3DCube();
        } else {
            this.renderQuad();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    stopAnimation() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    renderQuad() {
        if (!this.geometryManager || !this.renderer2D) {
            console.error('App not properly initialized');
            return;
        }

        const { vertexBuffer, indexBuffer, indexCount } = this.geometryManager.createBuffers('quad');
        this.renderer2D.setGeometry(vertexBuffer, indexBuffer, indexCount);
        this.renderer2D.render();
        this.status.textContent = 'Rendering 2D quad...';
    }

    render3DCube() {
        if (!this.geometryManager || !this.renderer3D) {
            console.error('App not properly initialized');
            return;
        }

        // Create view and projection matrices
        const aspect = this.canvas.width / this.canvas.height;
        const projectionMatrix = MatrixUtils.perspective(Math.PI / 4, aspect, 0.1, 100.0);
        
        // Position camera at an angle above and to the side
        const eye = [3, 2, 3];
        const center = [0, 0, 0];
        const up = [0, 1, 0];
        const viewMatrix = MatrixUtils.lookAt(eye, center, up);
        
        const viewProjectionMatrix = MatrixUtils.multiply(projectionMatrix, viewMatrix);
        
        // Create rotating model matrix
        const modelMatrix = MatrixUtils.rotateY(this.rotationY);
        
        // Update uniforms
        this.renderer3D.updateUniforms(viewProjectionMatrix, modelMatrix);
        
        // Set up geometry and rendering
        const { vertexBuffer, indexBuffer, indexCount } = this.geometryManager.createBuffers('cube');
        this.renderer3D.setGeometry(vertexBuffer, indexBuffer, indexCount);
        this.renderer3D.render();
        
        this.status.textContent = 'Rendering 3D cube...';
    }

    switchTo2D() {
        this.stopAnimation();
        this.currentMode = '2d';
        this.renderQuad();
    }

    switchTo3D() {
        this.currentMode = '3d';
        this.startAnimation();
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const app = new WebGPUApp();
    await app.initialize();
    
    // Make app globally accessible
    window.webgpuApp = app;
});