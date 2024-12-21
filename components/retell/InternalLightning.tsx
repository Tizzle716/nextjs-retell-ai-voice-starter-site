import React, { useEffect, useRef } from 'react';
import styles from './InternalLightning.module.css';

interface InternalLightningProps {
  isActive: boolean;
}

class LightningCanvas {
  private c: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cw: number;
  private ch: number;
  private lightning: any[];
  private lightTimeCurrent: number;
  private lightTimeTotal: number;
  private now: number;
  private delta: number;
  private then: number;
  private animationFrame: number;
  private audioContext: AudioContext | null;
  private analyser: AnalyserNode | null;
  private audioData: Uint8Array;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.cw = width;
    this.ch = height;
    this.lightning = [];
    this.lightTimeCurrent = 0;
    this.lightTimeTotal = 1000;
    this.now = Date.now();
    this.delta = 0;
    this.then = this.now;
    this.animationFrame = 0;
    this.audioContext = null;
    this.analyser = null;
    this.audioData = new Uint8Array(0);
  }

  private rand(min: number, max: number): number {
    return ~~((Math.random() * (max - min + 1)) + min);
  }

  private createLightning(x: number, y: number, canSpawn: boolean): void {
    this.lightning.push({
      x,
      y,
      xRange: this.rand(10, 30), // Increased range
      yRange: this.rand(10, 25),
      path: [{
        x,
        y
      }],
      pathLimit: this.rand(15, 25), // Increased path length
      canSpawn,
      hasFired: false,
      grower: 0,
      growerLimit: 15
    });
  }

  public async initAudio() {
    try {
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.audioData = new Uint8Array(this.analyser.frequencyBinCount);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  private getAudioIntensity(): number {
    if (!this.analyser) return 0.5;

    this.analyser.getByteFrequencyData(this.audioData);
    const sum = this.audioData.reduce((acc, val) => acc + val, 0);
    const avg = sum / this.audioData.length;
    return Math.min(Math.max(avg / 128, 0.2), 2.0); // Range from 0.2 to 2.0
  }

  private updateLightning(): void {
    const intensity = this.getAudioIntensity();
    let i = this.lightning.length;
    while (i--) {
      const light = this.lightning[i];
      light.grower += this.delta * 0.1 * intensity; // Audio-responsive growth rate

      if (light.grower >= light.growerLimit) {
        light.grower = 0;
        light.growerLimit *= 1.02;

        const movement = intensity * 1.5; // Audio affects movement range
        light.path.push({
          x: light.path[light.path.length - 1].x + (this.rand(0, light.xRange) - (light.xRange / 2)) * movement,
          y: light.path[light.path.length - 1].y + (this.rand(0, light.yRange)) * movement
        });

        if (light.path.length > light.pathLimit) {
          this.lightning.splice(i, 1);
        }
        light.hasFired = true;
      }
    }
  }

  private renderLightning(): void {
    const intensity = this.getAudioIntensity();
    let i = this.lightning.length;
    while (i--) {
      const light = this.lightning[i];

      // Brighter tan-white with higher base opacity
      const opacity = Math.min((this.rand(60, 100) / 100 * intensity) + 0.2, 1);
      this.ctx.strokeStyle = `hsla(55, 100%, 75%, ${opacity})`;
      this.ctx.lineWidth = Math.max(2, intensity * 3); // Thicker lines

      this.ctx.beginPath();
      const pathCount = light.path.length;
      this.ctx.moveTo(light.x, light.y);
      
      for (let pc = 0; pc < pathCount; pc++) {
        this.ctx.lineTo(light.path[pc].x, light.path[pc].y);

        if (light.canSpawn && this.rand(0, 150) === 0) {
          light.canSpawn = false;
          this.createLightning(light.path[pc].x, light.path[pc].y, false);
        }
      }

      // Add glow effect
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = 'rgba(210, 180, 140, 0.9)';
      this.ctx.stroke();
      
      // Reset shadow for next frame
      this.ctx.shadowBlur = 0;
    }
  }

  private clearCanvas(): void {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillStyle = `rgba(0,0,0,${this.rand(1, 8) / 100})`; // Slower fade for more persistent bolts
    this.ctx.fillRect(0, 0, this.cw, this.ch);
    this.ctx.globalCompositeOperation = 'source-over';
  }

  private lightningTimer(): void {
    this.lightTimeCurrent += this.delta;
    if (this.lightTimeCurrent >= this.lightTimeTotal) {
      const newX = this.rand(this.cw * 0.2, this.cw * 0.8); // More centered spawning
      const newY = this.rand(this.ch * 0.2, this.ch * 0.6); // More centered spawning
      const createCount = this.rand(1, 3); // Increased max bolts
      
      for (let i = 0; i < createCount; i++) {
        this.createLightning(newX, newY, true);
      }
      
      this.lightTimeCurrent = 0;
      this.lightTimeTotal = this.rand(600, 1500); // Slightly more frequent spawning
    }
  }

  public resize(width: number, height: number): void {
    this.cw = this.c.width = width;
    this.ch = this.c.height = height;
  }

  public async start(): Promise<void> {
    await this.initAudio();
    this.loop();
  }

  public stop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.analyser = null;
    }
  }

  public loop = (): void => {
    this.animationFrame = requestAnimationFrame(this.loop);

    this.now = Date.now();
    this.delta = this.now - this.then;
    this.then = this.now;

    this.clearCanvas();
    this.updateLightning();
    this.lightningTimer();
    this.renderLightning();
  };
}

const InternalLightning: React.FC<InternalLightningProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightningRef = useRef<LightningCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    if (!container) return;

    const updateSize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      if (lightningRef.current) {
        lightningRef.current.resize(width, height);
      }
    };

    updateSize();
    lightningRef.current = new LightningCanvas(canvas, canvas.width, canvas.height);

    if (isActive) {
      lightningRef.current.start();
    }

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (lightningRef.current) {
        lightningRef.current.stop();
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (lightningRef.current) {
      if (isActive) {
        lightningRef.current.start();
      } else {
        lightningRef.current.stop();
      }
    }
  }, [isActive]);

  return (
    <>
      <svg width="0" height="0">
        <defs>
          <filter id="glow-4">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
            </feMerge>
          </filter>
          <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgb(210, 180, 140)', stopOpacity: 0.8 }} />
            <stop offset="50%" style={{ stopColor: 'rgb(255, 255, 255)', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: 'rgb(210, 180, 140)', stopOpacity: 0.8 }} />
          </linearGradient>
        </defs>
      </svg>
      <canvas ref={canvasRef} className={styles.canvas} />
    </>
  );
};

export default InternalLightning;
