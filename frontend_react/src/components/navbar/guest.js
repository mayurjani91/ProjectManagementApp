// Importing necessary dependencies
import React from "react";
import { Routes, Route, Link, Navigate } from 'react-router-dom';

// Importing components
import Login from "../Login";
import Register from "../Register";
import AuthUser from "../AuthUser";

// Guest component for non-authenticated users
function Guest() {
  // Destructuring properties from AuthUser hook
  const { getToken } = AuthUser();
  
  // Checking if the user is logged in
  const isUserLoggedIn = getToken();

  return (
    <div className="App">
      <div>
        {/* Navigation bar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Project Management App
            </Link>
            {/* Navbar toggler for responsive design */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            {/* Navbar links */}
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul className="navbar-nav">
                {/* 
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
                */}
              </ul>
            </div>
          </div>
        </nav>

        {/* Main content container */}
        <div className="container">
          {/* Routing setup */}
          <Routes>
            {/* Redirect to dashboard if user is logged in, otherwise to login */}
            <Route path="/" element={isUserLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// Exporting the Guest component
export default Guest;
