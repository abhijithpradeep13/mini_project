import React, { useEffect } from "react";
import Ytcardlilst from "../components/Ytcardlilst";
import { searchresultContext, LoadingstateContext } from "../dbstack/context";
import { useContext } from "react";
import Loading from "./Loading";

function Searchlist() {
  const { searchresult } = useContext(searchresultContext);
  const { isLoading } = useContext(LoadingstateContext);

  // Prevent scrolling when loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }
    return () => {
      document.body.style.overflow = "auto"; // Reset on unmount
    };
  }, [isLoading]);

  const embedder = (url) => {
    const videoIdRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(videoIdRegex);

    if (match) {
      const videoId = match[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            opacity: "0.5",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          //  backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: "2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loading />
        </div>
      )}
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent:"space-evenly",
          opacity: isLoading ? "0.5" : "1",
        }}
      >
        {searchresult.map((item, index) => (
          <li key={index}>
            <Ytcardlilst urlembedd={embedder(item.url)} url={item.url} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Searchlist;

