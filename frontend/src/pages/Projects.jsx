import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";
import ProjectForm from "../components/ProjectForm";
import "../styles/projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(projects.filter(p => p._id !== id));
      } catch (err) {
        console.error("Failed to delete project:", err);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProject(null);
    fetchProjects();
  };

  if (loading) return <div className="loading">Loading Projects...</div>;

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projects</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
        >
          <FiPlus /> New Project
        </button>
      </div>

      {showForm && (
        <ProjectForm project={editingProject} onClose={handleFormClose} />
      )}

      <div className="projects-grid">
        {projects.length === 0 ? (
          <p className="no-data">No projects yet. Create one to get started!</p>
        ) : (
          projects.map(project => (
            <div key={project._id} className="project-card">
              <div className="project-header">
                <h3>{project.name}</h3>
                <div className="project-actions">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowForm(true);
                    }}
                    className="icon-btn"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="icon-btn delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-footer">
                <span className="members">
                  <FiUsers /> {project.members.length} members
                </span>
                <span className="status">{project.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
