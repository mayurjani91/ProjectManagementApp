// Importing necessary dependencies
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthUser from './AuthUser';

// Component for user registration
export default function Register() {
  // Getting the navigation function and HTTP client from AuthUser hook
  const navigate = useNavigate();
  const { http } = AuthUser();

  // State to manage user registration data and error messages
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Function to handle form submission for user registration
  const submitForm = () => {
    // Clear previous error messages
    setError("");

    // Make the API call for registration
    http.post('/register', { name, email, password })
      .then((res) => {
        // Log the entire response object for debugging
        console.log(res);

        // Assuming the response is a string, you might need to parse it to JSON
        try {
          const responseData = JSON.parse(res.data);
          alert(responseData);
        } catch (error) {
          console.error("Error parsing response:", error);
        }

        // Redirect to the login page after successful registration
        navigate('/login');
      })
      .catch((error) => {
        // Handle registration failure
        if (error.response) {
          setError(error.response.data.error);
        } else if (error.request) {
          setError("Network error. Please try again.");
        } else {
          setError("An unexpected error occurred.");
        }
      });
  }

  return (
    <div className="row justify-content-center pt-5">
      <div className="col-sm-6">
        <div className="card p-4">
          <h1 className="text-center mb-3">Register</h1>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              onChange={e => setName(e.target.value)}
              id="name"
            />
          </div>
          <div className="form-group mt-3">
            <label>Email address:</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={e => setEmail(e.target.value)}
              id="email"
            />
          </div>
          <div className="form-group mt-3">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={e => setPassword(e.target.value)}
              id="pwd"
            />
          </div>
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}
          <button
            type="button"
            onClick={submitForm}
            className="btn btn-primary mt-4"
          >
            Register
          </button>

          {/* Link to the login page */}
          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
