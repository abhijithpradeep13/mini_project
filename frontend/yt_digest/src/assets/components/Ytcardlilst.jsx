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
  const {
    summaryresult,
    setsummaryresult,
    settranscriptionresult,
    pdfdata,
    setpdfdata,
  } = useContext(SummaryresultContext);
  const { lang, setlang  } = useContext(LangresultContext);

  const { isLoading, setIsLoading, isInnerChecked, isChecked, setquiztoggle } =
    useContext(LoadingstateContext);
  const navigate = useNavigate();

  const submithandler3 = async (btn) => {
    try {
      setIsLoading(true); // Show loading state
      if (btn==1) {
         const response = await axios.post(
           "http://127.0.0.1:5000/api/process",
           {
             url,
             lang,
           }
         );
         setsummaryresult(response.data.translated_text); // Save translated text in context

         console.log(url, lang, response.data.translated_text);
      } if (btn == 2) {
         const response = await axios.post(
           "http://127.0.0.1:5000/api/notemaking",
           {
             url,
             lang,
           }
         );
        setsummaryresult(response.data.gentext);
        settranscriptionresult(response.data.transtext);
        console.log("ai text :", response.data.gentext);
        
         setquiztoggle(response.data.quiztoggle);

         console.log("quiztoggle ", response.data.quiztoggle);
        setpdfdata(response.data.pdfdata);
        
      }
     
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
    <div className="notifications-container">
      <Ytcard videoId={urlembedd} />

      <div className="success-button-container">
        {!isInnerChecked ? (
          <button
            onClick={() => submithandler3(1)}
            className="btn"
            disabled={isLoading}
            style={{ height: "40px", marginBottom: "10px", marginTop: "0px" }}
          >
            Summary
          </button>
        ) : (
          <button
            onClick={() => submithandler3(2)}
            className="btn"
            disabled={isLoading}
            style={{ height: "40px", marginBottom: "10px", marginTop: "0px" }}
          >
            AI-Notemaking
          </button>
        )}
      </div>
    </div>
  );
}

export default Ytcardlilst;
