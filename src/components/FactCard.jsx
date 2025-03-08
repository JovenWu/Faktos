import React, { useState } from "react";
import { BiCopy } from "react-icons/bi";

const FactCard = ({ fact, index, refreshFact, copyFactText, copyStatus }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`bg-gradient-to-b from-[#267ce5] to-[#165096] shadow-md shadow-gray-800 p-6 rounded-lg transition-all duration-1000 delay-${
          index * 100
        } ease-out transform w-full h-64 flex flex-col
        ${
          fact.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-16"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-3">Fact Card</h2>
        <p className="overflow-y-auto flex-grow">{fact.text}</p>
      </div>
      <div
        className={`flex w-full gap-2 mt-4
        ${
          fact.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-16"
        }`}
      >
        <button
          onClick={() => refreshFact(index)}
          className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg text-center transition-all duration-200 flex-1 shadow-lg"
        >
          Refresh Card
        </button>
        <button
          onClick={() => copyFactText(index)}
          className={`${
            copyStatus ? "bg-[#267ce5]" : "bg-white/20 hover:bg-white/30"
          } text-white py-2 px-4 rounded-lg text-center transition-all duration-200 shadow-lg flex items-center justify-center`}
          title="Copy fact to clipboard"
        >
          <BiCopy size={20} />
          {copyStatus ? " Copied!" : ""}
        </button>
      </div>
    </div>
  );
};

export default FactCard;
