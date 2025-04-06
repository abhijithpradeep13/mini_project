import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./assets/pages/Home";
import Process from "./assets/pages/Process";
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