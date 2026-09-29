function About() {
  return (
    <section id="about" className="container py-5">
      <div className="row align-items-center">

        <div className="col-lg-6 text-white">

          <h2 className="fw-bold mb-4">
            About AI University Helpdesk
          </h2>

          <p className="lead">
            AI University Helpdesk is a smart web application that helps
            students get instant answers to university-related questions.
          </p>

          <p>
            Students can ask questions about admissions, courses,
            examinations, fees, hostel facilities, notices, and much more.
            The chatbot provides quick and accurate responses, reducing the
            need to visit administrative offices.
          </p>

        </div>

        <div className="col-lg-6 text-center">

          <div
            className="bg-white rounded-4 shadow p-5"
            style={{ maxWidth: "400px", margin: "auto" }}
          >
            <h1 style={{ fontSize: "80px" }}>🤖</h1>

            <h4 className="fw-bold">
              24/7 AI Assistant
            </h4>

            <p className="text-muted">
              Always available to help students.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}

export default About;