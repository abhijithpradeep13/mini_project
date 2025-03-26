import "./process.css";
import "./Home.css";
import Loading from "./Loading";
import React, { useState } from "react";
import Ytcard from "../components/ytcard";
import Summary from "../components/Summary";
import Mcqdisplay from "../components/mcq_display";
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
  const {
    summaryresult,
    setsummaryresult,
    summarypath,
    setsummarypath,
    transcriptionresult,
    settranscriptionresult,
  } = useContext(SummaryresultContext);
  const { isInnerChecked, isLoading, setIsLoading,quiztoggle, setquiztoggle } =
    useContext(LoadingstateContext);

  const [quizclicked, setquizclicked] = useState(false);
  const [quizdata, setquizdata] = useState(null); // Set initial state to null



  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (yturl && yturl.length > 0) {
      localStorage.setItem("ytembed", JSON.stringify(yturl));
      localStorage.setItem("summary-stg", JSON.stringify(summaryresult));
      localStorage.setItem("path-stg", JSON.stringify(summarypath));
      localStorage.setItem(
        "transtext-stg",
        JSON.stringify(transcriptionresult)
      );
    }

    // Save quiz data and quiz clicked state
    if (quizdata) {
      localStorage.setItem("quiz-data", JSON.stringify(quizdata));
    }
    localStorage.setItem("quiz-clicked", JSON.stringify(quizclicked));
  }, [
    yturl,
    summaryresult,
    summarypath,
    quizdata,
    quizclicked,
    transcriptionresult,
  ]);

  // Load saved data on initial render
  useEffect(() => {
    const savedResults1 = localStorage.getItem("ytembed");
    const savedResults2 = localStorage.getItem("summary-stg");
    const savedResults3 = localStorage.getItem("path-stg");
    const savedQuizData = localStorage.getItem("quiz-data");
    const savedQuizClicked = localStorage.getItem("quiz-clicked");
    const savedtranstextData = localStorage.getItem("transtext-stg");
    console.log(savedtranstextData, " savedtranstextData ");

    if (savedResults1) {
      setyturl(JSON.parse(savedResults1));
    }
    if (savedResults2) {
      setsummaryresult(JSON.parse(savedResults2));
    }
    if (savedResults3) {
      setsummarypath(JSON.parse(savedResults3));
    }
    if (savedQuizData) {
      setquizdata(JSON.parse(savedQuizData));
    }
    if (savedQuizClicked) {
      setquizclicked(JSON.parse(savedQuizClicked));
    }
    if (savedtranstextData) {
      settranscriptionresult(JSON.parse(savedtranstextData));
    }
  }, [
    setyturl,
    setsummaryresult,
    setsummarypath,
    setquizdata,
    setquizclicked,
    settranscriptionresult,
  ]);

  function extractText(str, startKeyword, endKeyword) {
    const start = str.indexOf(startKeyword);
    if (start === -1) return str; // If start keyword not found, return the original string

    const actualStart = start + startKeyword.length;
    const end = str.indexOf(endKeyword, actualStart);

    if (end === -1) return str.substring(actualStart); // If end keyword not found

    return str.substring(actualStart, end);
  }

  const submitprompt = async () => {
    setIsLoading(true); // Show loading state

    try {
      console.log("Sending request with yturl:", yturl);
      const response = await axios.post("http://127.0.0.1:5000/api/quiz", {
        transcriptionresult,
      });

      console.log("API Response:", response.data);

      // Check if the response has the expected format
      if (response.data && response.data.quizresponse) {
        let quizContent = response.data.quizresponse;

        // If the response is already a JSON object, use it directly
        if (typeof quizContent === "object") {
          console.log("Setting quizdata with object:", quizContent);
          setquizdata(quizContent);
        } else {
          // If the response is a string that might contain JSON in markdown format
          const extractedData = extractText(quizContent, "```json", "```");

          try {
            // Clean the string and parse it
            const cleanedData = extractedData.trim();
            console.log("Cleaned data:", cleanedData);
            const parsedData = JSON.parse(cleanedData);
            console.log("Setting quizdata with parsed data:", parsedData);
            setquizdata(parsedData);
          } catch (parseError) {
            console.error("Error parsing extracted JSON:", parseError);
            console.log("Failed to parse:", extractedData);
            alert("Error parsing quiz data. Check console for details.");
          }
        }

        setquizclicked(true);
      } else {
        console.error("Invalid response format:", response.data);
        alert("Received an invalid response format from the server.");
      }
    } catch (error) {
      console.error("Error during processing:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  // Reset quiz data function
  const resetQuiz = () => {
    setquizdata(null);
    setquizclicked(false);
    localStorage.removeItem("quiz-data");
    localStorage.setItem("quiz-clicked", "false");
  };

  // Track quizdata updates
  useEffect(() => {
    console.log("Updated quizdata:", quizdata);
  }, [quizdata]);

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
        {quiztoggle ==='enabled' && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn" onClick={submitprompt}>
              {quizclicked ? "Refresh Quiz" : "Quiz"}
            </button>
            {quizclicked && (
              <button
                className="btn"
                onClick={resetQuiz}
                style={{ backgroundColor: "#f44336" }}
              >
                Back to Summary
              </button>
            )}
          </div>
        )}
      </div>
      <div
        className="right-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
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
            maxHeight: "600px",
            minWidth: "708px",
            minHeight: "600px",
          }}
        >
          {isLoading ? (
            <Loading />
          ) : quizclicked && quizdata ? (
            <Mcqdisplay questionsData={quizdata} />
          ) : (
            <Summary />
          )}
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
          {/* <div className="form-group">
            <button className="btn">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Process;
