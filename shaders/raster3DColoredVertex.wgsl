struct Uniforms {
    viewProjectionMatrix: mat4x4<f32>,
    modelMatrix: mat4x4<f32>,
}

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) color: vec3<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec3<f32>,
    @location(1) worldPos: vec3<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    
    // Transform to world space
    let worldPos = uniforms.modelMatrix * vec4<f32>(input.position, 1.0);
    
    // Transform to clip space
    output.position = uniforms.viewProjectionMatrix * worldPos;
    output.color = input.color;
    output.worldPos = worldPos.xyz;
    
    return output;
}

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    // Simple lighting calculation for better 3D visualization
    let lightDir = normalize(vec3<f32>(1.0, 1.0, 1.0));
    let normal = normalize(cross(dpdx(input.worldPos), dpdy(input.worldPos)));
    let lightIntensity = max(dot(normal, lightDir), 0.3); // Minimum ambient light
    
    return vec4<f32>(input.color * lightIntensity, 1.0);
}