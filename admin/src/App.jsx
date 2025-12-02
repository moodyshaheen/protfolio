import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubLink: '',
    videoLink: '',
    technologies: '',
    image: null
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Error fetching projects. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('githubLink', formData.githubLink);
    formDataToSend.append('videoLink', formData.videoLink);
    formDataToSend.append('technologies', JSON.stringify(
      formData.technologies.split(',').map(t => t.trim()).filter(t => t)
    ));
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const targetId = editingProject ? editingProject._id ?? editingProject.id : null;
      const url = editingProject && targetId
        ? `${API_URL}/projects/${targetId}`
        : `${API_URL}/projects`;
      
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      await fetchProjects();
      resetForm();
      alert(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      githubLink: project.githubLink || '',
      videoLink: project.videoLink || '',
      technologies: project.technologies ? project.technologies.join(', ') : '',
      image: null
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      await fetchProjects();
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      githubLink: '',
      videoLink: '',
      technologies: '',
      image: null
    });
    setEditingProject(null);
    setShowForm(false);
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Portfolio Admin Panel</h1>
        <button 
          className="add-project-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add New Project
        </button>
      </header>

      <div className="admin-content">
        {showForm && (
          <div className="form-section">
            <div className="form-card">
              <div className="form-header">
                <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                <button className="close-form-btn" onClick={resetForm}>×</button>
              </div>
              <form onSubmit={handleSubmit} className="project-form">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Project title"
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Project description"
                  />
                </div>

                <div className="form-group">
                  <label>GitHub Link</label>
                  <input
                    type="url"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div className="form-group">
                  <label>Video Link</label>
                  <input
                    type="url"
                    name="videoLink"
                    value={formData.videoLink}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div className="form-group">
                  <label>Technologies (comma separated)</label>
                  <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleInputChange}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>

                <div className="form-group">
                  <label>Project Image {!editingProject && '*'}</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    required={!editingProject}
                  />
                  {editingProject && editingProject.image && (
                    <div className="current-image">
                      <p>Current image:</p>
                      <img 
                        src={`http://localhost:3001${editingProject.image}`} 
                        alt="Current"
                        className="preview-image"
                      />
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </button>
                  <button type="button" onClick={resetForm} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="projects-list-section">
          <h2>Projects List ({projects.length})</h2>
          {loading ? (
            <div className="loading">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="no-projects">
              <p>No projects yet. Click "Add New Project" to get started!</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => {
                const projectId = project._id ?? project.id;
                return (
                <div key={projectId} className="project-card-admin">
                  <div className="project-image-admin">
                    {project.image ? (
                      <img 
                        src={`http://localhost:3001${project.image}`} 
                        alt={project.title}
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="project-info-admin">
                    <h3>{project.title}</h3>
                    <p className="project-desc-admin">
                      {project.description.length > 100 
                        ? `${project.description.substring(0, 100)}...` 
                        : project.description}
                    </p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="tech-tags-admin">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="tech-tag-admin">{tech}</span>
                        ))}
                      </div>
                    )}
                    <div className="project-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(project)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(projectId)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
