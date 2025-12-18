import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubLink: '',
    videoLink: '',
    technologies: '',
    image: null
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    try {
      const saved = localStorage.getItem('portfolio_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProjects(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      if (error.name === 'QuotaExceededError') {
        alert('⚠️ Storage is full! Please clear storage and import projects from JSON.');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = (newProjects) => {
    try {
      // Remove image data to save space (we'll keep only URLs)
      const compressedProjects = newProjects.map(project => {
        const { image, ...rest } = project;
        // Keep only first 50KB of image if it's base64
        if (image && image.startsWith('data:image')) {
          return {
            ...rest,
            image: image.length > 50000 ? image.substring(0, 50000) : image
          };
        }
        return project;
      });
      
      const jsonStr = JSON.stringify(compressedProjects);
      if (jsonStr.length > 5000000) { // 5MB limit
        throw new Error('Projects data too large! Please export and clear storage.');
      }
      
      localStorage.setItem('portfolio_projects', jsonStr);
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.message.includes('too large')) {
        throw new Error('Storage quota exceeded! Please export projects and clear storage.');
      }
      throw error;
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // Resize image if too large
      if (file.size > 500000) { // 500KB
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxWidth = 800;
            const maxHeight = 600;
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          };
          img.src = e.target.result;
        };
        reader.onerror = reject;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      }
    });
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
    setSaving(true);
    
    try {
      let imageData = editingProject?.image || '';
      
      if (formData.image) {
        imageData = await convertToBase64(formData.image);
      }
      
      const projectData = {
        id: editingProject?.id || Date.now().toString(),
        title: formData.title,
        description: formData.description,
        githubLink: formData.githubLink,
        videoLink: formData.videoLink,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
        image: imageData,
        createdAt: editingProject?.createdAt || new Date().toISOString()
      };

      let newProjects;
      
      if (editingProject) {
        newProjects = projects.map(p => 
          p.id === editingProject.id ? projectData : p
        );
      } else {
        newProjects = [...projects, projectData];
      }

      try {
        saveToLocalStorage(newProjects);
        setProjects(newProjects);
      resetForm();
      alert(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
      } catch (storageError) {
        // Auto-export if storage full
        const dataStr = JSON.stringify({ projects: newProjects }, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'portfolio_projects_backup.json');
        linkElement.click();
        
        alert('⚠️ Storage full! Projects exported as backup.\n\nPlease:\n1. Click "Clear Storage" button\n2. Import the backup file\n3. Try again');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project: ' + error.message);
    } finally {
      setSaving(false);
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
      const newProjects = projects.filter(p => p.id !== id);
      saveToLocalStorage(newProjects);
      setProjects(newProjects);
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project: ' + error.message);
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

  // Export projects as JSON file
  const exportProjects = () => {
    const dataStr = JSON.stringify({ projects }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportName = 'portfolio_projects.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
  };

  // Import projects from JSON file
  const importProjects = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.projects) {
          setProjects(data.projects);
          saveToLocalStorage(data.projects);
          alert(`✅ Imported ${data.projects.length} project(s) successfully!`);
        }
      } catch (error) {
        alert('Error importing file: Invalid JSON format');
      }
    };
    reader.readAsText(file);
  };

  // Deploy projects to Surge automatically - DIRECT METHOD (No Backend!)
  const deployToSurge = () => {
    if (projects.length === 0) {
      alert('No projects to deploy! Please add at least one project.');
      return;
    }

    if (!window.confirm(`Deploy ${projects.length} project(s) to falcon-portfolio.surge.sh?`)) {
      return;
    }

    // Step 1: Export JSON file
    const projectsData = JSON.stringify({ projects }, null, 2);
    const dataStr = 'data:application/json;charset=utf-8,'+ encodeURIComponent(projectsData);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataStr);
    linkElement.setAttribute('download', 'portfolio_projects.json');
    linkElement.click();
    
    // Step 2: Copy deploy command to clipboard
    const deployCommand = `Copy-Item "$env:USERPROFILE\\Downloads\\portfolio_projects.json" "C:\\Users\\falcon\\OneDrive\\Desktop\\protfilio\\frontend\\public\\projects.json" -Force; cd C:\\Users\\falcon\\OneDrive\\Desktop\\protfilio\\frontend; npm run build; surge dist falcon-portfolio.surge.sh`;
    
    navigator.clipboard.writeText(deployCommand).then(() => {
      alert(`✅ Projects exported!\n✅ Deploy command copied to clipboard!\n\nNow:\n1. Open PowerShell\n2. Paste and press Enter (Ctrl+V)\n3. Wait for deployment to complete!\n\nOr click "Quick Deploy" button below!`);
    }).catch(() => {
      // Fallback if clipboard doesn't work
      const commandText = `Copy-Item "$env:USERPROFILE\\Downloads\\portfolio_projects.json" "C:\\Users\\falcon\\OneDrive\\Desktop\\protfilio\\frontend\\public\\projects.json" -Force; cd C:\\Users\\falcon\\OneDrive\\Desktop\\protfilio\\frontend; npm run build; surge dist falcon-portfolio.surge.sh`;
      prompt('Copy this command and run it in PowerShell:', commandText);
    });
  };

  const clearStorage = () => {
    if (window.confirm('⚠️ Clear all local storage?\n\nThis will delete all projects from localStorage.\n\nMake sure you exported your projects first!')) {
      localStorage.removeItem('portfolio_projects');
      setProjects([]);
      alert('✅ Storage cleared! You can now import projects from JSON file.');
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Portfolio Admin Panel</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          className="add-project-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
            disabled={saving}
        >
          + Add New Project
        </button>
        </div>
      </header>

      {/* Storage Warning */}
      {projects.length > 0 && (
        <div style={{
          background: '#ff9800',
          color: 'white',
          padding: '10px 20px',
          margin: '10px 20px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>💡 Tip:</strong> You have {projects.length} project(s). Export them regularly to avoid storage issues!
          </div>
          <button 
            onClick={exportProjects}
            style={{
              background: 'white',
              color: '#ff9800',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Export Now
          </button>
        </div>
      )}

      {/* Export/Import Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '15px 20px',
        margin: '10px 20px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <strong>💾 Sync Projects:</strong> Export your projects to deploy them on the website
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={exportProjects}
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📤 Export JSON
          </button>
          <button 
            onClick={deployToSurge}
            style={{
              background: '#FF6B35',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🚀 Quick Deploy
          </button>
          <label style={{
            background: '#2196F3',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            📥 Import JSON
            <input 
              type="file" 
              accept=".json"
              onChange={importProjects}
              style={{ display: 'none' }}
            />
          </label>
          <button 
            onClick={clearStorage}
            style={{
              background: '#f44336',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            title="Clear localStorage if it's full"
          >
            🗑️ Clear Storage
          </button>
        </div>
      </div>

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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
                  />
                  <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                    Images will be automatically compressed to save storage space.
                  </small>
                  {editingProject && editingProject.image && (
                    <div className="current-image">
                      <p>Current image:</p>
                      <img 
                        src={editingProject.image} 
                        alt="Current"
                        className="preview-image"
                      />
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn" disabled={saving}>
                    {saving ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                  </button>
                  <button type="button" onClick={resetForm} className="cancel-btn" disabled={saving}>
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
                        src={project.image} 
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
                        disabled={saving}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(projectId)}
                        disabled={saving}
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
