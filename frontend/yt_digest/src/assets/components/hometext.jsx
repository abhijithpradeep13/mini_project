import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Hometext ({ texts, interval = 3000, speed = 100 })  {
  const [index, setIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[index];

    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + currentText[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      const hold = setTimeout(() => {
        setTypedText("");
        setCharIndex(0);
        setIndex((prev) => (prev + 1) % texts.length);
      }, interval);

      return () => clearTimeout(hold);
    }
  }, [charIndex, index, texts, speed, interval]);

  return (
    <motion.pre
          className=" whitespace-pre-wrap"
          style={{
         color: "rgb(220, 20, 60)",
         fontSize: "35px",
         fontFamily: "amita",
       }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {typedText}
      <span className="animate-pulse">|</span>
    </motion.pre>
  );
};
export default Hometext;