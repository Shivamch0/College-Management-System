import React , { useEffect, useState } from "react";
import styles from "./Admin.module.css";
import { api } from "../../api/axios.js";
import { useNavigate } from "react-router-dom"

function Admin({ darkMode }) {
  const [status , setStatus] = useState({
    users : 0,
    events: 0,
    registrations : 0,
  })

  const [loading , setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/admin/status" , {withCredentials : true});
        setStatus(res.data.data)
      } catch (error) {
        console.error("Failed to fetch user..." , error)
      }finally{
        setLoading(false)
      }
    };
    fetchStatus();
  } , []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading dashboard...</h2>;
  }

  const handleUsers = () => {
    navigate("/admin/users");
  }

  const handleEvents = () => {
    navigate("/admin/events");
  }

  const handleRegisterations = () => {
    navigate("/admin/registerations");
  }
  
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Admin Analytics Dashboard</h1>

      <div className={styles.cards}>
        <div onClick={() => handleUsers()} className={`${styles.card} ${darkMode ? styles.darkCard : styles.lightCard}`}>
          <h2>{status.users}</h2>
          <p>Total Users</p>
        </div>
        <div onClick={() => handleEvents()} className={`${styles.card} ${darkMode ? styles.darkCard : styles.lightCard}`}>
          <h2>{status.events}</h2>
          <p>Total Events</p>
        </div>
        <div onClick={() => handleRegisterations()} className={`${styles.card} ${darkMode ? styles.darkCard : styles.lightCard}`}>
          <h2>{status.registrations}</h2>
          <p>Total Registrations</p>
        </div>
      </div>
    </div>
  );
}

export default Admin;
