import React, { useEffect, useState } from "react";
import { api } from "../../api/axios.js";
import styles from "./Admin.module.css";

function AdminEvents(darkMode) {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/admin/events", { withCredentials: true });
      setEvents(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading Events...</h2>;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>All Events</h1>
      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />
      <table className={`${styles.table} ${darkMode ? styles.tableDark : styles.tableLight}`}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Participants</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((e) => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td>{e.date}</td>
              <td>{e.participants?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminEvents;
