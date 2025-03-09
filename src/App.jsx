import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import Lighting from "./components/Lighting";
import Faktos from "./components/Faktos";
import FactCard from "./components/FactCard";
import { BiChevronDown } from "react-icons/bi";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import useFacts from "./hooks/useFacts";
import ResponsiveCamera from "./components/ResponsiveCamemra";

function App() {
  const contentRef = useRef(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { facts, refreshFact, copyFactText, copyStatus } = useFacts();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Observer to detect when content section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsContentVisible(true);
          } else {
            setIsContentVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
    };
  }, []);

  const handleScrollDown = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Calculate responsive values based on window size
  const minDistance =
    windowSize.width < 640
      ? 3.2
      : windowSize.width < 768
      ? 2.8
      : windowSize.width < 1024
      ? 2.5
      : 2;

  const maxDistance =
    windowSize.width < 640
      ? 9
      : windowSize.width < 768
      ? 8
      : windowSize.width < 1024
      ? 5
      : 3;

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      {/* 3D Scene Canvas */}
      <div className="w-full h-screen snap-start relative">
        <Canvas
          camera={{
            position: [0, 0, 2],
            fov: windowSize.width < 768 ? 60 : 50,
          }}
          shadows={windowSize.width < 1280} // Disable shadows on very large screens
          dpr={[1, windowSize.width > 1440 ? 1.5 : 2]} // Limit pixel ratio
          gl={{
            powerPreference: "high-performance",
            antialias: windowSize.width < 1280, // Disable on very large screens
            alpha: false,
          }}
          performance={{ min: 0.5 }}
        >
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
          <ambientLight intensity={0.1} />
          <EffectComposer
            enabled={isContentVisible ? false : true} // Disable effects when not in view
            multisampling={
              windowSize.width < 768
                ? 0
                : windowSize.width < 1024
                ? 2
                : windowSize.width < 1440
                ? 3
                : 2 // Reduce sampling on very large screens
            }
            disableNormalPass={true}
          >
            <Bloom
              luminanceThreshold={0}
              luminanceSmoothing={0.2}
              height={windowSize.width < 768 ? 100 : 150} // Reduced from 200
              width={windowSize.width < 768 ? 100 : 150} // Added width constraint
              opacity={0.2}
              intensity={1.0} // Explicitly set intensity
            />
          </EffectComposer>
        </Canvas>

        {/* Scroll down indicator */}
        <button
          onClick={handleScrollDown}
          className="absolute bottom-4 mb-4 sm:bottom-8 sm:mb-2 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center cursor-pointer transition-all duration-300 hover:opacity-80 hover:translate-y-1 animate-pulse"
          aria-label="Scroll down to content"
        >
          <span className="mb-2 font-medium text-sm sm:text-base">
            Scroll Down
          </span>
          <BiChevronDown size={windowSize.width < 640 ? 24 : 32} />
        </button>
      </div>

      {/* Main Content Section */}
      <div
        ref={contentRef}
        className="min-h-screen w-full bg-gray-800 text-white p-4 sm:p-6 md:p-8 snap-start relative"
      >
        <div
          className={`max-w-6xl mx-auto h-full flex flex-col justify-center py-8 sm:py-10 md:py-12
    transition-all duration-1000 ease-out transform
    ${
      isContentVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-16"
    }`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 md:mb-6 text-center sm:text-left">
            FAKTOS
          </h1>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 md:mb-12 text-center sm:text-left">
            get your facts today.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-24 sm:mb-20 md:mb-16">
            {facts.map((fact, index) => (
              <FactCard
                key={index}
                fact={fact}
                index={index}
                refreshFact={refreshFact}
                copyFactText={copyFactText}
                copyStatus={copyStatus[index]}
              />
            ))}
          </div>
        </div>

        {/* Social Media Icons - Fixed positioning for all screen sizes */}
        <div
          className={`w-full flex flex-col items-center gap-1 sm:gap-2 md:gap-3
            transition-all duration-1000 ease-out 
            ${isContentVisible ? "opacity-100" : "opacity-0"}
            absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 pb-2 sm:pb-0`}
        >
          <p className="text-white text-xs sm:text-sm font-medium">
            Follow us on:
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a
              href="https://www.instagram.com/faktoss.id?igsh=ZzFrbDR6Mm55dTNq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-400 transition-colors duration-300"
              aria-label="Follow us on Instagram"
            >
              <FaInstagram size={windowSize.width < 640 ? 24 : 32} />
            </a>
            <a
              href="https://www.tiktok.com/@faktoss.id?_t=ZS-8uVzHknj5su&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 transition-colors duration-300"
              aria-label="Follow us on TikTok"
            >
              <FaTiktok size={windowSize.width < 640 ? 22 : 30} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
