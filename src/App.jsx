import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import "./App.css";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import Lighting from "./components/lighting";
import Faktos from "./components/Faktos";
import FactCard from "./components/FactCard";
import { BiChevronDown } from "react-icons/bi";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import useFacts from "./hooks/useFacts";

function ResponsiveCamera() {
  const { viewport, camera } = useThree();
  
  useEffect(() => {
    // Adjust camera position based on viewport size
    if (window.innerWidth < 768) { // Mobile
      camera.position.set(0, 0, 7); // Move camera further away on small screens
    } else if (window.innerWidth < 1024) { // Tablet
      camera.position.set(0, 0, 3.5);
    } else { // Desktop
      camera.position.set(0, 0, 2);
    }
    camera.updateProjectionMatrix();
  }, [camera, viewport]);
  
  return null;
}

function App() {
  const contentRef = useRef(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const { facts, refreshFact, copyFactText, copyStatus } = useFacts();

  useEffect(() => {
    const handleResize = () => {
      // Force re-render on resize
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    const setWindowSize = ({ width, height }) => {
      if (width !== window.innerWidth || height !== window.innerHeight) {
        window.dispatchEvent(new Event('resize'));
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      { threshold: 0.1 } // Trigger when 10% of the element is visible
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

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      {/* 3D Scene Canvas - takes full viewport height */}
      <div className="w-full h-screen snap-start relative">
        <Canvas camera={{ position: [0, 0, 2], fov: 50 }} shadows>
          <ResponsiveCamera />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={window.innerWidth < 768 ? 2.8 : 2}
            maxDistance={window.innerWidth < 768 ? 8 : 3}
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
          <EffectComposer multisampling={0} disableNormalPass={true}>
            <Bloom
              luminanceThreshold={0}
              luminanceSmoothing={0.2}
              height={200}
              opacity={0.2}
            />
          </EffectComposer>
        </Canvas>

        {/* Scroll down indicator with React Icons */}
        <button
          onClick={handleScrollDown}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center cursor-pointer transition-all duration-300 hover:opacity-80 hover:translate-y-1 animate-pulse"
          aria-label="Scroll down to content"
        >
          <span className="mb-2 font-medium">Scroll Down</span>
          <BiChevronDown size={32} />
        </button>
      </div>

      {/* Main Content Section - also takes full viewport height */}
      <div
        ref={contentRef}
        className="h-screen w-full bg-gray-800 to-[#6435ff] text-white p-8 snap-start relative"
      >
        <div
          className={`max-w-6xl mx-auto h-full flex flex-col justify-center 
          transition-all duration-1000 ease-out transform
          ${isContentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
        >
          <h1 className="text-5xl font-bold mb-6">FAKTOS</h1>
          <p className="text-xl mb-12">get your facts today.</p>

          {/* Add your main content here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        {/* Social Media Icons */}
        <div
          className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3
          transition-all duration-1000 ease-out 
          ${isContentVisible ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-white text-sm font-medium">Follow us on:</p>
          <div className="flex gap-6">
            <a
              href="https://www.instagram.com/faktoss.id?igsh=ZzFrbDR6Mm55dTNq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-400 transition-colors duration-300"
              aria-label="Follow us on Instagram"
            >
              <FaInstagram size={32} />
            </a>
            <a
              href="https://www.tiktok.com/@faktoss.id?_t=ZS-8uVzHknj5su&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 transition-colors duration-300"
              aria-label="Follow us on TikTok"
            >
              <FaTiktok size={30} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
