import React, { memo } from "react";
import { BiCopy } from "react-icons/bi";

const FactCard = ({ fact, index, refreshFact, copyFactText, copyStatus }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`bg-gradient-to-b from-[#267ce5] to-[#165096] shadow-md shadow-gray-800 p-4 sm:p-6 rounded-lg transition-all duration-1000 delay-${
          index * 100
        } ease-out transform w-full h-48 sm:h-56 md:h-64 flex flex-col
        ${
          fact.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-16"
        }`}
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Fact Card</h2>
        <p className="overflow-y-auto flex-grow text-sm sm:text-base">{fact.text}</p>
      </div>
      <div
        className={`flex w-full gap-2 mt-3 sm:mt-4
        ${
          fact.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-16"
        }`}
      >
        <button
          onClick={() => refreshFact(index)}
          className="bg-white/20 hover:bg-white/30 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-center transition-all duration-200 flex-1 shadow-lg text-sm sm:text-base"
        >
          Refresh Card
        </button>
        <button
          onClick={() => copyFactText(index)}
          className={`${
            copyStatus ? "bg-[#267ce5]" : "bg-white/20 hover:bg-white/30"
          } text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-center transition-all duration-200 shadow-lg flex items-center justify-center`}
          title="Copy fact to clipboard"
        >
          <BiCopy size={20} />
          {copyStatus ? 
            <span className="ml-1 text-sm sm:text-base">Copied!</span> : 
            ""}
        </button>
      </div>
    </div>
  );
};

export default memo(FactCard);