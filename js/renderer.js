export class Renderer {
    constructor(device, context, pipeline) {
        this.device = device;
        this.context = context;
        this.pipeline = pipeline;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.indexCount = 0;
    }

    setGeometry(vertexBuffer, indexBuffer, indexCount) {
        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
        this.indexCount = indexCount;
    }

    render() {
        if (!this.vertexBuffer || !this.indexBuffer || !this.pipeline) {
            console.error('Renderer not properly initialized');
            return;
        }

        // Create command encoder
        const commandEncoder = this.device.createCommandEncoder();

        // Begin render pass
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: this.context.getCurrentTexture().createView(),
                clearValue: { r: 0.1, g: 0.1, b: 0.2, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store',
            }],
        });

        // Draw the quad
        renderPass.setPipeline(this.pipeline);
        renderPass.setVertexBuffer(0, this.vertexBuffer);
        renderPass.setIndexBuffer(this.indexBuffer, 'uint16');
        renderPass.drawIndexed(this.indexCount);
        renderPass.end();

        // Submit commands
        this.device.queue.submit([commandEncoder.finish()]);
    }
}