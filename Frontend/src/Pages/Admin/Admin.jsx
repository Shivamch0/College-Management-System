import React, { useEffect, useState } from "react";
import styles from "./Admin.module.css";
import { api } from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import { BarChart , Bar, PieChart, Pie, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, Cell, } from "recharts";
import toast from "react-hot-toast"

function Admin({ darkMode }) {
  const [status, setStatus] = useState({
    users: 0,
    events: 0,
    registrations: 0,
  });

  const [stats, setStats] = useState({
    eventsByMonth: [],
    roleData: [],
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStatus = async () => {
    try {
      const res = await api.get("/admin/status", { withCredentials: true });
      setStatus(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch dashboard status:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats", { withCredentials: true });
      setStats(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch analytics:", error);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      await Promise.all([fetchStatus(), fetchStats()]);
      setLoading(false);
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading dashboard...</h2>;
  }

  const handleUsers = () => {
    navigate("/admin/users");
  };

  const handleEvents = () => {
    navigate("/admin/events");
  };

  const handleRegisterations = () => {
    navigate("/admin/registerations");
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Admin Analytics Dashboard</h1>

      <div className={styles.cards}>
        <div
          onClick={() => handleUsers()}
          className={`${styles.card} ${
            darkMode ? styles.darkCard : styles.lightCard
          }`}
        >
          <h2>{status.users}</h2>
          <p>Total Users</p>
        </div>
        <div
          onClick={() => handleEvents()}
          className={`${styles.card} ${
            darkMode ? styles.darkCard : styles.lightCard
          }`}
        >
          <h2>{status.events}</h2>
          <p>Total Events</p>
        </div>
        <div
          onClick={() => handleRegisterations()}
          className={`${styles.card} ${
            darkMode ? styles.darkCard : styles.lightCard
          }`}
        >
          <h2>{status.registrations}</h2>
          <p>Total Registrations</p>
        </div>
      </div>

      <div className={styles.chartsSection}>
        <h2>📊 Trends Overview</h2>

        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3>Events by Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.eventsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          
          <div className={styles.chartCard}>
            <h3>User Roles</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.roleData}
                  dataKey="value"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.roleData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={["#0088FE", "#00C49F", "#FFBB28"][index % 3]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
