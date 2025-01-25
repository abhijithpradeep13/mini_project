import React from "react";
import Ytcard from "../components/ytcard";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import {
  SummaryresultContext,
  LangresultContext,
  LoadingstateContext,
  UrlContext,
} from "../dbstack/context";
import axios from "axios";
import "./Ytcardlist.css";

function Ytcardlilst({ urlembedd, url }) {
  const { yturl, setyturl } = useContext(UrlContext);
  const { summaryresult, setsummaryresult } = useContext(SummaryresultContext);
  const { lang, setlang } = useContext(LangresultContext);

  const { isLoading, setIsLoading } = useContext(LoadingstateContext);
  const navigate = useNavigate();

  const submithandler3 = async () => {
    try {
      setIsLoading(true); // Show loading state
      const response = await axios.post("http://127.0.0.1:5000/api/process", {
        url,
        lang,
      });
      setsummaryresult(response.data.translated_text); // Save translated text in context
      console.log(url, lang, response.data.translated_text);
      setyturl(urlembedd);
      navigate("/Process"); // Navigate to /Process after receiving response
    } catch (error) {
      console.error("Error during processing:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  return (
    <div class="notifications-container">
      <div class="success">
        <Ytcard videoId={urlembedd} />
        
            <div class="success-button-container">
              <button
                onClick={submithandler3}
                className="btn"
                disabled={isLoading}
              >
                Process
              </button>
            </div>
         
      </div>
    </div>

    /*
    <div
      className="card"
      style={{ borderRadius: "20px", backgroundColor: "white", margin: "5px" }}
    >
      <Ytcard videoId={urlembedd} />
      <div className="bottom">
        <center>
          <button onClick={submithandler3} className="btn" disabled={isLoading}>
            Process
          </button>
        </center>
      </div>
    </div>*/
  );
}

export default Ytcardlilst;
