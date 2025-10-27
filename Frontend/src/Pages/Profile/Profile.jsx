import React, { useEffect, useState , useContext} from 'react';
import styles from "./Profile.module.css";
import { api } from "../../api/axios.js"
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../Context/userContext.js";
import toast from "react-hot-toast";

function Profile() {
    const [user , setUser] = useState(null);
    const [events , setEvents] = useState([]);
    const navigate = useNavigate();
    const {logout} = useContext(UserContext);

    const getCurrentUser = async () => {
      try {
        const res = await api.get("/users/current-user" , {withCredentials : true})
        setUser(res.data.data.user);

        if (res.data.data.user.role === "organizer") {
        const eventRes = await api.get("/events", { withCredentials: true });
        const createdEvents = eventRes.data.data.events.filter(
          (event) => event.createdBy?._id === res.data.data.user._id
        );
        setEvents(createdEvents);
      } else if (res.data.data.user.role === "student") {
        setEvents(res.data.data.user.registeredEvents || []);
      } else if (res.data.data.user.role === "admin") {
        const eventRes = await api.get("/events", { withCredentials: true });
        const createdEvents = eventRes.data.data.events.filter(
          (event) => event.createdBy?._id === res.data.data.user._id
        );
        setEvents(createdEvents);
      }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      (async () => {
       await getCurrentUser()
      })();
    } , []);

    const handleLogout = async () => {
        try {
            await api.post("/users/logout" , {} , {withCredentials : true});
            logout();
            toast.success(`User Logout Successfully`);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Something went wrong while logging out.");
        }
    }

  return (
    <>
      <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <img src="User.png" alt="avatar" />
          <h2>{user?.fullName}</h2>
          <p className={styles.role}>{user?.role}</p>
        </div>

        <div className={styles.detailsSection}>
          <p><strong>Username : </strong>{user?.userName}</p>
          <p><strong>Email : </strong>{user?.email}</p>

          <div className={styles.eventContainer}>
            <p><strong>{user?.role === "student" ? "Registered Events" : "Events Created"}:</strong></p>
            <ul className={styles.registeredEvents}>
              {events.length > 0 ? (
                events.map((event) => (
                  <li key={event._id}>
                    <p>{event.title}</p>
                  </li>
                ))
              ) : (
                <li>No events found.</li>
              )}
            </ul>
          </div>
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </div>
    </div>
    </>
  )
}

export default Profile
