// Importing necessary dependencies
import React from "react";
import { Routes, Route, Link, Navigate } from 'react-router-dom';

// Importing components
import Dashboard from "../Dashboard";
import Projects from "../Projects";
import AuthUser from "../AuthUser";
import AddProject from "../addProject";
import EditProject from "../editProject";
import ViewProject from "../viewProject";

// Main authentication component
function Auth() {
  // Destructuring properties from AuthUser hook
  const { getToken, logout } = AuthUser();
  
  // Checking if the user is logged in
  const isUserLoggedIn = getToken();

  // Function to handle user logout
  const logoutUser = () => {
    if (isUserLoggedIn) {
      logout();
    }
  }

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
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/projects">
                    Projects
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/'} onClick={logoutUser}>
                    Logout
                  </Link>
                </li>
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/addProject" element={<AddProject />} />
            <Route path="/projects/:projectId/edit" element={<EditProject />} />
            <Route path="/projects/:projectId/view" element={<ViewProject />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// Exporting the Auth component
export default Auth;
