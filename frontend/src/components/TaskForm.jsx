import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FiX } from "react-icons/fi";
import "../styles/forms.css";

export default function TaskForm({ task, onClose }) {
  const API = "https://team-task-manager-production-6789.up.railway.app";

  const [formData, setFormData] = useState(
    task || {
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      dueDate: "",
      projectId: "",
      assignedTo: ""
    }
  );
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);

      const allMembers = new Set();
      res.data.forEach(p => {
        p.members?.forEach(m => allMembers.add(JSON.stringify(m)));
      });
      setUsers(Array.from(allMembers).map(m => JSON.parse(m)));

    } catch (err) {
      setError("Failed to fetch projects");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        assignedTo: formData.assignedTo || undefined,
        projectId: formData.projectId || undefined
      };

      if (task?._id) {
        await axios.put(
          `${API}/api/tasks/${task._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API}/api/tasks`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      onClose();

    } catch (err) {
      setError(err.response?.data?.error || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{task ? "Edit Task" : "Create New Task"}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Task Description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />

          <select
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
          >
            <option value="">Select Project (Optional)</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
          >
            <option value="">Assign To (Optional)</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <input
            type="date"
            name="dueDate"
            value={formData.dueDate?.split("T")[0]}
            onChange={handleChange}
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Task"}
          </button>
        </form>
      </div>
    </div>
  );
}