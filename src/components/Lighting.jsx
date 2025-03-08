import React, { useState, useEffect } from "react";

const Lighting = () => {
  const [shutterState, setShutterState] = useState(0); // 0: off, 1: on
  const [shutterComplete, setShutterComplete] = useState(false);

  useEffect(() => {
    // Sequence of flickers (true = on, false = off)
    const flickerSequence = [
      false, // Start off
      true,  // Quick on
      false, // Quick off
      true,  // Quick on
      false, // Quick off
      true,  // Stay on
    ];
    
    // Timing for each state in milliseconds
    const timings = [500, 200, 300, 200, 400, 100];
    
    // Create the shutter effect
    let currentIndex = 0;
    
    const runNextFlicker = () => {
      if (currentIndex < flickerSequence.length) {
        setShutterState(flickerSequence[currentIndex] ? 1 : 0);
        
        setTimeout(() => {
          currentIndex++;
          runNextFlicker();
        }, timings[currentIndex]);
      } else {
        // Flickering complete, all lights on permanently
        setShutterState(1);
        setShutterComplete(true);
      }
    };
    
    // Start the effect after a small delay
    setTimeout(runNextFlicker, 1000);
    
    return () => {
      // Cleanup
    };
  }, []);
  
  // Intensity multiplier based on shutter state for point lights (flicker)
  const pointLightIntensity = shutterState;
  
  // Spot light and directional light only turn on at the end
  const spotAndDirLightIntensity = shutterComplete ? 1 : 0;

  return (
    <>
      <spotLight
        position={[0, 4, 5]}
        angle={Math.PI / 6}
        penumbra={0.2}
        intensity={10 * spotAndDirLightIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        color={"#FFFCF2"}
        distance={0}
      />
      {/* Point lights that flicker */}
      <pointLight position={[-1.8, 1, -0.5]} color={"#3B00FF"} intensity={7 * pointLightIntensity} />
      <pointLight position={[1.8, 1, -0.5]} color={"#3B00FF"} intensity={7 * pointLightIntensity} />
      <pointLight position={[0, 1, -0.5]} color={"#FAFFB6"} intensity={3 * pointLightIntensity} />
      <pointLight position={[-1.8, 1, 1.5]} color={"#3B00FF"} intensity={7 * pointLightIntensity} />
      <pointLight position={[1.8, 1, 1.5]} color={"#3B00FF"} intensity={7 * pointLightIntensity} />
      <pointLight position={[0, 1, 1.5]} color={"#FAFFB6"} intensity={3 * pointLightIntensity} />
      
      {/* Directional light only turns on at the end */}
      <directionalLight
        position={[0, 5, 5]}
        intensity={0.1 * spotAndDirLightIntensity}
        color={"#FFDC82"}
      />

    </>
  );
};

export default Lighting;