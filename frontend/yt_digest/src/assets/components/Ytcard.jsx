import React from 'react'
import {
  LoadingstateContext,
} from "../dbstack/context";
import { useContext } from 'react';
function Ytcard({ videoId }) {

  const { isLoading, setIsLoading } = useContext(LoadingstateContext);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "10px",
        border:"5px",
        borderRadius: "20px",
        
        
      }}
    >
      <iframe
        width="400"
        height="200"
      
        src={videoId}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          pointerEvents: isLoading ? "none" : "auto", // Disable iframe interaction when loading
          opacity: isLoading ? "0.5" : "1",
        }}
      ></iframe>
    </div>
  );
}

export default Ytcard