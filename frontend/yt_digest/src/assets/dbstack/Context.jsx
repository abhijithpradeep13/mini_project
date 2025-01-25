import React, { createContext, useState } from "react";

export const UrlContext = createContext();
export const searchresultContext = createContext();
export const SummaryresultContext = createContext();
export const LangresultContext = createContext();
export const LoadingstateContext = createContext();

export const Context = ({ children }) => {
    const [yturl, setyturl] = useState("");

    return (
      <UrlContext.Provider value={{ yturl, setyturl }}>
        {children}
      </UrlContext.Provider>
    );
};
  
export const  SearchContext = ({ children }) => {
  const [searchresult, setsearchresult] = useState([]);

  return (
    <searchresultContext.Provider value={{ searchresult, setsearchresult }}>
      {children}
    </searchresultContext.Provider>
  );
};

export const SummaryContext = ({ children }) => {
  const [summaryresult, setsummaryresult] = useState(null);

  return (
    <SummaryresultContext.Provider value={{ summaryresult, setsummaryresult }}>
      {children}
    </SummaryresultContext.Provider>
  );
};

export const LangContext = ({ children }) => {
  const [lang, setlang] = useState("");

  return (
    <LangresultContext.Provider value={{ lang, setlang }}>
      {children}
    </LangresultContext.Provider>
  );
};
  

export const LoadingContext = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingstateContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingstateContext.Provider>
  );
};