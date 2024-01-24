import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthUser from './AuthUser';
import { Table, Pagination, FormControl, Button } from 'react-bootstrap';

export default function Projects() {
  const { getToken, http } = AuthUser();
  const token = getToken();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(null);

  // Function to fetch projects from the API
  const fetchProjects = async (page = 1, search = '') => {
    try {
      const response = await http.get(`/projects?page=${page}&search=${search}`);
      const projectsData = response.data.projects.data || [];
      setProjects(projectsData);
      setPagination(response.data.projects);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    // Redirect to login if no token is available
    if (!token) {
      navigate('/login');
    } else {
      fetchProjects();
    }
  }, []);

  // Function to handle pagination
  const handlePagination = (page) => {
    fetchProjects(page, searchTerm);
  };

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
        fetchProjects(currentPage, searchTerm);
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        // Handle error (show an error message, etc.)
      }
    }
  };

  // Function to handle searching
  const handleSearch = (e) => {
    // alert(e.target.value)
    setSearchTerm(e.target.value);
    fetchProjects(1, searchTerm);
  };

  return (
    <div className="container mt-4 table-responsive">
      <h1 className="mb-4">Projects</h1>

      <Link to="/addProject">
        <Button variant="success" className="m-1">
          Add Project
        </Button>
      </Link>

      {/* Search Filter */}
      <div className="mt-3 d-flex">
        <FormControl
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => handleSearch(e)}
        />
        {/* <Button variant="primary" className="ml-2" onClick={handleSearch}>
          Search
        </Button> */}
      </div>

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
          {projects.length === 0 ? (
            <tr>
              <td colSpan="6">No records found</td>
            </tr>
          ) : (
            projects.map((project, index) => (
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
      {pagination && (
        <Pagination>
          {Array.from({ length: pagination.last_page }).map((_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === pagination.current_page}
              onClick={() => handlePagination(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
}
