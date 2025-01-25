import React from 'react'
import { useContext } from "react";
import {  SummaryresultContext } from "../dbstack/context";


function Summary() {
  const { summaryresult, setsummaryresult } = useContext(SummaryresultContext);
  
  return <div>{summaryresult}</div>;
}

export default Summary