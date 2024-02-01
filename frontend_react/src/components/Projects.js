import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthUser from './AuthUser';
import { Table, Pagination, FormControl, Button } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';


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
  
  const handleView = (projectId) => {
    // Redirect to the EditProject component with the project ID
    navigate(`/projects/${projectId}/view`);
  };
  
  // Function to handle deleting a project
  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project?');

    if (confirmDelete) {
      try {
        // Delete the project using the API
        await http.delete(`/projects/${projectId}`);
        // Refetch projects after deletion
        fetchProjects(1, searchTerm);
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        // Handle error (show an error message, etc.)
      }
    }
  };

  // Function to handle searching
  const handleSearch = (e) => {
    setSearchTerm(e);
    fetchProjects(1, e);
  };

  // Function to handle drag-and-drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedProjects = Array.from(projects);
    const [movedProject] = reorderedProjects.splice(result.source.index, 1);
    reorderedProjects.splice(result.destination.index, 0, movedProject);

    // Update order property based on the new order
    const updatedProjects = reorderedProjects.map((project, index) => ({
        ...project,
        order: index + 1 + (currentPage - 1) * projectsPerPage,
    }));

    setProjects(updatedProjects);

    // Extract the project IDs and their new order
    const orderUpdates = updatedProjects.map((project) => ({
        id: project.id,
        order: project.order,
    }));

    // Update the order on the server for all projects
    try {
        await http.put(`/project/update-orders`, { projects: orderUpdates });
    } catch (error) {
        console.error('Error updating project orders:', error);
    }
};

// Function to render the star icon based on the project's "stared" value
const renderStarIcon = (stared) => {
  if (stared === 'Yes') {
    return <FontAwesomeIcon icon={solidStar} />;
  } else {
    return <FontAwesomeIcon icon={emptyStar} />;
  }
};

const changeFavorite = async (id) => {
 
  try {
    
   const response =  await http.put(`/project/${id}/changeFavorite`);

    fetchProjects(currentPage, searchTerm);
  //  alert(response.data.message);
  } catch (error) {
    console.error('Error changing project status:', error);
    // Handle error (show an error message, etc.)
  }
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
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Project Table with Drag-and-Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="projects">
          {(provided) => (
            <Table striped bordered hover className="mt-3" ref={provided.innerRef} {...provided.droppableProps}>
              <thead>
                <tr>
                  <th>S. No</th>
                  <th>Project Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Favorite</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <td>{index + 1 + (currentPage - 1) * projectsPerPage}</td>
                        <td>{project.name}</td>
                        <td>{project.start_date}</td>
                        <td>{project.end_date}</td>
                        <td>{project.status}</td>
                        <td onClick={()=>changeFavorite(project.id)}>{renderStarIcon(project.stared)}</td>
                        <td>
                          <Button variant="info" size="sm" className="m-1" onClick={() => handleEdit(project.id)}>
                            Edit
                          </Button>
                          <Button variant="info" size="sm" className="m-1" onClick={() => handleView(project.id)}>
                            View
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
              </tbody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>

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
