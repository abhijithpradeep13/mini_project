
import React, { createContext, useState } from "react";

export const UrlContext = createContext();
export const searchresultContext = createContext();
export const SummaryresultContext = createContext();
export const LangresultContext = createContext();
export const LoadingstateContext = createContext();

export const AppProvider = ({ children }) => {
  const [yturl, setyturl] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  const [summaryresult, setsummaryresult] = useState("");
   const [transcriptionresult, settranscriptionresult] = useState("");
  const [summarypath, setsummarypath] = useState(null);
  const [lang, setlang] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInnerChecked, setIsInnerChecked] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [quiztoggle, setquiztoggle] = useState("");
  const [pdfdata, setpdfdata] = useState(null);

  return (
    <UrlContext.Provider value={{ yturl, setyturl }}>
      <searchresultContext.Provider value={{ searchresult, setsearchresult }}>
        <SummaryresultContext.Provider
          value={{
            summaryresult,
            setsummaryresult,
            summarypath,
            setsummarypath,
            transcriptionresult,
            settranscriptionresult,
            pdfdata,
            setpdfdata,
          }}
        >
          <LangresultContext.Provider value={{ lang, setlang }}>
            <LoadingstateContext.Provider
              value={{
                isLoading,
                setIsLoading,
                isInnerChecked,
                setIsInnerChecked,
                isChecked,
                setIsChecked,
                quiztoggle,
                setquiztoggle,
              }}
            >
              {children}
            </LoadingstateContext.Provider>
          </LangresultContext.Provider>
        </SummaryresultContext.Provider>
      </searchresultContext.Provider>
    </UrlContext.Provider>
  );
};