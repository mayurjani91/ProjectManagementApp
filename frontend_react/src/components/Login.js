// Importing necessary dependencies
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthUser from './AuthUser';

// Component for user login
export default function Login() {
  // Destructuring properties from AuthUser hook
  const { http, setToken } = AuthUser();

  // State to manage email, password, and error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Function to submit the login form
  const submitForm = () => {
    // Clear previous error messages
    setError("");

    // Make the API call
    http.post('/login', { email, password })
      .then((res) => {
        // Handle successful login
        setToken(res.data.user, res.data.access_token);
      })
      .catch((error) => {
        // Handle login failure
        if (error.response) {
          // The request was made, but the server responded with a status code outside the range of 2xx
          setError(error.response.data.error);
        } else if (error.request) {
          // The request was made, but no response was received
          setError("Network error. Please try again.");
        } else {
          // Something happened in setting up the request that triggered an Error
          setError("An unexpected error occurred.");
        }
      });
  }

  return (
    <div className="row justify-content-center pt-5">
      <div className="col-sm-6">
        <div className="card p-4">
          <h1 className="text-center mb-3">Login</h1>
          <div className="form-group">
            <label>Email address:</label>
            <input type="email" className="form-control" placeholder="Enter email"
              onChange={e => setEmail(e.target.value)}
              id="email" />
          </div>
          <div className="form-group mt-3">
            <label>Password:</label>
            <input type="password" className="form-control" placeholder="Enter password"
              onChange={e => setPassword(e.target.value)}
              id="pwd" />
          </div>
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}
          <button type="button" onClick={submitForm} className="btn btn-primary mt-4">Login</button>

          {/* Link to the registration page */}
          <p className="mt-3 text-center">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
