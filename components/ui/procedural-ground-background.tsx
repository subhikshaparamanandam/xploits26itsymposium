import React, { useEffect, useRef } from 'react';

/**
 * ProceduralGroundBackground
 * A WebGL 2D background featuring topographic neon lines and sand-ripple movement.
 * Optimized for performance using fragment shaders.
 * Colors adjusted to match XPLOITS fire/ice theme.
 */

interface ProceduralGroundBackgroundProps {
    className?: string;
}

const ProceduralGroundBackground: React.FC<ProceduralGroundBackgroundProps> = ({ className = "" }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.warn('WebGL not supported, falling back to static background');
            return;
        }

        const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

        // Custom shader with XPLOITS fire/ice theme colors
        const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        // Ground Perspective Simulation
        float depth = 1.0 / (uv.y + 1.15);
        vec2 gridUv = vec2(uv.x * depth, depth + u_time * 0.1);
        
        // Layered Procedural Noise for Terrain
        float n = noise(gridUv * 3.5);
        float ripples = sin(gridUv.y * 18.0 + n * 8.0 + u_time * 0.3);
        
        // Neon Topographic Lines
        float topoLine = smoothstep(0.03, 0.0, abs(ripples));
        
        // XPLOITS Fire & Ice Color Palette
        vec3 baseColor = vec3(0.02, 0.02, 0.05); // Deep dark
        vec3 fireColor = vec3(1.0, 0.54, 0.0);   // Fire orange #FF8A00
        vec3 iceColor = vec3(0.0, 0.78, 1.0);    // Ice cyan #00C6FF
        
        // Mix fire (left) and ice (right) based on x position
        float fireMix = smoothstep(0.3, -0.5, uv.x);
        float iceMix = smoothstep(-0.3, 0.5, uv.x);
        vec3 accentColor = mix(iceColor, fireColor, fireMix);
        
        // Composite
        vec3 finalColor = mix(baseColor, accentColor * 0.15, n * 0.6);
        finalColor += topoLine * accentColor * depth * 0.3;
        
        // Horizon Fog / Fade
        float fade = smoothstep(0.1, -1.0, uv.y);
        finalColor *= (1.0 - length(uv) * 0.4) * (1.0 - fade);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

        const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
            const shader = gl.createShader(type)!;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            }
            return shader;
        };

        const program = gl.createProgram()!;
        gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
        gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]), gl.STATIC_DRAW);

        const posAttrib = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(posAttrib);
        gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

        const timeLoc = gl.getUniformLocation(program, "u_time");
        const resLoc = gl.getUniformLocation(program, "u_resolution");

        let animationFrameId: number;
        const render = (time: number) => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            const width = rect?.width || window.innerWidth;
            const height = rect?.height || window.innerHeight;

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                gl.viewport(0, 0, width, height);
            }

            gl.uniform1f(timeLoc, time * 0.001);
            gl.uniform2f(resLoc, width, height);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className={`w-full h-full bg-[#050510] ${className}`}>
            <canvas
                ref={canvasRef}
                className="w-full h-full block"
                style={{ filter: 'contrast(1.1) brightness(0.95)' }}
            />
        </div>
    );
};

export default ProceduralGroundBackground;
