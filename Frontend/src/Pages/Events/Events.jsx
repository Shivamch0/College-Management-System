import React, { useEffect, useState } from 'react';
import styles from "./Events.module.css";
import { api } from "../../api/axios.js";
import { useNavigate } from "react-router-dom"

function Events() {
  const [events , setEvents] = useState([]);
  const [loading , setLoading] = useState(true);
  const [error , setError] = useState(null);
  const [registeredIds , setRegisteredIds] = useState([]);
   const [loadingIds, setLoadingIds] = useState([]); 
   const [selectedEvent , setSelectedEvent] = useState(null);
  const navigate = useNavigate()

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/users/current-user" , {withCredentials : true});
      const registered = res.data?.data?.user?.registeredEvents || [];

      setRegisteredIds(registered.map((event) => event._id.toString()));
     } catch (error) {
      console.log(error)
    }
  }

   const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data?.data?.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCurrentUser();
      await fetchEvents();
    })();
  } , [] );

  const handleRegister = async (id) => {
    setRegisteredIds((prev) => [...prev, id]);
    setLoadingIds((prev) => [...prev, id]);
    try {
      const res = await api.post(`/events/${id}/register`);
      alert(res.data?.message || "Registerd Successfully...");
    } catch (err) {
      setRegisteredIds((prev) => prev.filter((eid) => eid !== id));
      alert(err.response?.data?.message || "Failed to register. Please login.");
      navigate("/login");
    }finally {
      setLoadingIds((prev) => prev.filter((eid) => eid !== id));
    }
  }

  const handleCancel = async (id) => {
    setRegisteredIds((prev) => prev.filter((eid) => eid !== id));
    setLoadingIds((prev) => [...prev, id]);
    try {
      const res = await api.post(`/events/${id}/cancel`);
      alert(res.data?.data?.message || "Registration cancel successfully...");
    } catch (error) {
      setRegisteredIds((prev) => [...prev, id]);
      console.error("Error cancelling:", error);
      alert("Failed to cancel registration.");
    }
  }

  const handleEventClick =  (event) => {
    setSelectedEvent(event);
  }

  const closeModal = () => {
    setSelectedEvent(null);
  };

  if(loading) return <p>Loading Events...</p>
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <>
      <div className={styles.eventsContainer}>
      <h1 className={styles.title}>All Events</h1>
      {events.length === 0 ? (
        <p>No events avaliable...</p>
      ) : (
        <div className={styles.eventsGrid}>
          {events.map((event) => {
            const isRegistered = registeredIds.includes(event._id);
           
            return (
               
            <div onClick={() => handleEventClick(event)} key={event._id} className={styles.eventCard}>
              <h2>{event.title}</h2>
              <p><strong>Date:</strong> {new Date(event.createdAt).toLocaleDateString()}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
              <p><strong>Organizer:</strong> {event.createdBy?.userName || "Unknown"}</p>
              
              {isRegistered ? (
                  // if user is registered → show "Registered" + "Cancel" buttons
                  <div className={styles.registeredActions}>
                    <button
                      className={`${styles.registerBtn} ${styles.disabled}`}
                      disabled
                    >
                      Registered
                    </button>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => handleCancel(event._id)}
                    >
                      Cancel Registration
                    </button>
                  </div>
                ) : (
                  // otherwise → show normal "Register" button
                  <button
                    className={styles.registerBtn}
                    onClick={() => handleRegister(event._id)}
                  >
                    Register
                  </button>
                )}
            </div>
            )
        })}
        </div>
      )}
    </div>

    {selectedEvent && (
        <div className={styles.modalBackdrop} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // prevent click through
          >
            <h2>{selectedEvent.title}</h2>
            <p><strong>Date:</strong> {new Date(selectedEvent.createdAt).toLocaleDateString()}</p>
            <p><strong>Venue:</strong> {selectedEvent.venue}</p>
            <p><strong>Organizer:</strong> {selectedEvent.createdBy?.userName || "Unknown"}</p>
            <p>{selectedEvent.description}</p>

            <div className={styles.modalButtons}>
              {registeredIds.includes(selectedEvent._id) ? (
                <>
                  <button
                    className={`${styles.registerBtn} ${styles.disabled}`}
                    disabled
                  >
                    Registered
                  </button>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => handleCancel(selectedEvent._id)}
                  >
                    Cancel Registration
                  </button>
                </>
              ) : (
                <button className={styles.registerBtn}  onClick={() => handleRegister(selectedEvent._id)}>Register</button>
              )}
              <button className={styles.closeBtn} onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}x 
    </>
  )
}

export default Events
