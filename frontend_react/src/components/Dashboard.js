// Importing necessary dependencies
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthUser from './AuthUser';

export default function Dashboard() {
  // Destructuring properties from AuthUser hook
  const { getToken, http } = AuthUser();
  
  // Getting the authentication token
  const token = getToken();
  
  // State to hold project statistics and track if API has been called
  const [statistics, setStatistics] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);

  // Redirect to login if there is no token
  useEffect(() => {
    if (!token) {
      return <Navigate to="/login" />;
    }

    // Check if the API call has already been made
    if (!apiCalled) {
     
      http.get('/project/statistics')
        .then((response) => {
          setStatistics(response.data);
          setApiCalled(true); // Set the flag to true after the API call
        })
        .catch((error) => {
          // Handle error
          console.error('Error fetching project statistics:', error);
        });
    }
  }, [token, http, apiCalled]);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Dashboard</h1>

      {statistics && (
        <div className="row">
          {/* Displaying total projects */}
          <div className="col-md-4 mb-4">
            <div className="card bg-primary text-white h-100">
              <div className="card-body">
                <h5 className="card-title">Total Projects</h5>
                <p className="card-text">{statistics.totalProjects}</p>
              </div>
            </div>
          </div>

          {/* Displaying completed projects */}
          <div className="col-md-4 mb-4">
            <div className="card bg-success text-white h-100">
              <div className="card-body">
                <h5 className="card-title">Completed Projects</h5>
                <p className="card-text">{statistics.completedProjects}</p>
              </div>
            </div>
          </div>

          {/* Displaying ongoing projects */}
          <div className="col-md-4 mb-4">
            <div className="card bg-warning text-dark h-100">
              <div className="card-body">
                <h5 className="card-title">Ongoing Projects</h5>
                <p className="card-text">{statistics.ongoingProjects}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
