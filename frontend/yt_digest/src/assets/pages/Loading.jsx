import React from "react";
import "./loading.css";

function Loading() {
  return (
    <div className="loading-overlay">
      <div style={{position:"relative"}}>
        <div className="loader"></div>
      </div>
    </div>
  );
}

export default Loading;
