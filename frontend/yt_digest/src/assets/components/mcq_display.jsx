import React from "react";
import "./mcq_display.css" 
import MultipleChoiceCard from "./mcq_card";
import { useState, useEffect } from "react";
const Mcqdisplay = ({ questionsData }) => {
  //Sample questions data
  // const questionsData = [
  //   {
  //     id: 1,
  //     question: "What is the capital of France?",
  //     options: ["London", "Berlin", "Paris", "Madrid"],
  //     correctAnswer: "Paris",
  //   },
  //   {
  //     id: 2,
  //     question: "Which planet is known as the Red Planet?",
  //     options: ["Earth", "Mars", "Jupiter", "Venus"],
  //     correctAnswer: "Mars",
  //   },
  //   {
  //     id: 3,
  //     question: "What is 2 + 2?",
  //     options: ["3", "4", "5", "6"],
  //     correctAnswer: "4",
  //   },
  // ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    Array(questionsData.length).fill(null)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (isSubmitted) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option;
    setUserAnswers(newAnswers);
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit answers for evaluation
  const handleSubmit = () => {
    setIsSubmitted(true);
    let totalScore = 0;

    userAnswers.forEach((answer, index) => {
      if (answer === questionsData[index].correctAnswer) {
        totalScore++;
      }
    });

    setScore(totalScore);
  };

  // Reset quiz
  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(Array(questionsData.length).fill(null));
    setIsSubmitted(false);
    setScore(0);
  };

  // Determine option class based on submission state and correctness
  const getOptionClass = (option) => {
    const currentQuestion = questionsData[currentQuestionIndex];
    const userSelectedThisOption = userAnswers[currentQuestionIndex] === option;

    if (!isSubmitted) {
      return userSelectedThisOption ? "option-selected" : "";
    }

    if (option === currentQuestion.correctAnswer) {
      return "option-correct"; // Correct answer is always green when submitted
    }

    if (userSelectedThisOption) {
      return "option-incorrect"; // User selected wrong answer
    }

    return ""; // Unselected and incorrect options
  };

  return (
    <div className="mcq-card">
      {/* Progress indicator */}
      <div className="progress-bar">
        <span className="question-counter">
          Question {currentQuestionIndex + 1} of {questionsData.length}
        </span>
        {isSubmitted && (
          <span className="score-display">
            Score: {score}/{questionsData.length}
          </span>
        )}
      </div>

      {/* Question */}
      <div className="question-container">
        <h2 className="question-text">
          {questionsData[currentQuestionIndex].question}
        </h2>
      </div>

      {/* Options */}
      <div className="options-container">
        {questionsData[currentQuestionIndex].options.map((option, index) => (
          <div
            key={index}
            className={`option-item ${getOptionClass(option)}`}
            onClick={() => handleOptionSelect(option)}
          >
            <div className="option-content">
              <div
                className={`radio-button ${
                  userAnswers[currentQuestionIndex] === option
                    ? "radio-selected"
                    : ""
                }`}
              >
                {userAnswers[currentQuestionIndex] === option && (
                  <div className="radio-dot"></div>
                )}
              </div>
              <span>{option}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation/Action buttons */}
      <div className="navigation-buttons">
        <button
          className="button previous-button"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>

        {!isSubmitted && currentQuestionIndex === questionsData.length - 1 ? (
          <button className="button submit-button" onClick={handleSubmit}>
            Submit
          </button>
        ) : isSubmitted ? (
          <button className="button reset-button" onClick={handleReset}>
            Reset
          </button>
        ) : (
          <button
            className="button next-button"
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questionsData.length - 1}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Mcqdisplay;
