import React from "react";

function Hero() {
  return (
    <div className="container text-center text-white py-5">

      <h1 className="display-3 fw-bold">
        AI University Helpdesk
      </h1>

      <p className="lead mt-4">
        Ask anything about your university and get instant answers with AI.
      </p>

      <div className="mt-5">

        <button className="btn btn-warning btn-lg me-3">
          Get Started
        </button>

        <button className="btn btn-outline-light btn-lg">
          Learn More
        </button>

      </div>

    </div>
  );
}

export default Hero;

