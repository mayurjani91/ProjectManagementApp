import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthUser from './AuthUser';
import { Table, Pagination, FormControl, Button } from 'react-bootstrap';

export default function Projects() {
  const { getToken, http } = AuthUser();
  const token = getToken();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to fetch projects from the API
  const fetchProjects = async () => {
    try {
      const response = await http.get('/projects');
      const projectsData = response.data.projects || [];
      setProjects(projectsData);
      // Set filteredProjects initially to all projects
      setFilteredProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    // Redirect to login if no token is available
    if (!token) {
      return <Navigate to="/login" />;
    }
    fetchProjects();
  }, []);

  // Filter projects based on search term
  useEffect(() => {
    // Set currentPage to 1 whenever the search term changes
    setCurrentPage(1);

    // Filter projects when the search term or projects array changes
    const filtered = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  // Function to handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle editing a project
  const handleEdit = (projectId) => {
    // Redirect to the EditProject component with the project ID
    navigate(`/projects/${projectId}/edit`);
  };

  // Function to handle deleting a project
  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project?');

    if (confirmDelete) {
      try {
        // Delete the project using the API
        await http.delete(`/projects/${projectId}`);
        // Refetch projects after deletion
        fetchProjects();
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        // Handle error (show an error message, etc.)
      }
    }
  };

  // Calculate indices for pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;

  // Only display projects for the current page
  const currentProjects = Array.isArray(filteredProjects)
    ? filteredProjects.slice(indexOfFirstProject, indexOfLastProject)
    : [];

    return (
      <div className="container mt-4 table-responsive">
        <h1 className="mb-4">Projects</h1>
    
        <Link to="/addProject">
          <Button variant="success" className="m-1">
            Add Project
          </Button>
        </Link>
    
        {/* Search Filter */}
        <FormControl
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-3"
        />
    
        {/* Project Table */}
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>S. No</th>
              <th>Project Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.length === 0 ? (
              <tr>
                <td colSpan="6">No records found</td>
              </tr>
            ) : (
              currentProjects.map((project, index) => (
                <tr key={index}>
                  <td>{index + 1 + (currentPage - 1) * projectsPerPage}</td>
                  <td>{project.name}</td>
                  <td>{project.start_date}</td>
                  <td>{project.end_date}</td>
                  <td>{project.status}</td>
                  <td>
                    <Button variant="info" size="sm" className="m-1" onClick={() => handleEdit(project.id)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
    
        {/* Pagination */}
        <Pagination>
          {Array.from({ length: Math.ceil((filteredProjects || []).length / projectsPerPage) }).map((_, i) => (
            <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    );
    
}
