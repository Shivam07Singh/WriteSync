import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      <div className="container">
        <h1>Distraction-free Markdown Editor</h1>
        <p>Create beautiful documents with Markdown</p>
        <div className="buttons">
          <Link to="/register" className="btn btn-primary">
            Sign Up
          </Link>
          <Link to="/login" className="btn btn-light">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
