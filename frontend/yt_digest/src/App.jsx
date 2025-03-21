// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import Home from "./assets/pages/home"
// import Process from "./assets/pages/process";

// import { createBrowserRouter,RouterProvider } from 'react-router-dom'
// import Searchlist from "./assets/pages/Searchlist";
// function App() {

//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <Home/>,
//     },

//     {
//       path: "/process",
//       element: <Process />,
//     },

//     {
//       path: "/search",
//       element: <Searchlist />,
//     },
//   ]);


//   return (
//     <>
//       <RouterProvider router={router}/>
//     </>
//   );
// }

// export default App;


import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./assets/pages/home";
import Process from "./assets/pages/process";
import Searchlist from "./assets/pages/Searchlist";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/process",
      element: <Process />,
    },
    {
      path: "/search",
      element: <Searchlist />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;