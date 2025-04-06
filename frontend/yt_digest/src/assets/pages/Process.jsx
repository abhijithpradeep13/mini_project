import "./process.css";
import "./Home.css";
import Loading from "./Loading";
import React, { useState, useEffect, useRef } from "react";
import Ytcard from "../components/ytcard";
import Summary from "../components/Summary";
import Mcqdisplay from "../components/mcq_display";
import { useContext } from "react";
import {
  UrlContext,
  SummaryresultContext,
  LoadingstateContext,
} from "../dbstack/context";
import axios from "axios";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { useNavigate } from "react-router-dom";

// Define styles for PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
    fontWeight: "bold",
  },
  bullet: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
    marginLeft: 10,
  },
  header: {
    fontSize: 10,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  footer: {
    fontSize: 10,
    marginTop: 20,
    textAlign: "center",
    color: "grey",
  },
});

// Create PDF Document component
const MyDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>AI-Generated Notes</Text>
      <Text style={styles.header}>
        Generated on {new Date().toLocaleDateString()}
      </Text>

      {data.title && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Video Title:</Text>
          <Text style={styles.text}>{data.title}</Text>
        </View>
      )}

      {data && (
        <View style={styles.section}>
          <Text style={styles.text}>{data}</Text>
        </View>
      )}

      {data.keyPoints && data.keyPoints.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Key Points:</Text>
          {data.keyPoints.map((point, index) => (
            <Text key={index} style={styles.bullet}>
              • {point}
            </Text>
          ))}
        </View>
      )}

      {data.notes && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Detailed Notes:</Text>
          <Text style={styles.text}>{data.notes}</Text>
        </View>
      )}

      <Text style={styles.footer}>Created with YTDIGEST</Text>
    </Page>
  </Document>
);

// Error page component
const ErrorPage = ({ secondsLeft, navigateToHome }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      textAlign: "center",
      padding: "20px",
      position: "absolute",
      top: "20px",
      left: "700px",
    }}
  >
    <h1 style={{ color: "#f44336", display: "inline" }}>
      Oops! Something went wrong
    </h1>
    <p style={{ color: "#F0F0F0", display: "inline" }}>
      Your session data was cleared. You'll be redirected to home in{" "}
      {secondsLeft} seconds.
    </p>
    <button
      className="btn"
      onClick={navigateToHome}
      style={{ marginTop: "20px", backgroundColor: "#dc143c" }}
    >
      Go to Home Now
    </button>
  </div>
);

