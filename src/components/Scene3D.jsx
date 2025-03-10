import React, { Suspense, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import Lighting from "./Lighting";
import Faktos from "./Faktos";
import ResponsiveCamera from "./ResponsiveCamemra";

const Scene3D = ({ windowSize, isContentVisible, enabled = true }) => {
  // Only calculate these values when props change
  const minDistance = windowSize.width < 640 ? 2.8 : windowSize.width < 768 ? 2.6 : windowSize.width < 1024 ? 2.5 : 2;
  const maxDistance = windowSize.width < 640 ? 7 : windowSize.width < 768 ? 7 : windowSize.width < 1024 ? 5 : 3;

  if (!enabled) {
    return null; // Don't render anything if disabled
  }

  return (
    <Canvas
      camera={{
        position: [0, 0, 2],
        fov: windowSize.width < 768 ? 55 : 50,
      }}
      shadows={true}
      dpr={[1, windowSize.width < 640 ? 1.5 : windowSize.width > 1440 ? 1.5 : 2]}
      gl={{
        powerPreference: "high-performance",
        antialias: true,
        alpha: false,
      }}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <ResponsiveCamera />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={minDistance}
          maxDistance={maxDistance}
          enableDamping={true}
          dampingFactor={0.02}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
          minAzimuthAngle={-Math.PI / 8}
          maxAzimuthAngle={Math.PI / 8}
        />
        <Lighting />
        <Faktos />
        <ambientLight intensity={0.2} />
        <EffectComposer
          enabled={!isContentVisible}
          multisampling={
            windowSize.width < 640
              ? 1
              : windowSize.width < 768
              ? 2
              : windowSize.width < 1024
              ? 2
              : windowSize.width < 1440
              ? 3
              : 2
          }
          disableNormalPass={true}
        >
          <Bloom
            luminanceThreshold={0}
            luminanceSmoothing={0.2}
            height={windowSize.width < 640 ? 120 : windowSize.width < 768 ? 150 : 150}
            width={windowSize.width < 640 ? 120 : windowSize.width < 768 ? 150 : 150}
            opacity={0.25}
            intensity={1.2}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};

export default memo(Scene3D);