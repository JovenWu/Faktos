import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import Lighting from "./components/lighting";
import Faktos from "./components/Faktos";
import { BiChevronDown, BiCopy } from "react-icons/bi";
import { FaInstagram, FaTiktok } from "react-icons/fa6";

function App() {
  const contentRef = useRef(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [facts, setFacts] = useState([
    { text: "Loading fact..." },
    { text: "Loading fact..." },
    { text: "Loading fact..." },
  ]);
  const [copyStatus, setCopyStatus] = useState([false, false, false]);

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

  // Fetching 3 random facts when component mounts
  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const newFacts = [];

        // Fetch 3 random facts
        for (let i = 0; i < 3; i++) {
          const response = await fetch(
            "https://uselessfacts.jsph.pl/random.json"
          );
          const data = await response.json();
          newFacts.push(data);
        }

        setFacts(newFacts);
      } catch (error) {
        console.error("Error fetching facts:", error);
      }
    };

    fetchFacts();
  }, []);

  // Function to fetch a new fact for a specific card
  const refreshFact = async (index) => {
    try {
      // Set temporary loading state for this specific fact
      setFacts((prevFacts) => {
        const updatedFacts = [...prevFacts];
        updatedFacts[index] = { text: "Loading new fact..." };
        return updatedFacts;
      });

      // Fetch a new fact
      const response = await fetch("https://uselessfacts.jsph.pl/random.json");
      const data = await response.json();

      // Update the specific fact
      setFacts((prevFacts) => {
        const updatedFacts = [...prevFacts];
        updatedFacts[index] = data;
        return updatedFacts;
      });
    } catch (error) {
      console.error("Error fetching new fact:", error);
    }
  };

  // Function to copy fact text
  const copyFactText = (index) => {
    navigator.clipboard
      .writeText(facts[index].text)
      .then(() => {
        // Update copy status for visual feedback
        setCopyStatus((prev) => {
          const newStatus = [...prev];
          newStatus[index] = true;
          return newStatus;
        });

        // Reset copy status after 2 seconds
        setTimeout(() => {
          setCopyStatus((prev) => {
            const newStatus = [...prev];
            newStatus[index] = false;
            return newStatus;
          });
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleScrollDown = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      {/* 3D Scene Canvas - takes full viewport height */}
      <div className="w-full h-screen snap-start relative">
        <Canvas camera={{ position: [0, 0, 2], fov: 50 }} shadows>
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={2}
            maxDistance={3}
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
          ${
            isContentVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-16"
          }`}
        >
          <h1 className="text-5xl font-bold mb-6">FAKTOS</h1>
          <p className="text-xl mb-12">get your facts today.</p>

          {/* Add your main content here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Fact 1 */}
            <div className="flex flex-col items-center">
              <div
                className={`bg-gradient-to-b from-[#267ce5] to-[#165096] shadow-md shadow-gray-800 p-6 rounded-lg transition-all duration-1000 delay-100 ease-out transform w-full h-64 flex flex-col
                ${
                  isContentVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-16"
                }`}
              >
                <h2 className="text-2xl font-semibold mb-3">Fact Card</h2>
                <p className="overflow-y-auto flex-grow">{facts[0].text}</p>
              </div>
              <div
                className={`flex w-full gap-2 mt-4
                ${
                  isContentVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-16"
                }`}
              >
                <button
                  onClick={() => refreshFact(0)}
                  className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg text-center transition-all duration-200 flex-1 shadow-lg"
                >
                  Refresh Card
                </button>
                <button
                  onClick={() => copyFactText(0)}
                  className={`${
                    copyStatus[0]
                      ? "bg-[#267ce5]"
                      : "bg-white/20 hover:bg-white/30"
                  } text-white py-2 px-4 rounded-lg text-center transition-all duration-200 shadow-lg flex items-center justify-center`}
                  title="Copy fact to clipboard"
                >
                  <BiCopy size={20} />
                  {copyStatus[0] ? " Copied!" : ""}
                </button>
              </div>
            </div>

            {/* Fact 2 */}
            <div className="flex flex-col items-center">
              <div
                className={`bg-gradient-to-b from-[#267ce5] to-[#165096] shadow-md shadow-gray-800 p-6 rounded-lg transition-all duration-1000 delay-200 ease-out transform w-full h-64 flex flex-col
                ${
                  isContentVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-16"
                }`}
              >
                <h2 className="text-2xl font-semibold mb-3">Fact Card</h2>
                <p className="overflow-y-auto flex-grow">{facts[1].text}</p>
              </div>
              <div
                className={`flex w-full gap-2 mt-4
                ${
                  isContentVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-16"
                }`}
              >
                <button
                  onClick={() => refreshFact(1)}
                  className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg text-center transition-all duration-200 flex-1 shadow-lg"
                >
                  Refresh Card
                </button>
                <button
                  onClick={() => copyFactText(1)}
                  className={`${
                    copyStatus[1]
                      ? "bg-[#267ce5]"
                      : "bg-white/20 hover:bg-white/30"
                  } text-white py-2 px-4 rounded-lg text-center transition-all duration-200 shadow-lg flex items-center justify-center`}
                  title="Copy fact to clipboard"
                >
                  <BiCopy size={20} />
                  {copyStatus[1] ? " Copied!" : ""}
                </button>
              </div>
            </div>

            {/* Fact 3 */}
            <div className="flex flex-col items-center">
              <div
                className={`bg-gradient-to-b from-[#267ce5] to-[#165096] shadow-md shadow-gray-800 p-6 rounded-lg transition-all duration-1000 delay-300 ease-out transform w-full h-64 flex flex-col
                ${
                  isContentVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-16"
                }`}
              >
                <h2 className="text-2xl font-semibold mb-3">Fact Card</h2>
                <p className="overflow-y-auto flex-grow">{facts[2].text}</p>
              </div>
              <div
                className={`flex w-full gap-2 mt-4
                ${
                  isContentVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-16"
                }`}
              >
                <button
                  onClick={() => refreshFact(2)}
                  className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg text-center transition-all duration-200 flex-1 shadow-lg"
                >
                  Refresh Card
                </button>
                <button
                  onClick={() => copyFactText(2)}
                  className={`${
                    copyStatus[2]
                      ? "bg-[#267ce5]"
                      : "bg-white/20 hover:bg-white/30"
                  } text-white py-2 px-4 rounded-lg text-center transition-all duration-200 shadow-lg flex items-center justify-center`}
                  title="Copy fact to clipboard"
                >
                  <BiCopy size={20} />
                  {copyStatus[2] ? " Copied!" : ""}
                </button>
              </div>
            </div>
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
