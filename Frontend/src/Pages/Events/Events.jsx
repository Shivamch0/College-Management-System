import React, { useContext, useEffect, useState } from 'react';
import styles from "./Events.module.css";
import { api } from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../Context/userContext.js';
import toast from "react-hot-toast";

function Events() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); 
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]); 
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/users/current-user", { withCredentials: true });
      const registered = res.data?.data?.user?.registeredEvents || [];
      setRegisteredIds(registered.map((event) => event._id.toString()));
    } catch (error) {
      console.log(error);
    }
  };

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
  }, []);

  const handleRegister = async (id) => {
    setRegisteredIds((prev) => [...prev, id]);
    setLoadingIds((prev) => [...prev, id]);
    try {
      const res = await api.post(`/events/${id}/register`);
      toast.success(`${res.data.data.title}`);
    } catch (err) {
      setRegisteredIds((prev) => prev.filter((eid) => eid !== id));
      alert(err.response?.data?.message || "Failed to register. Please login.");
      navigate("/login");
    } finally {
      setLoadingIds((prev) => prev.filter((eid) => eid !== id));
    }
  };

  const handleCancel = async (id) => {
    setRegisteredIds((prev) => prev.filter((eid) => eid !== id));
    setLoadingIds((prev) => [...prev, id]);
    try {
      await api.post(`/events/${id}/cancel`);
      toast.success("Registeration cancel successfully")
    } catch (error) {
      setRegisteredIds((prev) => [...prev, id]);
      console.error("Error cancelling:", error);
      alert("Failed to cancel registration.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}/delete`);
      setEvents((prev) => prev.filter((event) => event._id !== id));
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete event.");
    }
  };

  const handleEventClick = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);

  const formatDateForDisplay = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
};

  if (loading) return <p>Loading Events...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <>
      <div className={styles.eventsContainer}>
        <h1 className={styles.title}>All Events</h1>

        {(user?.role === "admin" || user?.role === "organizer") && (
          <div className={styles.adminActions}>
            <button className={styles.createBtn} onClick={() => navigate("/events/create")} > Create Event </button>
          </div>
        )}

        {events.length === 0 ? (
          <p>No events available...</p>
        ) : (
          <div className={styles.eventsGrid}>
            {events.map((event) => {
              const isRegistered = registeredIds.includes(event._id);

              return (
                <div
                  key={event._id}
                  className={styles.eventCard}
                >
                  <h2 onClick={() => handleEventClick(event)}>{event.title}</h2>
                  <p><strong>Date:</strong> {formatDateForDisplay(event.date)}</p>
                  <p><strong>Venue:</strong> {event.venue}</p>
                  <p><strong>Organizer:</strong> {event.createdBy?.userName || "Unknown"}</p>

                  {user?.role === "student" && (
                    isRegistered ? (
                      <div className={styles.registeredActions}>
                        <button className={`${styles.registerBtn} ${styles.disabled}`}disabled> Registered </button>
                        <button className={styles.cancelBtn} onClick={() => handleCancel(event._id)} > Cancel Registration </button>
                      </div>
                    ) : (
                      <button className={styles.registerBtn} onClick={() => handleRegister(event._id)} > Register </button>
                    )
                  )}

                  {(user?.role === "admin" || (user?.role === "organizer" && event.createdBy?._id === user._id)) && (
                    <div className={styles.adminControls}>
                      <button className={styles.editBtn} onClick={() => navigate(`/events/update/${event._id}`)}> Edit </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(event._id)} > Delete </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className={styles.modalBackdrop} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedEvent.title}</h2>
            <p><strong>Date:</strong> {new Date(selectedEvent.createdAt).toLocaleDateString()}</p>
            <p><strong>Venue:</strong> {selectedEvent.venue}</p>
            <p><strong>Organizer:</strong> {selectedEvent.createdBy?.userName || "Unknown"}</p>
            <p>{selectedEvent.description}</p>

            <div className={styles.modalButtons}>
              {registeredIds.includes(selectedEvent._id) ? (
                <>
                  <button className={`${styles.registerBtn} ${styles.disabled}`} disabled > Registered </button>                  <button className={styles.cancelBtn} onClick={() => handleCancel(selectedEvent._id)} > Cancel Registration </button>
                </>
              ) : (
                <button className={styles.registerBtn} onClick={() => handleRegister(selectedEvent._id)} > Register </button>
              )}
              <button className={styles.closeBtn} onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Events;
