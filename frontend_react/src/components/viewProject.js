import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import AuthUser from './AuthUser';

const ViewProject = () => {
  const {http } = AuthUser();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await http.get(`/projects/${projectId}`);
        const projectData = response.data.project || {};
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjectDetails();
  }, []);

  if (!project) {
    return <div>Loading...</div>;
  }

  // Function to determine status color based on status value
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'red';
      case 'In Progress':
        return 'orange';
      case 'Completed':
        return 'green';
      default:
        return 'black';
    }
  };

  return (
    <div className="card container mt-4 text-center" style={{ background: '#a0cfc8', padding: '20px', borderRadius: '10px' }}>
      <div className="container">
        <h1 className="mb-4">Project Details</h1>

        <p><strong>Project Name:</strong> {project.name}</p>
        <p><strong>Start Date:</strong> {project.start_date}</p>
        <p><strong>End Date:</strong> {project.end_date}</p>
        <p><strong>Favorite:</strong> {project.stared}</p>
        <p><strong>Status:</strong> <span style={{ color: getStatusColor(project.status), fontWeight:'bolder' }}>{project.status}</span></p>

        <div className="mt-3">
          {/* Return Button */}
          <Link to="/projects">
            <Button variant="secondary" className="m-2">
              Go to Projects
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary" className="m-2">
              Go to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewProject;
