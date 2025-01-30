import React from "react";
import { useContext, useEffect, useState } from "react";
import { SummaryresultContext } from "../dbstack/context";
import { Typewriter } from "react-simple-typewriter";
import "./summary.css";


function Summary() {
  const { summaryresult } = useContext(SummaryresultContext);

  return (
    <div className="scrollable typing-effect ">
      <Typewriter
        words={[summaryresult]}
        cursor
        deleteSpeed={0}
        cursorStyle="_"
        typeSpeed={40}
      />
     
    </div>
  );
}

export default Summary;
