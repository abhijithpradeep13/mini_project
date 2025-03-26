// import React from "react";
// import "./Home.css";
// import { useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useContext, useState } from "react";
// import {
//   UrlContext,
//   searchresultContext,
//   SummaryresultContext,
//   LangresultContext,
//   LoadingstateContext,
// } from "../dbstack/context";
// import axios from "axios";
// import Loading from "./Loading";

// function Home() {
//   const { yturl, setyturl } = useContext(UrlContext);
//   const { searchresult, setsearchresult } = useContext(searchresultContext);
//   const {
//     summaryresult,
//     setsummaryresult,
//     summarypath,
//     setsummarypath,
//     settranscriptionresult,
//   } = useContext(SummaryresultContext);
//   const { lang, setlang } = useContext(LangresultContext);

//   const {
//     isLoading,
//     setIsLoading,
//     isInnerChecked,
//     setIsInnerChecked,
//     isChecked,
//     setIsChecked,
//     quiztoggle,
//     setquiztoggle,
//   } = useContext(LoadingstateContext);

//   const handleToggle = () => {
//     setIsChecked((prevState) => !prevState);
//   };

//   const handleInnerToggle = () => {
//     setIsInnerChecked((prevState) => !prevState);
//   };

//   const navigate = useNavigate();

//   const urlRef = useRef(null);
//   const langRef1 = useRef(null);
//   const langRef2 = useRef(null);
//   const searchRef = useRef(null);

//   const options = [
//     "english",
//     "french",
//     "spanish",
//     "german",
//     "chinese",
//     "hindi",
//     "arabic",
//     "malayalam",
//   ];

//   const submithandler1 = async (btn) => {
//     const url = urlRef.current.value;
//     const lang = langRef1?.current?.value || "english";

//     console.log("URL:", url);
//     console.log("Language:", lang);

//     const videoIdRegex =
//       /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
//     const match = url.match(videoIdRegex);

//     if (match) {
//       const videoId = match[1];

//       if (match) {
//         const videoId = match[1];
//         setyturl(`https://www.youtube.com/embed/${videoId}`); // Set YouTube embed URL

//         try {
//           setIsLoading(true); // Show loading state
//           if (btn === 1) {
//             if (url == undefined || lang == undefined) {
//               alert("Please enter a valid YouTube URL or LANGUAGE");
//             } else {
//               const response = await axios.post(
//                 "http://127.0.0.1:5000/api/process",
//                 {
//                   url,
//                   lang,
//                 }
//               );
//               setsummaryresult(response.data.translated_text); // Save translated text in context
//               setsummarypath(response.data.translated_path);
//               console.log("summarized text :", response.data.translated_text);
//               console.log("translated_path :", response.data.translated_path);
//             }
//           }
//           if (btn === 2) {
//             const response = await axios.post(
//               "http://127.0.0.1:5000/api/notemaking",
//               {
//                 url,
//                 lang,
//               }
//             );
//             setsummaryresult(response.data.gentext);
//             settranscriptionresult(response.data.transtext);
//             console.log("transtext ", response.data.transtext);

//             setquiztoggle(response.data.quiztoggle);

//             console.log("quiztoggle ", response.data.quiztoggle);

//           }

//           navigate("/Process"); // Navigate to /Process after receiving response
//         } catch (error) {
//           console.error("Error during processing:", error);
//           alert("An error occurred. Please try again.");
//         } finally {
//           setIsLoading(false); // Hide loading state
//         }
//       } else {
//         alert("Please enter a valid YouTube URL.");
//       }
//     }
//   };

//   const submithandler2 = async () => {
//     const search = searchRef.current.value; // Extract the value
//     const lang = langRef2?.current?.value; // Extract the value
//     if (lang != undefined) {
//      setlang(lang);
//     }
//     console.log("search:", search);
//     console.log("Language:", lang);
//     setIsLoading(true); // Show loading state

//     try {
//       setIsLoading(true); // Show loading state
//       const response = await axios.post("http://127.0.0.1:5000/api/search", {
//         search,
//       });
//       setsearchresult(response.data.videos);
//       console.log("api result : ", response.data.videos);
//       navigate("/search");
//     } catch (error) {
//       console.error("Error during processing:", error);
//       alert("An error occurred. Please try again.");
//     } finally {
//       setIsLoading(false); // Hide loading state
//     }
//   };

//   return (
//     <>
//       <div
//         className="right-section"
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           opacity: isLoading ? "0.5" : "1",
//           maxWidth: "100%",
//           paddingTop: "80px",
//         }}
//       >
//         <div className="form">
//           <div className="text-center">
//             <h6 style={{ height: "35px" }}>
//               <span
//                 className="url"
//                 style={{
//                   color: isChecked ? "white" : "crimson",
//                   padding: "10px",
//                   marginRight: "10px",
//                   transform: `scale(${isChecked ? 1 : 5})`,
//                   transition: "all 0.5s ease",
//                   fontSize: "20px",
//                 }}
//               >
//                 URL
//               </span>
//               <span
//                 className="search"
//                 style={{
//                   color: isChecked ? "crimson" : "white",
//                   marginLeft: "10px",
//                   transform: isChecked ? "scale(2)" : "scale(1)",
//                   transition: "all 0.5s ease",
//                   fontSize: "20px",
//                 }}
//               >
//                 SEARCH
//               </span>
//             </h6>
//             <input
//               type="checkbox"
//               className="checkbox"
//               id="reg-log"
//               checked={isChecked}
//               onChange={handleToggle}
//             />
//             <label htmlFor="reg-log"></label>

