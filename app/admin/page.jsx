"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../lib/config";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubLink: "",
    videoLink: "",
    technologies: "",
    image: null,
  });

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.projects);
      if (response.ok) {
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } else {
        alert("Failed to load projects");
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      alert("Error loading projects: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("githubLink", formData.githubLink || "");
      formDataToSend.append("videoLink", formData.videoLink || "");

      const technologies = formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      formDataToSend.append("technologies", JSON.stringify(technologies));

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      let response;
      if (editingProject) {
        response = await fetch(`${API_ENDPOINTS.projects}/${editingProject._id}`, {
          method: "PUT",
          body: formDataToSend,
        });
      } else {
        response = await fetch(API_ENDPOINTS.projects, {
          method: "POST",
          body: formDataToSend,
        });
      }

      if (response.ok) {
        alert(editingProject ? "Project updated successfully!" : "Project created successfully!");
        await loadProjects();
        resetForm();
      } else {
        const error = await response.json().catch(() => ({}));
        alert("Error: " + (error.error || "Failed to save project"));
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Error saving project: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    const techs = Array.isArray(project.technologies) ? project.technologies : [];
    setFormData({
      title: project.title,
      description: project.description,
      githubLink: project.githubLink || "",
      videoLink: project.videoLink || "",
      technologies: techs.join(", "),
      image: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (project) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.projects}/${project._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Project deleted successfully!");
        await loadProjects();
      } else {
        const error = await response.json().catch(() => ({}));
        alert("Error: " + (error.error || "Failed to delete project"));
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      githubLink: "",
      videoLink: "",
      technologies: "",
      image: null,
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify({ projects }, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `portfolio-projects-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-brand">
          <h1>Portfolio Admin Panel</h1>
          <p>Manage your portfolio projects</p>
        </div>
        <button className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </header>

      <div className="admin-actions">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✖ Cancel" : "➕ Add New Project"}
        </button>
        <button className="btn btn-secondary" onClick={exportToJSON} disabled={projects.length === 0}>
          📥 Export JSON
        </button>
        <button className="btn btn-secondary" onClick={loadProjects}>
          🔄 Refresh
        </button>
        <div className="project-count">
          Total Projects: <strong>{projects.length}</strong>
        </div>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editingProject ? "Edit Project" : "Add New Project"}</h2>
          <form onSubmit={handleSubmit} className="project-form">
            <div className="form-group">
              <label>Project Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter project title"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="5"
                placeholder="Enter project description"
              />
            </div>

            <div className="form-group">
              <label>GitHub Link</label>
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="form-group">
              <label>Video Link</label>
              <input
                type="url"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleInputChange}
                placeholder="https://youtube.com/..."
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
              <label>Project Image</label>
              <input type="file" name="image" onChange={handleInputChange} accept="image/*" />
              {editingProject?.image && (
                <div className="current-image">
                  <small>Current image: {editingProject.image}</small>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success" disabled={saving}>
                {saving ? "⏳ Saving..." : editingProject ? "💾 Update Project" : "➕ Add Project"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={saving}>
                ✖ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="projects-list">
        <h2>Your Projects</h2>

        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="no-projects">
            <p>No projects yet. Add your first project!</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project._id ?? project.id} className="project-item">
                <div className="project-image">
                  {project.image ? (
                    <img
                      src={
                        project.image.startsWith("http")
                          ? project.image
                          : `${API_ENDPOINTS.uploads}/${project.image.replace("/uploads/", "")}`
                      }
                      alt={project.title}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p className="project-desc">
                    {project.description.length > 100
                      ? `${project.description.substring(0, 100)}...`
                      : project.description}
                  </p>
                  <div className="project-techs">
                    {(Array.isArray(project.technologies) ? project.technologies : []).map((tech, index) => (
                      <span key={index} className="tech-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="project-links">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="link-badge">
                        🔗 GitHub
                      </a>
                    )}
                    {project.videoLink && (
                      <a href={project.videoLink} target="_blank" rel="noopener noreferrer" className="link-badge">
                        🎥 Video
                      </a>
                    )}
                  </div>
                  <div className="project-actions">
                    <button className="btn btn-small btn-edit" onClick={() => handleEdit(project)}>
                      ✏️ Edit
                    </button>
                    <button className="btn btn-small btn-delete" onClick={() => handleDelete(project)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="admin-footer">
        <p>Portfolio Admin Panel - Manage your projects easily</p>
      </footer>
    </div>
  );
}

