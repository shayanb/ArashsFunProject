import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

function ChainPath({ samples, currentStep }) {
  const visibleSamples = samples.slice(0, currentStep + 1);

  const points = useMemo(() => {
    return visibleSamples.map(s => new THREE.Vector3(s[0], s[1], s[2]));
  }, [visibleSamples]);

  if (points.length < 2) return null;

  return (
    <Line
      points={points}
      color="#3b82f6"
      lineWidth={2}
      opacity={0.6}
      transparent
    />
  );
}

function SamplePoints({ samples, currentStep }) {
  const visibleSamples = samples.slice(0, currentStep + 1);

  // Color interpolation function from blue (old) to yellow/red (new)
  const getColorForIteration = (index, total) => {
    const t = index / total; // 0 to 1

    // Blue (old) -> Cyan -> Green -> Yellow -> Orange -> Red (new)
    if (t < 0.2) {
      // Blue to Cyan
      const localT = t / 0.2;
      return new THREE.Color().setRGB(0, localT * 0.5, 1);
    } else if (t < 0.4) {
      // Cyan to Green
      const localT = (t - 0.2) / 0.2;
      return new THREE.Color().setRGB(0, 0.5 + localT * 0.5, 1 - localT);
    } else if (t < 0.6) {
      // Green to Yellow
      const localT = (t - 0.4) / 0.2;
      return new THREE.Color().setRGB(localT, 1, 0);
    } else if (t < 0.8) {
      // Yellow to Orange
      const localT = (t - 0.6) / 0.2;
      return new THREE.Color().setRGB(1, 1 - localT * 0.35, 0);
    } else {
      // Orange to Red
      const localT = (t - 0.8) / 0.2;
      return new THREE.Color().setRGB(1, 0.65 - localT * 0.65, 0);
    }
  };

  return (
    <group>
      {visibleSamples.map((sample, i) => {
        const isFirst = i === 0;
        const isLast = i === currentStep;
        const isMilestone = i % 50 === 0;

        let color;
        let size = 0.05;

        if (isFirst) {
          color = '#16a34a'; // Green for start
          size = 0.15;
        } else if (isLast) {
          color = '#dc2626'; // Red for current
          size = 0.12;
        } else {
          // Use gradient coloring based on age
          color = getColorForIteration(i, currentStep);
          if (isMilestone) {
            size = 0.08;
          }
        }

        return (
          <mesh key={i} position={[sample[0], sample[1], sample[2]]}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
}

function AxisLabels() {
  return (
    <group>
      <Text position={[6, 0, 0]} fontSize={0.4} color="red">
        X
      </Text>
      <Text position={[0, 6, 0]} fontSize={0.4} color="green">
        Y
      </Text>
      <Text position={[0, 0, 6]} fontSize={0.4} color="blue">
        Z
      </Text>
    </group>
  );
}

function Axes({ range = 5 }) {
  const axisPoints = [
    [[-range, 0, 0], [range, 0, 0]], // X axis
    [[0, -range, 0], [0, range, 0]], // Y axis
    [[0, 0, -range], [0, 0, range]]  // Z axis
  ];

  const colors = ['#ff0000', '#00ff00', '#0000ff'];

  return (
    <group>
      {axisPoints.map((points, i) => (
        <Line
          key={i}
          points={points}
          color={colors[i]}
          lineWidth={1}
          opacity={0.3}
          transparent
        />
      ))}
    </group>
  );
}

function Grid({ range = 5, divisions = 10 }) {
  const gridLines = useMemo(() => {
    const lines = [];
    const step = (range * 2) / divisions;

    // XY plane
    for (let i = 0; i <= divisions; i++) {
      const pos = -range + i * step;
      lines.push([
        [pos, -range, 0],
        [pos, range, 0]
      ]);
      lines.push([
        [-range, pos, 0],
        [range, pos, 0]
      ]);
    }

    return lines;
  }, [range, divisions]);

  return (
    <group>
      {gridLines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#888888"
          lineWidth={0.5}
          opacity={0.1}
          transparent
        />
      ))}
    </group>
  );
}

function Scene({ samples, currentStep, autoRotate }) {
  const controlsRef = useRef();

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <Axes />
      <Grid />
      <AxisLabels />

      <ChainPath samples={samples} currentStep={currentStep} />
      <SamplePoints samples={samples} currentStep={currentStep} />

      <OrbitControls
        ref={controlsRef}
        autoRotate={autoRotate}
        autoRotateSpeed={1}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

function ScatterPlot3D({ samples, currentStep = null, autoRotate = false }) {
  const step = currentStep !== null ? currentStep : samples.length - 1;

  if (!samples || samples.length === 0) return null;

  // Calculate bounds
  const bounds = useMemo(() => {
    const xs = samples.map(s => s[0]);
    const ys = samples.map(s => s[1]);
    const zs = samples.map(s => s[2]);

    const maxRange = Math.max(
      Math.max(...xs) - Math.min(...xs),
      Math.max(...ys) - Math.min(...ys),
      Math.max(...zs) - Math.min(...zs)
    );

    return Math.max(5, maxRange / 2 + 1);
  }, [samples]);

  return (
    <div style={{ width: '100%', height: '900px', background: '#f0f0f0', borderRadius: '8px' }}>
      <Canvas camera={{ position: [bounds * 1.5, bounds * 1.5, bounds * 1.5], fov: 50 }}>
        <Scene samples={samples} currentStep={step} autoRotate={autoRotate} />
      </Canvas>
    </div>
  );
}

export default ScatterPlot3D;
