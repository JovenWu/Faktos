import { useState, useEffect } from "react";
import fallbackFacts from "../components/Fact.json";

const useFacts = () => {
  const [facts, setFacts] = useState([
    { text: "Loading fact...", isVisible: false },
    { text: "Loading fact...", isVisible: false },
    { text: "Loading fact...", isVisible: false },
  ]);
  const [copyStatus, setCopyStatus] = useState([false, false, false]);

  // Helper function to get a random fallback fact
  const getRandomFallbackFact = () => {
    const randomIndex = Math.floor(Math.random() * fallbackFacts.length);
    return fallbackFacts[randomIndex].fact;
  };

  // Helper function to fetch a fact with fallback
  const fetchFactWithFallback = async () => {
    try {
      const response = await fetch("https://uselessfacts.jsph.pl/random.json");
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn("Using fallback fact due to API error:", error);
      return {
        text: getRandomFallbackFact(),
        source: "Local Fact Database",
        language: "en"
      };
    }
  };

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const newFacts = [];

        // Fetch 3 random facts
        for (let i = 0; i < 3; i++) {
          const data = await fetchFactWithFallback();
          newFacts.push({ ...data, isVisible: true });
        }

        setFacts(newFacts);
      } catch (error) {
        console.error("Error fetching facts:", error);
      }
    };

    fetchFacts();
  }, []);

  const refreshFact = async (index) => {
    try {
      setFacts((prevFacts) => {
        const updatedFacts = [...prevFacts];
        updatedFacts[index] = { text: "Loading new fact...", isVisible: true };
        return updatedFacts;
      });

      const data = await fetchFactWithFallback();

      setFacts((prevFacts) => {
        const updatedFacts = [...prevFacts];
        updatedFacts[index] = { ...data, isVisible: true };
        return updatedFacts;
      });
    } catch (error) {
      console.error("Error fetching new fact:", error);
    }
  };

  const copyFactText = (index) => {
    navigator.clipboard
      .writeText(facts[index].text)
      .then(() => {
        setCopyStatus((prev) => {
          const newStatus = [...prev];
          newStatus[index] = true;
          return newStatus;
        });

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

  return { facts, refreshFact, copyFactText, copyStatus };
};

export default useFacts;