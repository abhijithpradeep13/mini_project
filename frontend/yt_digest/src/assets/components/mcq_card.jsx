import React, { useState } from "react";
import "./mcq_card.css"; // Import the CSS file

const MultipleChoiceCard = ({ question, options, onSubmit }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelection = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="multiple-choice-card">
      <h3 className="multiple-choice-question">{question}</h3>
      <div className="multiple-choice-options">
        {options.map((option) => (
          <label key={option} className="multiple-choice-option">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleSelection(option)}
              className="multiple-choice-checkbox"
            />
            {option}
          </label>
        ))}
      </div>
      <button
        className="multiple-choice-button"
        onClick={() => onSubmit(selectedOptions)}
      >
        Submit
      </button>
    </div>
  );
};

export default MultipleChoiceCard;
