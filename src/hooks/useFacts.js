import { useState, useEffect } from "react";

const useFacts = () => {
  const [facts, setFacts] = useState([
    { text: "Loading fact...", isVisible: false },
    { text: "Loading fact...", isVisible: false },
    { text: "Loading fact...", isVisible: false },
  ]);
  const [copyStatus, setCopyStatus] = useState([false, false, false]);

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

      const response = await fetch("https://uselessfacts.jsph.pl/random.json");
      const data = await response.json();

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
