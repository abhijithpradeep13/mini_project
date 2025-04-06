import React, { useRef, useContext, useState,useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Hometext from "../components/hometext";
import {
  UrlContext,
  searchresultContext,
  SummaryresultContext,
  LangresultContext,
  LoadingstateContext,
} from "../dbstack/context";
import Loading from "./Loading";

function Home() {
  const { setyturl } = useContext(UrlContext);
  const { setsearchresult } = useContext(searchresultContext);
  const {
    setsummaryresult,
    setsummarypath,
    settranscriptionresult,
    pdfdata,
    setpdfdata,
  } = useContext(SummaryresultContext);
  const { setlang } = useContext(LangresultContext);
  const {
    isLoading,
    setIsLoading,
    isInnerChecked,
    setIsInnerChecked,
    isChecked,
    setIsChecked,
    setquiztoggle,
  } = useContext(LoadingstateContext);


  const textip = [
    "Enter a youtube link",
    "Or Search Youtube",
    "Get Smart Summary ",
    "Or notemaking with \nAI Notemaking",
  ];

  // State for error handling
  const [errorMessage, setErrorMessage] = useState("");

  const handleToggle = () => {
    setIsChecked((prevState) => !prevState);
  };

  const handleInnerToggle = () => {
    setIsInnerChecked((prevState) => !prevState);
  };



  const [showCardClass, setShowCardClass] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowCardClass(true);
    }, 590); 

    // Reset immediately when isChecked changes
    setShowCardClass(false);

    return () => clearTimeout(timeout);
  }, [isChecked]);

    
  const navigate = useNavigate();

  const urlRef = useRef(null);
  const langRef1 = useRef(null);
  const langRef2 = useRef(null);
  const searchRef = useRef(null);

  const options = [
    "english",
    "french",
    "spanish",
    "german",
    "chinese",
    "hindi",
    "arabic",
    "malayalam",
  ];

  // Validate YouTube URL
  const validateYouTubeURL = (url) => {
    const videoIdRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return videoIdRegex.test(url);
  };

  // Validate Language
  const validateLanguage = (language) => {
    return options.includes(language.toLowerCase());
  };

  const submithandler1 = async (btn) => {
    // Clear previous error message
    setErrorMessage("");

    const url = urlRef.current.value.trim();
    const lang = (langRef1?.current?.value || "english").trim().toLowerCase();

    // Validate URL
    if (!url) {
      setErrorMessage("Please enter a YouTube URL.");
      return;
    }

    if (!validateYouTubeURL(url)) {
      setErrorMessage(
        "Invalid YouTube URL. Please enter a valid YouTube link."
      );
      return;
    }

    // Validate Language (if not Summary/AI-Note mode)
    if (!isInnerChecked && !validateLanguage(lang)) {
      setErrorMessage(
        `Invalid language. Please choose from: ${options.join(", ")}.`
      );
      return;
    }

    const videoIdRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(videoIdRegex);

    if (match) {
      const videoId = match[1];
      setyturl(`https://www.youtube.com/embed/${videoId}`);

      try {
        setIsLoading(true);

        if (btn === 1) {
          // Translation mode
          const response = await axios.post(
            "http://127.0.0.1:5000/api/process",
            { url, lang }
          );
          setsummaryresult(response.data.translated_text);
          setsummarypath(response.data.translated_path);
        }

        if (btn === 2) {
          // AI-Notemaking mode
          const response = await axios.post(
            "http://127.0.0.1:5000/api/notemaking",
            { url, lang }
          );
          setsummaryresult(response.data.gentext);
          settranscriptionresult(response.data.transtext);
          setquiztoggle(response.data.quiztoggle);
          setpdfdata(response.data.pdfdata);
        }

        navigate("/Process");
      } catch (error) {
        console.error("Error during processing:", error);
        setErrorMessage(
          "An error occurred while processing the video. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const submithandler2 = async () => {
    // Clear previous error message
    setErrorMessage("");

    const search = searchRef.current.value.trim();
    const lang = (langRef2?.current?.value || "english").trim().toLowerCase();

    // Validate search input
    if (!search) {
      setErrorMessage("Please enter a search term.");
      return;
    }

    // Validate Language
    if (!validateLanguage(lang)) {
      setErrorMessage(
        `Invalid language. Please choose from: ${options.join(", ")}.`
      );
      return;
    }

    setlang(lang);

    try {
      setIsLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/api/search", {
        search,
      });
      setsearchresult(response.data.videos);
      navigate("/search");
    } catch (error) {
      console.error("Error during processing:", error);
      setErrorMessage("An error occurred while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-wrapper">
      <div
        style={{
          position: "absolute",
          color: "#dc143c",
          bottom: "-125px",
          right: "53%",
        }}
      >
        Ver 1.0
      </div>
      <div className="left-section">
        <img
          src="urllogo1.png"
          alt="logo"
          style={{ position: "absolute", left: "27px", top: "-70px" }}
        />
        <div style={{position:"absolute",top:"300px",left:"120px"}}>
          
          <Hometext texts={textip} interval={2000} speed={80} />
        </div>
      </div>
      <div className="divider"></div>
      <div
        className="right-section"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "100%",
          marginTop: "-18px",
        }}
      >
        {/* Rest of the existing component code remains the same */}
        <div className="form">
          <div className="text-center">
            <h6 style={{ height: "35px" }}>
              <span
                className="url"
                style={{
                  color: isChecked ? "white" : "crimson",
                  padding: "10px",
                  marginRight: "10px",
                  transform: `scale(${isChecked ? 1 : 5})`,
                  transition: "all 0.5s ease",
                  fontSize: "20px",
                }}
              >
                URL
              </span>
              <span
                className="search"
                style={{
                  color: isChecked ? "crimson" : "white",
                  marginLeft: "8px",
                  paddingRight: "14px",
                  transform: isChecked ? "scale(2)" : "scale(1)",
                  transition: "all 0.5s ease",
                  fontSize: "20px",
                }}
              >
                SEARCH
              </span>
            </h6>
            <input
              type="checkbox"
              className="checkbox"
              id="reg-log"
              checked={isChecked}
              onChange={handleToggle}
            />
            <label htmlFor="reg-log"></label>

            <div className={`card-3d-wrap ${showCardClass ? "card" : ""}`}>
              <div className="card-3d-wrapper ">
                <h6
                  style={{
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    className="url"
                    style={{
                      color: isInnerChecked ? "white" : "crimson",
                      padding: "10px",
                      marginRight: "10px",
                      // transform: `scale(${isInnerChecked ? 1 : 1.1})`,
                      transform: isChecked ? "rotateY(180deg)" : "",
                      transition: "all 0.5s ease",
                      fontSize: "20px",
                      zIndex: 999,
                    }}
                  >
                    SUMMARY
                  </span>
                  <span
                    className="search"
                    style={{
                      color: isInnerChecked ? "crimson" : "white",
                      marginLeft: "10px",
                      //transform: isInnerChecked ? "scale(1.1)" : "scale(1)",
                      transform: isChecked ? "rotateY(180deg)" : "",
                      transition: "all 0.5s ease",
                      fontSize: "20px",
                      zIndex: 999,
                    }}
                  >
                    AI-NOTE
                  </span>
                </h6>
                <input
                  type="checkbox"
                  className="checkboxbutton"
                  id="checkboxbutton"
                  checked={isInnerChecked}
                  onChange={handleInnerToggle}
                />
                <label style={{ zIndex: 999 }} htmlFor="checkboxbutton"></label>

                <div className="card-front">
                  <div className="center-wrap" style={{ paddingTop: "25px" }}>
                    <h4 className="heading">YOUTUBE LINK</h4>

                    <div className="form-group">
                      <input
                        type="text"
                        className="form-style"
                        placeholder="Enter Youtube URL"
                        autoComplete="off"
                        ref={urlRef}
                        disabled={isLoading} // Disable input when loading
                      />

                      <span className="material-symbols-outlined input-icon material-icons">
                        link
                      </span>
                    </div>
                    {isInnerChecked ? (
                      <div>
                        <button
                          onClick={() => submithandler1(2)}
                          className="btn"
                          disabled={isLoading}
                        >
                          AI-Notemaking
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-style"
                            placeholder="Target Language"
                            list="language-options"
                            id="language"
                            autoComplete="off"
                            ref={langRef1}
                            disabled={isLoading} // Disable input when loading
                          />
                          <span className="material-symbols-outlined input-icon material-icons">
                            g_translate
                          </span>
                          <datalist id="language-options">
                            {options.map((option, index) => (
                              <option key={index} value={option} />
                            ))}
                          </datalist>
                        </div>
                        <button
                          onClick={() => submithandler1(1)}
                          className="btn"
                          disabled={isLoading}
                        >
                          Summary
                        </button>
                      </div>
                    )}

                    <div
                      className="button-container"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="card-back">
                  <div className="center-wrap" style={{ paddingTop: "25px" }}>
                    <h4 className="heading">SEARCH YOUTUBE</h4>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-style"
                        placeholder="Search "
                        autoComplete="off"
                        ref={searchRef}
                        disabled={isLoading} // Disable input when loading
                      />
                      <span className="material-symbols-outlined input-icon material-icons">
                        youtube_searched_for
                      </span>
                    </div>
                    {isChecked && isInnerChecked ? (
                      <div>
                        <button
                          onClick={submithandler2}
                          className="btn"
                          disabled={isLoading}
                        >
                          Search
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-style"
                            placeholder="Target Language"
                            list="language-options"
                            id="language"
                            autoComplete="off"
                            ref={langRef2}
                            disabled={isLoading} // Disable input when loading
                          />
                          <span className="material-symbols-outlined input-icon material-icons">
                            g_translate
                          </span>
                          <datalist id="language-options">
                            {options.map((option, index) => (
                              <option key={index} value={option} />
                            ))}
                          </datalist>
                        </div>

                        <button
                          onClick={submithandler2}
                          className="btn"
                          disabled={isLoading}
                        >
                          Search
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Error Message Modal */}
        {errorMessage && (
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
            <p>{errorMessage}</p>
            <button
              onClick={() => setErrorMessage("")}
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
      {isLoading && <Loading />}
    </div>
  );
}

export default Home;