//             <div className="card-3d-wrap">
//               <div className="card-3d-wrapper">
//                 <h6
//                   style={{
//                     height: "50px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <span
//                     className="url"
//                     style={{
//                       color: isInnerChecked ? "white" : "crimson",
//                       padding: "10px",
//                       marginRight: "10px",
//                      // transform: `scale(${isInnerChecked ? 1 : 1.1})`,
//                       transform: isChecked ? "rotateY(180deg)" : "",
//                       transition: "all 0.5s ease",
//                       fontSize: "20px",
//                       zIndex: 999,
//                     }}
//                   >
//                     SUMMARY
//                   </span>
//                   <span
//                     className="search"
//                     style={{
//                       color: isInnerChecked ? "crimson" : "white",
//                       marginLeft: "10px",
//                       //transform: isInnerChecked ? "scale(1.1)" : "scale(1)",
//                       transform: isChecked ? "rotateY(180deg)" : "",
//                       transition: "all 0.5s ease",
//                       fontSize: "20px",
//                       zIndex: 999,
//                     }}
//                   >
//                     AI-NOTE
//                   </span>
//                 </h6>
//                 <input
//                   type="checkbox"
//                   className="checkboxbutton"
//                   id="checkboxbutton"
//                   checked={isInnerChecked}
//                   onChange={handleInnerToggle}
//                 />
//                 <label style={{ zIndex: 999 }} htmlFor="checkboxbutton"></label>

//                 <div className="card-front">
//                   <div className="center-wrap" style={{ paddingTop: "25px" }}>
//                     <h4 className="heading">YOUTUBE LINK</h4>

//                     <div className="form-group">
//                       <input
//                         type="text"
//                         className="form-style"
//                         placeholder="Enter Youtube URL"
//                         autoComplete="off"
//                         ref={urlRef}
//                         disabled={isLoading} // Disable input when loading
//                       />

//                       <span className="material-symbols-outlined input-icon material-icons">
//                         link
//                       </span>
//                     </div>
//                     {isInnerChecked ? (
//                       <div>
//                         <button
//                           onClick={() => submithandler1(2)}
//                           className="btn"
//                           disabled={isLoading}
//                         >
//                           AI-Notemaking
//                         </button>
//                       </div>
//                     ) : (
//                       <div>
//                         <div className="form-group">
//                           <input
//                             type="text"
//                             className="form-style"
//                             placeholder="Target Language"
//                             list="language-options"
//                             id="language"
//                             autoComplete="off"
//                             ref={langRef1}
//                             disabled={isLoading} // Disable input when loading
//                           />
//                           <span className="material-symbols-outlined input-icon material-icons">
//                             g_translate
//                           </span>
//                           <datalist id="language-options">
//                             {options.map((option, index) => (
//                               <option key={index} value={option} />
//                             ))}
//                           </datalist>
//                         </div>
//                         <button
//                           onClick={() => submithandler1(1)}
//                           className="btn"
//                           disabled={isLoading}
//                         >
//                           Process
//                         </button>
//                       </div>
//                     )}

//                     <div
//                       className="button-container"
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     ></div>
//                   </div>
//                 </div>

//                 <div className="card-back">
//                   <div className="center-wrap" style={{ paddingTop: "25px" }}>
//                     <h4 className="heading">SEARCH YOUTUBE</h4>
//                     <div className="form-group">
//                       <input
//                         type="text"
//                         className="form-style"
//                         placeholder="Search "
//                         autoComplete="off"
//                         ref={searchRef}
//                         disabled={isLoading} // Disable input when loading
//                       />
//                       <span className="material-symbols-outlined input-icon material-icons">
//                         youtube_searched_for
//                       </span>
//                     </div>
//                     {isChecked && isInnerChecked ? (
//                       <div>
//                         <button
//                           onClick={submithandler2}
//                           className="btn"
//                           disabled={isLoading}
//                         >
//                           Search
//                         </button>
//                       </div>
//                     ) : (
//                       <div>
//                         <div className="form-group">
//                           <input
//                             type="text"
//                             className="form-style"
//                             placeholder="Target Language"
//                             list="language-options"
//                             id="language"
//                             autoComplete="off"
//                             ref={langRef2}
//                             disabled={isLoading} // Disable input when loading
//                           />
//                           <span className="material-symbols-outlined input-icon material-icons">
//                             g_translate
//                           </span>
//                           <datalist id="language-options">
//                             {options.map((option, index) => (
//                               <option key={index} value={option} />
//                             ))}
//                           </datalist>
//                         </div>

//                         <button
//                           onClick={submithandler2}
//                           className="btn"
//                           disabled={isLoading}
//                         >
//                           Search
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {isLoading && <Loading />}
//     </>
//   );
// }

// export default Home;
