import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import FactCard from "./components/FactCard";
import { BiChevronDown } from "react-icons/bi";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import useFacts from "./hooks/useFacts";
import History from "/HistoryAndCulture.jpg";
import Science from "/ScienceAndTech.jpg";
import Trivia from "/Trivia.webp";
import Scene3D from "./components/Scene3D";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const contentRef = useRef(null);
  const introductionRef = useRef(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isIntroVisible, setIsIntroVisible] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { facts, refreshFact, copyFactText, copyStatus } = useFacts();

  const categories = [
    {
      id: 1,
      name: "Science and Technology",
      imageUrl: Science,
    },
    {
      id: 2,
      name: "Culture and History",
      imageUrl: History,
    },
    {
      id: 3,
      name: "Trivia",
      imageUrl: Trivia,
    },
  ];

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
    const contentObserver = new IntersectionObserver(
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

    const introObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntroVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      contentObserver.observe(contentRef.current);
    }

    if (introductionRef.current) {
      introObserver.observe(introductionRef.current);
    }

    return () => {
      if (contentRef.current) {
        contentObserver.unobserve(contentRef.current);
      }
      if (introductionRef.current) {
        introObserver.unobserve(introductionRef.current);
      }
    };
  }, []);

  const handleScrollDown = () => {
    introductionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetFact = () => {
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
      <Analytics />
      {/* 3D Scene Canvas */}
      <div className="w-full h-screen snap-start relative">
        <Scene3D windowSize={windowSize} isContentVisible={isContentVisible} />
        {/* Scroll down indicator */}
        <button
          onClick={handleScrollDown}
          className="absolute bottom-10 mb-4 sm:bottom-8 sm:mb-2 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center cursor-pointer transition-all duration-300 hover:opacity-80 hover:translate-y-1 animate-pulse"
          aria-label="Scroll down to content"
        >
          <span className="mb-2 font-medium text-sm sm:text-base">Next</span>
          <BiChevronDown size={windowSize.width < 640 ? 24 : 32} />
        </button>
      </div>

      <div
        ref={introductionRef}
        className="w-full min-h-screen h-auto snap-start bg-[#FBFBFB] flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 md:py-24 "
      >
        {/* Introduction */}
        <div
          className={`flex flex-col md:flex-row mx-auto w-full max-w-7xl bg-white shadow-lg rounded-lg overflow-hidden 
          transition-all duration-1000 ease-in transform
          ${
            isIntroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          {/* Left column - Introduction */}
          <div className="w-full md:w-1/3 px-4 sm:px-6 py-8 sm:py-10">
            <div className="max-w-md mx-auto md:ml-0">
              <p className="uppercase text-sm font-medium tracking-wider mb-2 text-gray-800">
                Faktos
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-gray-900">
                Uncover Fascinating Facts You Never Knew – Follow Us for Daily
                Mind-Blowing Insights!
              </h1>
              <button
                className="mt-6 sm:mt-8 bg-amber-200 px-4 sm:px-6 py-2 sm:py-3 w-42 rounded-full flex items-center justify-center gap-2 font-medium text-gray-800 hover:bg-amber-300 transition-colors"
                onClick={handleGetFact}>
                Get your fact!
              </button>
            </div>
          </div>
          {/* Right column - Categories */}
          <div className="w-full md:w-2/3 bg-white p-4 sm:p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 w-full text-center md:text-left">
              Explore Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="relative overflow-hidden rounded-lg shadow-md bg-gray-100 w-full h-40 sm:h-48 md:h-56 lg:h-64 mx-auto"
                >
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/600x400?text=" + category.name;
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-3 md:p-4">
                    <h3 className="text-white font-medium text-sm sm:text-base md:text-lg text-center">
                      {category.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div
        ref={contentRef}
        className="min-h-screen w-full bg-gray-800 text-white p-4 sm:p-6 md:p-8 pb-20 sm:pb-16 snap-start relative"
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
            absolute bottom-10 sm:bottom-6 left-1/2 transform -translate-x-1/2 pb-8 sm:pb-0`}
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
