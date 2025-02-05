import React from "react";
import { useContext, useEffect, useState } from "react";
import { SummaryresultContext } from "../dbstack/context";
import { Typewriter } from "react-simple-typewriter";

import "./summary.css";

/*
import React, { useState, useEffect } from 'react';

function Typewriter({ text, speed = 100, cursorStyle = '_', loop = false }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    let typingInterval;
    let cursorInterval;

    const type = () => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      } else {
        setIsTypingComplete(true);
        if (loop) {
          setTimeout(() => {
            setDisplayedText('');
            setIsTypingComplete(false);
            index = 0;
          }, 1000);
        }
      }
    };

    typingInterval = setInterval(type, speed);

    if (loop) {
      cursorInterval = setInterval(() => {
        setIsCursorVisible((prev) => !prev);
      }, 500);
    }

    return () => {
      clearInterval(typingInterval);
      if (loop) {
        clearInterval(cursorInterval);
      }
    };
  }, [text, speed, loop]);

  return (
    <div>
      <span>{displayedText}</span>
      {isCursorVisible && <span>{cursorStyle}</span>}
    </div>
  );
}

export default Typewriter;

*/ 

function Summary() {
  const { summaryresult } = useContext(SummaryresultContext);
  const[cursor,setcursor]=useState(true) 
  return (
    <div className="scrollable typing-effect ">
      <Typewriter
        words={[summaryresult]}
        cursor={cursor}
        deleteSpeed={0}
        cursorStyle="_"
        typeSpeed={40}
        onLoopDone={() => setcursor(!cursor)}
        loop={1}
      />
    </div>
  );
}

export default Summary;
