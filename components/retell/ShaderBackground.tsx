import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './ShaderBackground.module.css';

interface ShaderBackgroundProps {
  isActive: boolean;
}

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform sampler2D u_noise;
  uniform sampler2D u_bg;
  
  const vec3 cloudcolour = vec3(0.824, 0.706, 0.549);  // Tan (210, 180, 140)
  const vec3 lightcolour = vec3(1.0, 1.0, 1.0);  // White
  
  float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

  float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    
    float noise1 = noise(vec3(uv * 3. * noise(vec3(uv * 3. + 100., u_time * 1.5 + 10.)), u_time * 0.8)) * 2.;
    
    float noise2 = noise(vec3(uv + 2.35, u_time * 0.6 - 10.));
    
    uv += texture2D(u_bg, uv * vec2(.5, 1.) - vec2(u_time * 0.03, 1.) - .5 * .05).rg * 0.08
          + noise1 * .008 * (1. - clamp(noise1 * noise1 * 2. + .2, 0., 1.));
    
    vec3 tex = texture2D(u_bg, uv * vec2(.5, 1.) - vec2(u_time * 0.02, 1.) - .5).rgb;
    vec3 tex1 = texture2D(u_bg, uv * vec2(.5, 1.) - vec2(u_time * 0.05, 1.)).rgb;
    vec3 tex2 = texture2D(u_bg, (uv * .8 + .5) * vec2(.5, 1.) - vec2(u_time * 0.04, 1.)).rgb;
    
    vec3 fragcolour = tex;
    
    float shade = tex.r;
    shade *= clamp(noise1 * noise2 * sin(u_time * 1.0), .2, 10.);
    shade += shade * shade * 3.;
    shade -= (1. - clamp(tex1 * 4., 0., 1.).r) * .2;
    shade -= (1. - clamp(tex2 * 4., 0., 1.).r) * .1;
    
    fragcolour = mix(cloudcolour, lightcolour, shade);
    gl_FragColor = vec4(fragcolour, 1.);
  }
`;

const ShaderBackground: React.FC<ShaderBackgroundProps> = ({ isActive }) => {
  const containerRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const uniformsRef = useRef<any>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    let camera: THREE.Camera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let uniforms: any;

    const init = async () => {
      // Initialize Three.js
      camera = new THREE.Camera();
      camera.position.z = 1;
      scene = new THREE.Scene();

      // Load textures
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin("anonymous");

      const [noiseTexture, bgTexture] = await Promise.all([
        loader.loadAsync('https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/noise.png'),
        loader.loadAsync('https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/clouds-1-tile.jpg')
      ]);

      noiseTexture.wrapS = THREE.RepeatWrapping;
      noiseTexture.wrapT = THREE.RepeatWrapping;
      noiseTexture.minFilter = THREE.LinearFilter;

      bgTexture.wrapS = THREE.RepeatWrapping;
      bgTexture.wrapT = THREE.RepeatWrapping;
      bgTexture.minFilter = THREE.LinearFilter;

      // Setup uniforms
      uniforms = {
        u_time: { type: "f", value: 0.0 },  
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_noise: { type: "t", value: noiseTexture },
        u_bg: { type: "t", value: bgTexture },
        u_mouse: { type: "v2", value: new THREE.Vector2() }
      };
      uniformsRef.current = uniforms;

      // Create mesh
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      }) as THREE.ShaderMaterial & { extensions: { derivatives: boolean } };
      material.extensions.derivatives = true;

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Setup renderer
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      rendererRef.current = renderer;

      // Add to DOM
      if (!containerRef.current) return;
      containerRef.current.appendChild(renderer.domElement);
      onWindowResize();

      // Initialize audio
      if (isActive) {
        // Removed audio initialization
      }
    };

    const onWindowResize = () => {
      if (!containerRef.current || !rendererRef.current || !uniformsRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      rendererRef.current.setSize(width, height);
      uniformsRef.current.u_resolution.value.x = width;
      uniformsRef.current.u_resolution.value.y = height;
    };

    const animate = () => {
      if (!rendererRef.current || !uniformsRef.current) return;

      animationFrameRef.current = requestAnimationFrame(animate);
      
      uniformsRef.current.u_time.value += 0.015;
      rendererRef.current.render(scene, camera);
    };

    init().then(() => {
      window.addEventListener('resize', onWindowResize);
      animate();
    });

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [isActive]);

  return (
    <div className={styles.container}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '30px',
          overflow: 'hidden'
        }}
      >
        <canvas
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          ref={containerRef}
        />
      </div>
    </div>
  );
};

export default ShaderBackground;
