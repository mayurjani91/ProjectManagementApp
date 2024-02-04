import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthUser from './AuthUser';
import { Card } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Dashboard() {
  const { getToken, http } = AuthUser();
  const token = getToken();
  const [statistics, setStatistics] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);
  const [favoriteProjects, setFavoriteProjects] = useState([]);
  const [quickAccessProjects, setQuickAccessProjects] = useState([]);

  useEffect(() => {
    if (!token) {
      return <Navigate to="/login" />;
    }

    if (!apiCalled) {
      http.get('/project/statistics')
        .then((response) => {
          setStatistics(response.data);
          setApiCalled(true);
        })
        .catch((error) => {
          console.error('Error fetching project statistics:', error);
        });

      http.get('/project/myFavorites')
        .then((response) => {
          setFavoriteProjects(response.data.favorite);
        })
        .catch((error) => {
          console.error('Error fetching favorite projects:', error);
        });

      http.get('/project/quickAccess')
        .then((response) => {
          setQuickAccessProjects(response.data);
        })
        .catch((error) => {
          console.error('Error fetching quick access projects:', error);
        });
    }
  }, [token, http, apiCalled]);

  const handleDragEnd = (result) => {
    
    const { destination, draggableId } = result;
    alert(JSON.stringify(result));
    if (!destination) return; // Item was dragged outside of droppable area
  
    // Check if the item was dropped into the Quick Access area
    if (destination.droppableId === 'quick-access') {

      const draggedProject = favoriteProjects.find(project => project.id.toString() === draggableId);
      if (draggedProject) {
        // Make API call to update project status
        http.put(`/project/${draggedProject.id}`, { status: 'quick-access' }) // Assuming the API endpoint and payload structure
          .then((response) => {
            // Handle successful response
            console.log('Project status updated:', response.data);
            // Update the project status in the state or re-fetch favorite projects
            // For demonstration, let's assume re-fetching favorite projects and quick access projects
            http.get('/project/myFavorites')
              .then((response) => {
                setFavoriteProjects(response.data.favorite);
              })
              .catch((error) => {
                console.error('Error fetching favorite projects:', error);
              });

            http.get('/project/quickAccess')
              .then((response) => {
                setQuickAccessProjects(response.data);
              })
              .catch((error) => {
                console.error('Error fetching quick access projects:', error);
              });
          })
          .catch((error) => {
            console.error('Error updating project status:', error);
          });
      }
    }
  };
  
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Dashboard</h1>

      <div className="row">
        <div className="col-md-3 d-flex flex-column">
          {/* Side section content */}
          <div className="card flex-grow-1" style={{ backgroundColor: 'rgb(171 195 239'}} >
            <div className="card-body">
              <h5 className="card-title">Quick Access</h5>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="quick-access">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {quickAccessProjects.map((project, index) => (
                        <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <Card>
                                <Card.Body>
                                  <Card.Title>{project.name}</Card.Title>
                                  <Card.Text>Status: {project.status}</Card.Text>
                                  {/* Add more details or buttons here */}
                                </Card.Body>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="row">
            {statistics && (
              <>
                <div className="col-md-4 mb-4">
                  <div className="card bg-primary text-white h-100">
                    <div className="card-body">
                      <h5 className="card-title">Total Projects</h5>
                      <p className="card-text">{statistics.totalProjects}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <div className="card bg-success text-white h-100">
                    <div className="card-body">
                      <h5 className="card-title">Completed Projects</h5>
                      <p className="card-text">{statistics.completedProjects}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <div className="card bg-warning text-dark h-100">
                    <div className="card-body">
                      <h5 className="card-title">Ongoing Projects</h5>
                      <p className="card-text">{statistics.ongoingProjects}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {favoriteProjects.length > 0 && (
            <>
              <h2 className="mt-4">Favorite Projects</h2>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="favorite-projects">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="row">
                      {favoriteProjects.map((project, index) => (
                        <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="col-md-4 mb-4"
                            >
                              <Card>
                                <Card.Body>
                                  <Card.Title>{project.name}</Card.Title>
                                  <Card.Text>Status: {project.status}</Card.Text>
                                  {/* Add more details or buttons here */}
                                </Card.Body>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
