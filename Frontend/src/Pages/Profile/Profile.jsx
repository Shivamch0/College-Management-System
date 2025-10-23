import React, { useEffect, useState } from 'react';
import styles from "./Profile.module.css";
import { api } from "../../api/axios.js"
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user , setUser] = useState(null)
    const navigate = useNavigate();

    const getCurrentUser = async () => {
      try {
        const res = await api.get("/users/current-user" , {withCredentials : true})
        console.log(res.data);
        setUser(res.data.data.user)
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
            const res = await api.post("/users/logout" , {} , {withCredentials : true});
            console.log("Logout Successfully..." , res.data)  
            localStorage.removeItem("user");
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
            <img src="User.png" alt="image" />
            <h2>{user?.fullName}</h2>
            <p className={styles.role}>{user?.role}</p>
        </div>

        <div className={styles.detailsSection}>
            <p><strong>Username : </strong>{user?.userName}</p>
            <p><strong>Email : </strong>{user?.email}</p>
            <div className={styles.eventContainer}>
              <ul className={styles.registeredEvents}>
              <p><strong>Registered  Events : </strong></p>
            {user?.registeredEvents?.length ? (
              user.registeredEvents.map((event) => (
                <li key={event._id}>
                 <p>{event.title}</p> 
                </li>
              ))
            ) : (
              <li>No events registered yet.</li>
            )}
          </ul>
            </div>
        </div>
        <button onClick={() => handleLogout()} className={styles.logoutBtn}>Logout</button>
       </div>
      </div>
    </>
  )
}

export default Profile
