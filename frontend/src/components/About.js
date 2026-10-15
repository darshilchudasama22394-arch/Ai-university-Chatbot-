import React from "react";

function About() {
  return (
    <section id="about" className="container py-5">
      <div className="row align-items-center g-5">

        <div className="col-lg-6">

          <h2 className="fw-bold mb-4">
            About PU PIET Dep.
          </h2>

          <p className="lead">
            PU PIET Dep. helps students find
            answers in four supplied academic booklets.
          </p>

          <p>
            It covers IMCA, BSc IT, and BCA Semester 1 for 2026–27, plus
            postgraduate Semester 2 for 2025–26. The assistant does not answer
            questions when the information is outside those booklets.
          </p>

        </div>

        <div className="col-lg-6 text-center">

          <div
            className="bg-white rounded-4 shadow p-5"
            style={{ maxWidth: "400px", margin: "auto" }}
          >
            <div style={{ fontSize: "72px", lineHeight: "1.1", marginBottom: "16px" }}>🤖</div>

            <h4 className="fw-bold">
              Booklet-based AI Assistant
            </h4>

            <p className="text-muted">
              Answers are grounded in the supplied academic booklets.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}

export default About;