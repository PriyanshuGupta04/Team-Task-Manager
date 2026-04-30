import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FiCheck, FiClock, FiAlertCircle, FiTrendingUp } from "react-icons/fi";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tasks = res.data;

      const completed = tasks.filter(t => t.status === "done").length;
      const inProgress = tasks.filter(t => t.status === "in-progress").length;
      const overdue = tasks.filter(
        t => new Date(t.dueDate) < new Date() && t.status !== "done"
      ).length;

      setStats({
        total: tasks.length,
        completed,
        inProgress,
        overdue
      });

      setRecentTasks(tasks.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <FiTrendingUp className="stat-icon" />
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card completed">
          <FiCheck className="stat-icon" />
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-number">{stats.completed}</p>
          </div>
        </div>

        <div className="stat-card in-progress">
          <FiClock className="stat-icon" />
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.inProgress}</p>
          </div>
        </div>

        <div className="stat-card overdue">
          <FiAlertCircle className="stat-icon" />
          <div className="stat-content">
            <h3>Overdue</h3>
            <p className="stat-number">{stats.overdue}</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent Tasks</h2>
        {recentTasks.length === 0 ? (
          <p className="no-data">No tasks yet. Start by creating a task!</p>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map(task => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>
                    <span className={`status ${task.status}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <span className={`priority ${task.priority}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
