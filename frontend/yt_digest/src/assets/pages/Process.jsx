import "./process.css";
import "./Home.css";
import Loading from "./Loading";
import React from "react";
import Ytcard from "../components/ytcard";
import Summary from "../components/Summary";
import { useContext, useEffect } from "react";
import {
  UrlContext,
  SummaryresultContext,
  LoadingstateContext,
} from "../dbstack/context";
import { useRef } from "react";
import axios from "axios";



function Process() {
  const { yturl, setyturl } = useContext(UrlContext);
  const { summaryresult, setsummaryresult } = useContext(SummaryresultContext);
  const { isInnerChecked ,isLoading, setIsLoading,} =
      useContext(LoadingstateContext);

  const promptref = useRef(null);

  // Save ytembed to localStorage whenever it changes
  useEffect(() => {
    if (yturl && yturl.length > 0) {
      localStorage.setItem("ytembed", JSON.stringify(yturl));
      localStorage.setItem("summary-stg", JSON.stringify(summaryresult));
    }
  }, [yturl, summaryresult]);

  useEffect(() => {
    const savedResults1 = localStorage.getItem("ytembed");
    const savedResults2 = localStorage.getItem("summary-stg");
    if (savedResults1) {
      setyturl(JSON.parse(savedResults1));
    }
    if (savedResults2) {
      setsummaryresult(JSON.parse(savedResults2));
    }
  }, [setyturl, setsummaryresult]);


  const submitprompt = async () => {
    const prompt = promptref.current.value; // Extract the value
   
    
    setIsLoading(true); // Show loading state

    try {
      setIsLoading(true); // Show loading state
      const response = await axios.post(
        "http://127.0.0.1:5000/api/notemaking",
        {
          prompt,
        }
      );
     setsummaryresult(response.data.gentext);
     
    } catch (error) {
      console.error("Error during processing:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };
{
  isLoading && <Loading />;
}

  return (

    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "100vh",
        flexDirection: "row",
      }}
    >
      <div
        className="left"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div className="card1">
          <Ytcard videoId={yturl} />
        </div>
        {isInnerChecked && (
          <div>
            <input
              type="text"
              className="form-style"
              placeholder="Enter Your Promt Here......."
              id="prompt"
              autoComplete="off"
              ref={promptref}
              style={{
                paddingLeft: "10px",
                height: "70px",
                width: "400px",
              }}
            />
            <button className="btn" onClick={()=>{submitprompt()}}>
              
            </button>
          </div>
        )}
      </div>
      <div
        className="right-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "700px",
          width: "800px",
          flexDirection: "column",
          margin: "25px",
          padding: "10px",
          borderRadius: "15px",
          marginRight: "15px",
        }}
      >
        <div
          className="top"
          style={{
            order: 1,
            backgroundColor: "white",
            padding: "20px",
            border: "5px black",
            borderRadius: "5px black",
            maxHeight: "450px",
            minWidth: "708px",
            minHeight: "450px",
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
