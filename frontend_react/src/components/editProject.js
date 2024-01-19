// Importing necessary dependencies
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import AuthUser from './AuthUser';

// Component for editing a project
const EditProject = () => {
  // Destructuring properties from AuthUser hook
  const { getToken, http } = AuthUser();
  
  // Getting the authentication token, navigation function, and project ID from URL parameters
  const token = getToken();
  const navigate = useNavigate();
  const { projectId } = useParams();

  // State to manage form data and errors
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    status: 'Pending',
  });

  const [errors, setErrors] = useState({
    name: '',
    start_date: '',
    end_date: '',
  });

  // Fetch project details for editing on component mount
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await http.get(`/projects/${projectId}`);
        const projectData = response.data.project || {};
        setFormData(projectData);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjectDetails();
  }, []);

  // Handling form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: e.target.value ? '' : `Please enter a ${e.target.name}.`,
    });
  };

  // Handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    let hasErrors = false;
    const errorFields = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        hasErrors = true;
        errorFields[key] = `Please enter a ${key}.`;
      }
    });

    if (hasErrors) {
      setErrors({ ...errorFields });
      return;
    }

    // Check if the start date is before today
    const startDate = new Date(formData.start_date);

    // Check if the end date is before the start date
    const endDate = new Date(formData.end_date);
    if (endDate < startDate) {
      setErrors({
        ...errors,
        end_date: 'End date should not be before the start date.',
      });
      return;
    }

    try {
      // Send a PUT request to update the project
      await http.put(`/projects/${projectId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Reset form errors
      setErrors({
        name: '',
        start_date: '',
        end_date: '',
      });

      // Redirect to the projects page after successfully editing a project
      navigate('/projects');
    } catch (error) {
      console.error('Error editing project:', error);
      // Handle error (show an error message, etc.)
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Edit Project</h1>

      <Form onSubmit={handleSubmit}>
        {/* Project Name */}
        <Form.Group controlId="formName">
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter project name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="mt-1 text-danger">{errors.name}</p>}
        </Form.Group>

        {/* Start Date */}
        <Form.Group controlId="formStartDate">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
          {errors.start_date && <p className="mt-1 text-danger">{errors.start_date}</p>}
        </Form.Group>

        {/* End Date */}
        <Form.Group controlId="formEndDate">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
          {errors.end_date && <p className="mt-1 text-danger">{errors.end_date}</p>}
        </Form.Group>

        {/* Status */}
        <Form.Group controlId="formStatus">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Form.Control>
        </Form.Group>

        {/* Submit Button */}
        <Button variant="success" className="m-2" type="submit">
          Submit
        </Button>

        {/* Return Button */}
        <Link to="/projects">
          <Button variant="secondary" className="m-2">
            Return
          </Button>
        </Link>
      </Form>
    </div>
  );
};

// Exporting the EditProject component
export default EditProject;
