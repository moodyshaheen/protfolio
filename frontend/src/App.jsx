import { useState, useEffect } from 'react';
import './App.css';
import { API_ENDPOINTS } from './config';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Fetch from API
      const response = await fetch(API_ENDPOINTS.projects);
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded projects:', data?.length || 0);
        setProjects(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch projects:', response.status);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const openProjectDetails = (project) => {
    setSelectedProject(project);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  return (
    <div className="portfolio-container">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <h1 className="main-title">My Portfolio</h1>
          <p className="subtitle">Showcasing my latest projects and work</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Welcome to My Portfolio</h2>
          <p>Explore my collection of projects and creative work</p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="container">
          <h2 className="section-title">My Projects</h2>
          {loading ? (
            <div className="loading">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="no-projects">No projects available yet.</div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => {
                const projectId = project._id ?? project.id;
                return (
                <div key={projectId} className="project-card">
                  <div className="project-image-container">
                    {project.image ? (
                      <img 
                        src={project.image.startsWith('http') ? project.image : `${API_ENDPOINTS.uploads}/${project.image.replace('/uploads/', '')}`}
                        alt={project.title}
                        className="project-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="project-image-placeholder">No Image</div>
                    )}
                  </div>
                  <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">
                      {project.description.length > 100 
                        ? `${project.description.substring(0, 100)}...` 
                        : project.description}
                    </p>
                    <div className="project-technologies">
                      {project.technologies && project.technologies.map((tech, index) => (
                        <span key={index} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                    <button 
                      className="view-details-btn"
                      onClick={() => openProjectDetails(project)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeProjectDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeProjectDetails}>×</button>
            <div className="modal-body">
              {selectedProject.image && (
                <img 
                  src={selectedProject.image.startsWith('http') ? selectedProject.image : `${API_ENDPOINTS.uploads}/${selectedProject.image.replace('/uploads/', '')}`}
                  alt={selectedProject.title}
                  className="modal-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                  }}
                />
              )}
              <h2 className="modal-title">{selectedProject.title}</h2>
              <p className="modal-description">{selectedProject.description}</p>
              {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                <div className="modal-technologies">
                  <strong>Technologies:</strong>
                  <div className="tech-tags">
                    {selectedProject.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="modal-links">
                {selectedProject.githubLink && (
                  <a 
                    href={selectedProject.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-btn github-btn"
                  >
                    View on GitHub
                  </a>
                )}
                {selectedProject.videoLink && (
                  <a 
                    href={selectedProject.videoLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-btn video-btn"
                  >
                    Watch Video
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 My Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
