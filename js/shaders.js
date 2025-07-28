export const shaderCode = `
    struct VertexInput {
        @location(0) position: vec2<f32>,
        @location(1) color: vec3<f32>,
    }
    
    struct VertexOutput {
        @builtin(position) position: vec4<f32>,
        @location(0) color: vec3<f32>,
    }
    
    @vertex
    fn vs_main(input: VertexInput) -> VertexOutput {
        var output: VertexOutput;
        output.position = vec4<f32>(input.position, 0.0, 1.0);
        output.color = input.color;
        return output;
    }
    
    @fragment
    fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
        return vec4<f32>(input.color, 1.0);
    }
`;

export class ShaderManager {
    constructor(device) {
        this.device = device;
        this.shaderModule = null;
        this.pipeline = null;
    }

    createShaderModule() {
        this.shaderModule = this.device.createShaderModule({
            code: shaderCode,
        });
        return this.shaderModule;
    }

    createRenderPipeline(format) {
        if (!this.shaderModule) {
            this.createShaderModule();
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