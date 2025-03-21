import React, { useState, useEffect } from "react";

function Typewriter({ text = "", speed = 20, cursor = true, loop = false }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Reset state when text changes
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsTypingComplete(false);
  }, [text]);

  useEffect(() => {
    if (!text || text.length === 0) {
      setDisplayedText("");
      setCurrentIndex(0);
      setIsTypingComplete(false);
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (loop && !isTypingComplete) {
      // Reset typing for loop
      setTimeout(() => {
        setDisplayedText("");
        setCurrentIndex(0);
        setIsTypingComplete(false);
      }, 1000); // Delay before restarting
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex, text, speed, loop, isTypingComplete]);

  return (
    <div>
      <span dangerouslySetInnerHTML={{ __html: displayedText }} />
      {cursor && !isTypingComplete && <span className="cursor">|</span>}
    </div>
  );
}

export default Typewriter;
