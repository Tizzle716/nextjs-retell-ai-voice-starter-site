"use client";
import React, { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import { useRetell } from "@/hooks/use-retell";

interface RetellOrbProps {
  isCallActive: boolean;
  error: Error | null;
  volumeLevel: number;
}

const RetellOrb: React.FC<RetellOrbProps> = ({
  isCallActive,
  error,
  volumeLevel,
}) => {
  const { toggleCall } = useRetell();
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const originalPositionsRef = useRef<Float32Array | null>(null);
  const noise = createNoise3D();

  const onWindowResize = useCallback(() => {
    if (!cameraRef.current || !rendererRef.current) return;

    const outElement = document.getElementById("retell-orb");
    if (outElement) {
      cameraRef.current.aspect =
        outElement.clientWidth / outElement.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        outElement.clientWidth,
        outElement.clientHeight
      );
    }
  }, []);

  useEffect(() => {
    const initViz = () => {
      console.log("Initializing Three.js visualization...");
      const scene = new THREE.Scene();
      const group = new THREE.Group();

      const outElement = document.getElementById("retell-orb");
      if (!outElement) {
        console.error("Failed to find retell-orb element");
        return;
      }

      const width = outElement.clientWidth;
      const height = outElement.clientHeight;

      console.log("Setting up visualization with dimensions:", { width, height });

      const camera = new THREE.PerspectiveCamera(
        20,
        width / height,
        0.5,
        100
      );
      camera.position.set(0, 0, 100);
      camera.lookAt(scene.position);

      scene.add(camera);
      sceneRef.current = scene;
      groupRef.current = group;
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      rendererRef.current = renderer;

      const icosahedronGeometry = new THREE.IcosahedronGeometry(15, 8);
      const lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0x6366f1, // Indigo color to match Retell's theme
        wireframe: true,
      });

      const ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
      ball.position.set(0, 0, 0);
      ballRef.current = ball;

      originalPositionsRef.current = new Float32Array(ball.geometry.attributes.position.array);

      group.add(ball);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const spotLight = new THREE.SpotLight(0xffffff);
      spotLight.intensity = 0.9;
      spotLight.position.set(-10, 40, 20);
      spotLight.lookAt(ball.position);
      spotLight.castShadow = true;
      scene.add(spotLight);

      scene.add(group);

      outElement.innerHTML = "";
      outElement.appendChild(renderer.domElement);

      const render = () => {
        if (
          !groupRef.current ||
          !ballRef.current ||
          !cameraRef.current ||
          !rendererRef.current ||
          !sceneRef.current
        ) {
          return;
        }

        groupRef.current.rotation.y += 0.005;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        requestAnimationFrame(render);
      };

      render();
    };

    initViz();

    window.addEventListener("resize", onWindowResize);

    return () => {
      console.log("Cleaning up visualization");
      window.removeEventListener("resize", onWindowResize);
    };
  }, [onWindowResize, noise]);

  useEffect(() => {
    if (error) {
      console.error("Retell error in visualization:", {
        error,
        currentState: {
          isCallActive,
          volumeLevel,
          hasScene: !!sceneRef.current,
          hasBall: !!ballRef.current,
        },
      });
    }
  }, [error, isCallActive, volumeLevel]);

  useEffect(() => {
    const updateBallMorph = () => {
      if (!ballRef.current || !originalPositionsRef.current) return;
      console.log("Morphing the ball with volume:", volumeLevel);
      const geometry = ballRef.current.geometry as THREE.BufferGeometry;
      const positionAttribute = geometry.getAttribute("position");

      for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3(
          positionAttribute.getX(i),
          positionAttribute.getY(i),
          positionAttribute.getZ(i)
        );

        const offset = 10;
        const amp = 2.5;
        const time = window.performance.now();
        vertex.normalize();
        const rf = 0.00001;
        const distance =
          offset +
          volumeLevel * 4 +
          noise(
            vertex.x + time * rf * 7,
            vertex.y + time * rf * 8,
            vertex.z + time * rf * 9
          ) *
            amp *
            volumeLevel;
        vertex.multiplyScalar(distance);

        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
    };

    const resetBallMorph = () => {
      if (!ballRef.current || !originalPositionsRef.current) return;
      console.log("Resetting the ball to its original shape");
      const geometry = ballRef.current.geometry as THREE.BufferGeometry;
      const positionAttribute = geometry.getAttribute("position");

      for (let i = 0; i < positionAttribute.count; i++) {
        positionAttribute.setXYZ(
          i,
          originalPositionsRef.current[i * 3],
          originalPositionsRef.current[i * 3 + 1],
          originalPositionsRef.current[i * 3 + 2]
        );
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
    };

    if (isCallActive && ballRef.current) {
      console.log("Updating ball morphing:", {
        volumeLevel,
        timestamp: new Date().toISOString(),
        ballPosition: ballRef.current.position,
        hasOriginalPositions: !!originalPositionsRef.current,
      });
      updateBallMorph();
    } else if (
      !isCallActive &&
      ballRef.current &&
      originalPositionsRef.current
    ) {
      console.log("Resetting ball morphing:", {
        timestamp: new Date().toISOString(),
        ballPosition: ballRef.current.position,
      });
      resetBallMorph();
    }
  }, [isCallActive, volumeLevel, ballRef, originalPositionsRef, noise]);

  return (
    <div className="w-48 h-48 md:w-60 md:h-60">
      <div
        id="retell-orb"
        className="w-full h-full hover:cursor-pointer"
        onClick={toggleCall}
      ></div>
    </div>
  );
};

export default RetellOrb;
