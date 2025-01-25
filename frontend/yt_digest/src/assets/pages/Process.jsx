import "./process.css"
import React from "react";
import Ytcard from "../components/ytcard";
import Summary from "../components/Summary";
import { useContext } from "react";
import { UrlContext, SummaryresultContext } from "../dbstack/context";


function Process() {
  const { yturl, setyturl } = useContext(UrlContext);
const imageUrl = "https://i.postimg.cc/4dnZCH03/background.png";
  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "row",
      }}
    >
      <div className="left">
        <Ytcard videoId={yturl} />
      </div>
      <div
        className="right-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          
          padding: 10,
          borderRadius: "15px",
          
        }}
      >
        <div
          className="top"
          style={{
            order: 1,
            backgroundColor: "white",
          }}
        >
          <Summary />
        </div>
        <div
          className="bottom-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            
            order: 2,
            margin: 30,
          }}
        >
          <div className="form-group">
            <input
              type="text"
              className="form-style"
              placeholder="Enter Download Path"
              autoComplete="off"

              //ref={urlRef}
            />
            <i className="input-icon material-icons">alternate_email</i>

            <button className="btn">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Process;
