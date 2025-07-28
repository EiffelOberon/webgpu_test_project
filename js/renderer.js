export class Renderer {
    constructor(device, context, pipeline) {
        this.device = device;
        this.context = context;
        this.pipeline = pipeline;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.indexCount = 0;
        this.bindGroup = null;
    }

    setGeometry(vertexBuffer, indexBuffer, indexCount) {
        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
        this.indexCount = indexCount;
    }

    setBindGroup(bindGroup) {
        this.bindGroup = bindGroup;
    }

    createRenderPassDescriptor() {
        return {
            colorAttachments: [{
                view: this.context.getCurrentTexture().createView(),
                clearValue: { r: 0.1, g: 0.1, b: 0.2, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store',
            }],
        };
    }

    setupRenderPass(renderPass) {
        renderPass.setPipeline(this.pipeline);
        renderPass.setVertexBuffer(0, this.vertexBuffer);
        renderPass.setIndexBuffer(this.indexBuffer, 'uint16');
        renderPass.drawIndexed(this.indexCount);
    }

    render() {
        if (!this.vertexBuffer || !this.indexBuffer || !this.pipeline) {
            console.error('Renderer not properly initialized');
            return;
        }

        const commandEncoder = this.device.createCommandEncoder();
        const renderPassDescriptor = this.createRenderPassDescriptor();
        const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);

        this.setupRenderPass(renderPass);
        renderPass.end();

        this.device.queue.submit([commandEncoder.finish()]);
    }
}

export class Renderer2D extends Renderer {
    constructor(device, context, pipeline) {
        super(device, context, pipeline);
    }
}

export class Renderer3D extends Renderer {
    constructor(device, context, pipeline) {
        super(device, context, pipeline);
        this.depthTexture = null;
        this.uniformBuffer = null;
        this.createDepthTexture();
        this.createUniformBuffer();
        this.createBindGroup();
    }

    createDepthTexture() {
        const canvas = this.context.canvas;
        this.depthTexture = this.device.createTexture({
            size: [canvas.width, canvas.height],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
    }

    createUniformBuffer() {
        // Two 4x4 matrices: viewProjection and model (32 floats * 4 bytes = 128 bytes)
        this.uniformBuffer = this.device.createBuffer({
            size: 128,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    }

    createBindGroup() {
        if (this.uniformBuffer) {
            this.bindGroup = this.device.createBindGroup({
                layout: this.pipeline.getBindGroupLayout(0),
                entries: [{
                    binding: 0,
                    resource: {
                        buffer: this.uniformBuffer,
                    },
                }],
            });
        }
    }

    updateUniforms(viewProjectionMatrix, modelMatrix) {
        if (this.uniformBuffer) {
            const uniformData = new Float32Array(32);
            uniformData.set(viewProjectionMatrix, 0);
            uniformData.set(modelMatrix, 16);
            this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData);
        }
    }

    createRenderPassDescriptor() {
        const descriptor = super.createRenderPassDescriptor();
        
        if (this.depthTexture) {
            descriptor.depthStencilAttachment = {
                view: this.depthTexture.createView(),
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            };
        }
        
        return descriptor;
    }

    setupRenderPass(renderPass) {
        renderPass.setPipeline(this.pipeline);
        
        if (this.bindGroup) {
            renderPass.setBindGroup(0, this.bindGroup);
        }
        
        renderPass.setVertexBuffer(0, this.vertexBuffer);
        renderPass.setIndexBuffer(this.indexBuffer, 'uint16');
        renderPass.drawIndexed(this.indexCount);
    }
}