function Process() {
  const { yturl, setyturl } = useContext(UrlContext);
  const {
    summaryresult,
    setsummaryresult,
    summarypath,
    setsummarypath,
    transcriptionresult,
    settranscriptionresult,
    pdfdata,
    setpdfdata,
  } = useContext(SummaryresultContext);
  const { isInnerChecked, isLoading, setIsLoading, quiztoggle, setquiztoggle } =
    useContext(LoadingstateContext);

  const [quizclicked, setquizclicked] = useState(false);
  const [quizdata, setquizdata] = useState(null);
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [redirectCounter, setRedirectCounter] = useState(5);

  // Use a ref to track if this is the initial mount
  const isInitialMount = useRef(true);

  // Use a ref to track if data has been loaded from localStorage
  const dataLoaded = useRef(false);

  const navigate = useNavigate();

  // Set up navigation tracking when component mounts
  useEffect(() => {
    // Set a unique ID for this session
    if (!sessionStorage.getItem("processPageSessionId")) {
      sessionStorage.setItem("processPageSessionId", Date.now().toString());
      // Mark that the Process page has been visited
      sessionStorage.setItem("processPageVisited", "true");
    }

    // Listen for beforeunload to detect when the user is about to leave the page
    const handleBeforeUnload = (event) => {
      // Store the current URL as the last visited page
      sessionStorage.setItem("lastVisitedPage", window.location.href);

      // Detect if this is a refresh (F5 or Ctrl+R)
      // We don't want to clear data on refresh, so we'll set a flag
      sessionStorage.setItem("isRefreshing", "true");

      // The refresh flag will be cleared after the page loads
      // This is done below in another useEffect
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up event listener
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Clear the refresh flag when the page loads
  useEffect(() => {
    const isRefreshing = sessionStorage.getItem("isRefreshing") === "true";

    if (isRefreshing) {
      // Clear the refresh flag
      sessionStorage.removeItem("isRefreshing");
      console.log("Page was refreshed, preserving data");
    }

    // This runs once when the component mounts
    return () => {
      // This runs when the component unmounts
    };
  }, []);

  // Function to clear all localStorage items and reset contexts
  const clearAllData = () => {
    console.log("Clearing all data (localStorage and contexts)");

    // First clear localStorage items
    localStorage.removeItem("ytembed");
    localStorage.removeItem("summary-stg");
    localStorage.removeItem("path-stg");
    localStorage.removeItem("quiz-data");
    localStorage.removeItem("quiz-clicked");
    localStorage.removeItem("transtext-stg");

    // Then reset all context states
    setyturl("");
    setsummaryresult(null);
    setsummarypath(null);
    settranscriptionresult(null);
    setpdfdata(null);
    setquizdata(null);
    setquizclicked(false);

    // Mark that data was cleared
    sessionStorage.setItem("dataCleared", "true");
  };

  // Handle browser back/forward navigation
  useEffect(() => {
    // Function to handle back button navigation
    const handlePopState = (event) => {
      console.log("Navigation detected", event);

      // Check if we're navigating away from the Process page
      if (window.location.pathname !== "/Process") {
        // Clear all data when navigating away using back button
        clearAllData();
        console.log("Data cleared on navigation away from Process page");
      }
    };

    // Add event listener for popstate events (back/forward navigation)
    window.addEventListener("popstate", handlePopState);

    // Clean up the event listener
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Start countdown for redirect
  const startRedirectCountdown = () => {
    let counter = 5;
    setRedirectCounter(counter);

    const countdownInterval = setInterval(() => {
      counter -= 1;
      setRedirectCounter(counter);

      if (counter <= 0) {
        clearInterval(countdownInterval);
        navigate("/"); // Navigate to home page
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  };

  // Check if data is missing on mount and after navigation
  useEffect(() => {
    // Skip this on the initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Check if data is cleared and we're on the Process page from a back/forward navigation
    if (
      sessionStorage.getItem("dataCleared") === "true" &&
      sessionStorage.getItem("processPageVisited") === "true"
    ) {
      // Check if localStorage data is missing (specifically the YouTube embed URL)
      if (!localStorage.getItem("ytembed")) {
        console.log("Data is missing after navigation");
        setShowErrorPage(true);
        startRedirectCountdown();
      }
    }
  }, [navigate]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    // Only save data if it's not null/undefined
    if (yturl && yturl.length > 0) {
      localStorage.setItem("ytembed", JSON.stringify(yturl));
    }

    if (summaryresult) {
      localStorage.setItem("summary-stg", JSON.stringify(summaryresult));
    }

    if (summarypath) {
      localStorage.setItem("path-stg", JSON.stringify(summarypath));
    }

    if (transcriptionresult) {
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

    // Mark that data has been saved
    if (yturl && summaryresult) {
      sessionStorage.removeItem("dataCleared");
    }
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
    // Skip loading if we're showing the error page or if data has already been loaded
    if (showErrorPage || dataLoaded.current) return;

    const savedResults1 = localStorage.getItem("ytembed");
    const savedResults2 = localStorage.getItem("summary-stg");
    const savedResults3 = localStorage.getItem("path-stg");
    const savedQuizData = localStorage.getItem("quiz-data");
    const savedQuizClicked = localStorage.getItem("quiz-clicked");
    const savedtranstextData = localStorage.getItem("transtext-stg");

    // Only load data if it exists
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

    // If data was cleared but we're trying to access the Process page with no data
    if (
      !savedResults1 &&
      !savedResults2 &&
      sessionStorage.getItem("processPageVisited") === "true"
    ) {
      console.log("No data found after navigation, showing error page");
      setShowErrorPage(true);
      startRedirectCountdown();
    }

    // Mark that data has been loaded
    dataLoaded.current = true;
  }, [
    setyturl,
    setsummaryresult,
    setsummarypath,
    setquizdata,
    setquizclicked,
    settranscriptionresult,
    showErrorPage,
    navigate,
  ]);

  // Handle direct access to process page
  useEffect(() => {
    // Check if both the YouTube URL and summary data are missing
    const hasYtUrl = !!localStorage.getItem("ytembed");
    const hasSummary = !!localStorage.getItem("summary-stg");

    // If user directly accesses the Process page without data, redirect to home
    if (!hasYtUrl && !hasSummary && !showErrorPage) {
      console.log("Direct access to Process page with no data, redirecting");
      setShowErrorPage(true);
      startRedirectCountdown();
    }
  }, [showErrorPage]);

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

  // Function to generate PDF
  const handleGeneratePDF = () => {
    if (!pdfdata) {
      setPdfError("No data available to generate PDF.");
      return;
    }

    setIsPdfReady(true);
    setPdfError(null);
  };

  // Handle PDF error dismissal
  const dismissError = () => {
    setPdfError(null);
  };

  // Function to navigate to home page
  const navigateToHome = () => {
    // Clear all data before navigating
    clearAllData();
    navigate("/");
  };

  // Listen for unload/navigation away - this is the key part to fix
  useEffect(() => {
    const handleUnload = () => {
      // Check if this is a refresh
      const isRefreshing = sessionStorage.getItem("isRefreshing") === "true";

      // Only mark as leaving if this is not a refresh
      if (window.location.pathname === "/Process" && !isRefreshing) {
        // Mark that we're leaving the Process page
        sessionStorage.setItem("leavingProcessPage", "true");
      }
    };

    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("unload", handleUnload);

      // This runs when the component unmounts (when leaving the page)
      if (
        sessionStorage.getItem("leavingProcessPage") === "true" &&
        sessionStorage.getItem("isRefreshing") !== "true"
      ) {
        // Only clear if we're not refreshing - using the new function
        // that clears both localStorage and contexts
        clearAllData();
        sessionStorage.removeItem("leavingProcessPage");
      }
    };
  }, []);

  // If showing error page, display only that
  if (showErrorPage) {
    return (
      <div className="errorcontainer" style={{ height: "100vh" }}>
        <ErrorPage
          secondsLeft={redirectCounter}
          navigateToHome={navigateToHome}
        />
      </div>
    );
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {quiztoggle === "enabled" && (
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

          {/* PDF Generation Button Section */}
          {pdfdata && !quizclicked && (
            <div style={{ marginTop: "10px" }}>
              {isPdfReady ? (
                <PDFDownloadLink
                  document={<MyDocument data={pdfdata} />}
                  fileName="ai-generated-notes.pdf"
                  style={{
                    textDecoration: "none",
                    padding: "10px 20px",
                    color: "white",
                    backgroundColor: "#4CAF50",
                    borderRadius: "5px",
                    display: "inline-block",
                  }}
                >
                  {({ blob, url, loading, error }) =>
                    loading ? "Preparing PDF..." : "Download PDF"
                  }
                </PDFDownloadLink>
              ) : (
                <button
                  className="btn"
                  onClick={handleGeneratePDF}
                  style={{ backgroundColor: "#4CAF50" }}
                >
                  Generate PDF
                </button>
              )}
            </div>
          )}
        </div>
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
          padding: "20px",
          borderRadius: "15px",
          marginRight: "15px",
        }}
      >
        <div
          className="top"
          style={{
            order: 1,
            backgroundColor: "white",
            opacity:"1",
            padding: "20px",
            border: "5px black",
            borderRadius: "5px black",
            maxHeight: "650px",
            minWidth: "708px",
            minHeight: "650px",
            paddingTop:"25px"
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
      
          {/* PDF Error Message Modal */}
          {pdfError && (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                zIndex: 1000,
                maxWidth: "300px",
                textAlign: "center",
              }}
            >
              <h3 style={{ color: "red", marginBottom: "15px" }}>Error</h3>
              <p>{pdfError}</p>
              <button
                onClick={dismissError}
                style={{
                  marginTop: "15px",
                  padding: "10px 20px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          )}
        
      </div>
    </div>
  );
}

export default Process;
