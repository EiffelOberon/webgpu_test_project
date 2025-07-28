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


    async createRenderPipeline(format, depth = false) {
        if (!this.shaderModule) {
            await this.createShaderModule();
        }

        const pipelineConfig = {
            layout: 'auto',
            vertex: {
                module: this.shaderModule,
                entryPoint: 'vs_main',
                buffers: [{
                    arrayStride: 24, // 6 floats * 4 bytes = 24 bytes
                    attributes: [
                        {
                            shaderLocation: 0,
                            offset: 0,
                            format: 'float32x3', // position (x, y, z)
                        },
                        {
                            shaderLocation: 1,
                            offset: 12,
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
        };

        // Add depth testing for 3D
        if (depth) {
            pipelineConfig.depthStencil = {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth24plus',
            };
        }

        this.pipeline = this.device.createRenderPipeline(pipelineConfig);
        return this.pipeline;
    }
}