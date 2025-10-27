import React, { useEffect, useState } from "react";
import { api } from "../../api/axios.js"
import styles from "./admin.module.css"; // or your css file

const AdminRegistrations = ({darkMode}) => {
  const [registrations, setRegistrations] = useState([]); // ✅ initialize as empty array
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await api.get("/admin/registerations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRegistrations(data.data || []); 
      } catch (error) {
        console.error("Failed to fetch registrations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const filteredRegistrations = (registrations || []).filter((reg) =>
    reg.event?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Total Registrations</h2>

      <input
        type="text"
        placeholder="Search by Event Title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      {loading ? (
        <p>Loading...</p>
      ) : filteredRegistrations.length === 0 ? (
        <p>No registrations found.</p>
      ) : (
        <table className={`${styles.table} ${darkMode ? styles.tableDark : styles.tableLight}`}>
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Participant Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Registered At</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.map((reg, index) => (
              <tr key={index}>
                <td>{reg.event?.title}</td>
                <td>{reg.user?.name}</td>
                <td>{reg.user?.email}</td>
                <td>{reg.user?.role}</td>
                <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminRegistrations;
