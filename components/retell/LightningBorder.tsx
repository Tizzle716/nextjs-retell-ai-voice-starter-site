import React, { useEffect, useRef, useState } from 'react';
import styles from './LightningBorder.module.css';

interface Point {
  x: number;
  y: number;
}

interface LightningBorderProps {
  isActive: boolean;
}

const LightningBorder: React.FC<LightningBorderProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!isActive) return;

    const initAudio = async () => {
      const context = new AudioContext();
      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 512;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = context.createMediaStreamSource(stream);
        source.connect(analyserNode);
        setAudioContext(context);
        setAnalyser(analyserNode);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    initAudio();
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const container = containerRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let rotation = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const generateBorderPoints = (rect: DOMRect): Point[] => {
      const points: Point[] = [];
      const segmentsPerSide = 50;
      
      // Generate points for each side of the circle
      for (let i = 0; i <= 360; i += (360 / (segmentsPerSide * 4))) {
        const angle = (i * Math.PI) / 180;
        const radius = rect.width / 2;
        points.push({
          x: rect.width/2 + radius * Math.cos(angle),
          y: rect.height/2 + radius * Math.sin(angle)
        });
      }
      
      return points;
    };

    const drawLightning = (points: Point[], amplitude: number) => {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      
      // Draw glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(0, 255, 0, 0.5)';
      ctx.strokeStyle = 'rgba(255, 165, 0, 0.8)';
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      points.forEach((point, i) => {
        const noise = Math.sin(i * 0.1 + rotation) * amplitude * 20;
        const x = point.x + noise;
        const y = point.y + noise;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      ctx.stroke();
      
      // Second pass with different color
      ctx.shadowColor = 'rgba(255, 165, 0, 0.5)';
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.restore();
    };

    const animate = () => {
      if (!analyser) return;
      
      analyser.getByteTimeDomainData(dataArray);
      const sum = dataArray.reduce((acc, val) => acc + val, 0);
      const avg = sum / dataArray.length;
      const amplitudeFactor = (avg - 128) / 128;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const rect = container.getBoundingClientRect();
      const points = generateBorderPoints(rect);
      
      ctx.save();
      ctx.translate(rect.width/2, rect.height/2);
      rotation += 0.0002; // Extremely slow rotation
      ctx.rotate(rotation + amplitudeFactor * 0.1); // Reduced amplitude impact
      ctx.translate(-rect.width/2, -rect.height/2);
      
      drawLightning(points, Math.max(0.5, amplitudeFactor));
      ctx.restore();
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser]);

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default LightningBorder;
