import React from "react";
import heroImage from "../assets/image1.jpg"; 

function Home() {
  return (
    <div
      className="vh-100 d-flex align-items-center"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "#fff",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      ></div>

      <div className="container text-center position-relative z-1">
        <h1 className="display-4 fw-bold mb-3">
          Swap. Style. Sustain.
        </h1>
        <p className="lead mb-4">
          Explore unique fashion styles, swap your wardrobe, and contribute to a sustainable future.
        </p>
      </div>
    </div>
  );
}

export default Home;
