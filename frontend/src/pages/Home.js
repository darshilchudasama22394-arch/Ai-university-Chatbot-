import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import Features from "../components/Features";
import About from "../components/About";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      <Navbar />

      <div className="container text-center text-white py-5">

        <h1 className="display-3 fw-bold mt-5">
          AI University Helpdesk
        </h1>

        <p className="lead mt-4">
          Get instant answers to university-related questions using AI.
        </p>

        <div className="home-buttons mt-5">

          {/* GET STARTED */}
          <Link
            to="/register"
            className="home-action-btn"
          >
            Get Started
          </Link>

          {/* LOGIN */}
          <Link
            to="/login"
            className="home-action-btn"
          >
            Login
          </Link>

        </div>

      </div>

      <Features />

      <About />

    </div>
  );
}

export default Home;