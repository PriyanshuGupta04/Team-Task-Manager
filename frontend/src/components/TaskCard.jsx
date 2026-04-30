import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FiEdit2, FiTrash2, FiCheckCircle } from "react-icons/fi";
import "../styles/taskcard.css";

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "done";

  const handleStatusChange = async () => {
    setLoading(true);
    try {
      const nextStatus =
        task.status === "todo"
          ? "in-progress"
          : task.status === "in-progress"
          ? "done"
          : "todo";
      
      await axios.put(
        `https://team-task-manager-production-6789.up.railway.app/api/tasks/${task._id}`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onStatusChange();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`task-card ${task.status} ${isOverdue ? "overdue" : ""}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-actions">
          <button onClick={onEdit} className="icon-btn" title="Edit">
            <FiEdit2 />
          </button>
          <button onClick={onDelete} className="icon-btn delete" title="Delete">
            <FiTrash2 />
          </button>
        </div>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        <span className={`priority ${task.priority}`}>{task.priority}</span>
        <span className={`status ${task.status}`}>{task.status}</span>
        {task.assignedTo && (
          <span className="assigned-to">👤 {task.assignedTo.name}</span>
        )}
      </div>

      <div className="task-footer">
        <span className={`due-date ${isOverdue ? "warning" : ""}`}>
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
        <button
          onClick={handleStatusChange}
          disabled={loading}
          className="status-btn"
          title="Change Status"
        >
          <FiCheckCircle />
        </button>
      </div>
    </div>
  );
}
