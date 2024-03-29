import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthUser from "./AuthUser";
import { Card } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Dashboard() {
  const { getToken, http } = AuthUser();
  const token = getToken();
  const [statistics, setStatistics] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);
  const [favoriteProjects, setFavoriteProjects] = useState([]);
  const [quickAccessProjects, setQuickAccessProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      return <Navigate to="/login" />;
    }

    if (!apiCalled) {
      http
        .get("/project/statistics")
        .then((response) => {
          setStatistics(response.data);
          setFavoriteProjects(response.data.favorite);
          setQuickAccessProjects(response.data.quick);
          setApiCalled(true);
        })
        .catch((error) => {
          console.error("Error fetching project statistics:", error);
        });
    }
  }, [token, http, apiCalled]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    // Check if the item was dropped into the Quick Access area
    if (destination.droppableId === "quick-access") {
      const draggedProject = favoriteProjects.find(
        (project) => project.id.toString() === draggableId
        );
        if (draggedProject) {
          http
          .put(`/project/${draggedProject.id}/changeQuickAccess`)
          .then((response) => {
            if (!quickAccessProjects.some((project) => project.id === draggedProject.id)) {

            // just updated project list in frontend
            setQuickAccessProjects([...quickAccessProjects, draggedProject]);
            }
            // Fetch updated Quick Access projects from backend
            // http
            //   .get("/project/quickAccess")
            //   .then((response) => {
            //     setQuickAccessProjects(response.data.quick);
            //   })
            //   .catch((error) => {
            //     console.error("Error fetching quick access projects:", error);
            //     setQuickAccessProjects(
            //       quickAccessProjects.filter((project) => project.id !== draggedProject)
            //     );
            //   });
          })
          .catch((error) => {
            console.error("Error updating project status:", error);
          });
      }

      // Reorder the Quick Access projects within the frontend
      const reorderedProjects = Array.from(quickAccessProjects);
      const [movedProject] = reorderedProjects.splice(source.index, 1);
      reorderedProjects.splice(destination.index, 0, movedProject);
      // Update order property based on the new order
      const updatedProjects = reorderedProjects.map((project, index) => ({
        ...project,
        order: index + 1,
      }));
      setQuickAccessProjects(updatedProjects);
    }
  };

  const handleView = (projectId) => {
    navigate(`/projects/${projectId}/view`);
  };

  const handleRemove = (id) => {
    http
    .put(`/project/${id}/removeQuickAccess`)
    .then((response) => {
  // alert(response.data.message);
  const updatedProjects = quickAccessProjects.filter(project => project.id !== id);
    
    setQuickAccessProjects(updatedProjects);
    })
    .catch((error) => {
      console.error("Error updating project status:", error);
    });
  };

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
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="container mt-4">
        <h1 className="mb-4">Dashboard</h1>

        <div className="row">
          <div className="col-md-3 d-flex flex-column" id="quick-access">
            <div
              className="card flex-grow-1"
              style={{ backgroundColor: "rgb(171 195 239" }}
            >
              <div className="card-body">
                <h5 className="card-title">Quick Access</h5>
                <Droppable droppableId="quick-access">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {quickAccessProjects.map((project, index) => (
                        <Draggable
                          key={project.id}
                          draggableId={"q-" + (project.id?.toString() ?? "")}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <Card>
                                <Card.Body>
                                  <button
                                    className="close-button"
                                    onClick={() => handleRemove(project.id)}
                                    style={{position: "absolute",top: 0,right: 0,padding: "5px",backgroundColor: "transparent",border: "none",cursor: "pointer",color: "red", // Adjust color as needed
                                    }}
                                    >X</button>
                                  <Card.Title
                                    onClick={() => handleView(project.id)}
                                  >
                                    {project.name}
                                  </Card.Title>
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
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="row">
              {statistics && (
                <>
                  <div className="col-md-3 mb-4">
                    <div className="card bg-primary text-white h-100">
                      <div className="card-body">
                        <h5 className="card-title">Total Projects</h5>
                        <p className="card-text">{statistics.totalProjects}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 mb-4">
                    <div className="card bg-success text-white h-100">
                      <div className="card-body">
                        <h5 className="card-title">Completed</h5>
                        <p className="card-text">
                          {statistics.completedProjects}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 mb-4">
                    <div className="card bg-warning text-dark h-100">
                      <div className="card-body">
                        <h5 className="card-title">Ongoing</h5>
                        <p className="card-text">
                          {statistics.ongoingProjects}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-4">
                    <div className="card bg-danger text-dark h-100">
                      <div className="card-body">
                        <h5 className="card-title">Pending</h5>
                        <p className="card-text">
                          {statistics.pendingProjects}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {favoriteProjects.length > 0 && (
              <>
                <h2 className="mt-4">Favorite Projects</h2>
                <Droppable droppableId="favorite-projects">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="row"
                    >
                      {favoriteProjects.map((project, index) => (
                        <Draggable
                          key={project.id}
                          draggableId={project.id.toString()}
                          index={index}
                        >
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
                                  <Card.Text style={{ color: getStatusColor(project.status), fontWeight:'bolder' }}>
                                    {project.status}
                                  </Card.Text>
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
              </>
            )}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
