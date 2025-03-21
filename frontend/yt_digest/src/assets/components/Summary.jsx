import React, { useContext, useEffect, useState } from "react";
import { SummaryresultContext } from "../dbstack/context";
import Typewriter from "./Typewritereffect";
import "./summary.css";

function Summary() {
  const { summaryresult } = useContext(SummaryresultContext);
  const [text, setText] = useState(summaryresult || "");

  // Update text state when summaryresult changes
  useEffect(() => {
    setText(summaryresult || "");
    console.log("summaryresult updated:", summaryresult);
  }, [summaryresult]);


  useEffect(() => {
    console.log("Typewriter text updated:", text);
  }, [text]);
  
  return (
    <div className="scrollable typing-effect">
      <Typewriter
        key={text}
        text={text}
        speed={20}
        cursor={true}
        loop={false}
      />
    </div>
  );
}

export default Summary;
