export class ShaderManager {
    constructor(device, shaderFilename) {
        this.device = device;
        this.shaderFilename = shaderFilename;
        this.shaderModule = null;
        this.pipeline = null;
    }

    async loadShaderCode() {
        const response = await fetch(this.shaderFilename);
        const shaderCode = await response.text();
        return shaderCode;
    }

    async createShaderModule() {
        const shaderCode = await this.loadShaderCode();
        this.shaderModule = this.device.createShaderModule({
            code: shaderCode,
        });
        return this.shaderModule;
    }

    async createRenderPipeline(format) {
        if (!this.shaderModule) {
            await this.createShaderModule();
        }

        this.pipeline = this.device.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: this.shaderModule,
                entryPoint: 'vs_main',
                buffers: [{
                    arrayStride: 20, // 5 floats * 4 bytes = 20 bytes
                    attributes: [
                        {
                            shaderLocation: 0,
                            offset: 0,
                            format: 'float32x2', // position (x, y)
                        },
                        {
                            shaderLocation: 1,
                            offset: 8,
                            format: 'float32x3', // color (r, g, b)
                        },
                    ],
                }],
            },
            fragment: {
                module: this.shaderModule,
                entryPoint: 'fs_main',
                targets: [{
                    format: format,
                }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        });

        return this.pipeline;
    }
}