import React from 'react'
import { useContext,useEffect,useState } from "react";
import {  SummaryresultContext } from "../dbstack/context";
import "./summary.css"
import Loading from '../pages/Loading';



function Summary() {
  const { summaryresult } = useContext(SummaryresultContext);
   
  
  return <p className="scrollable typing-effect  ">{summaryresult} </p>;
}

export default Summary