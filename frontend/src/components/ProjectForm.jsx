import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FiX, FiPlus } from "react-icons/fi";
import "../styles/forms.css";

export default function ProjectForm({ project, onClose }) {
  const API = "https://team-task-manager-production-6789.up.railway.app";

  const [formData, setFormData] = useState(
    project || { name: "", description: "" }
  );
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [members, setMembers] = useState(project?.members || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) return;
    try {
      const res = await axios.post(
        `${API}/api/projects/${project._id}/members`,
        { email: newMemberEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembers(res.data.members);
      setNewMemberEmail("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add member");
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const res = await axios.delete(
        `${API}/api/projects/${project._id}/members/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembers(res.data.members);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove member");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (project?._id) {
        await axios.put(
          `${API}/api/projects/${project._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API}/api/projects`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{project ? "Edit Project" : "Create New Project"}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Project Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />

          {project && (
            <div className="members-section">
              <h3>Team Members</h3>
              <div className="current-members">
                {members.map(member => (
                  <div key={member._id} className="member-tag">
                    <span>{member.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member._id)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="add-member">
                <input
                  type="email"
                  placeholder="Add member by email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="btn-secondary"
                >
                  <FiPlus /> Add
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Project"}
          </button>
        </form>
      </div>
    </div>
  );
}