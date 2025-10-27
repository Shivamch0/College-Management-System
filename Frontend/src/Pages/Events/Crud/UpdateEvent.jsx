import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Create.module.css"; 
import { api } from "../../../api/axios.js";
import toast from "react-hot-toast";

function UpdateEvent({ darkMode }) {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      date: "",
      venue: "",
      eventType: "",
      maxParticipants: ""
    },
    enableReinitialize: true, 
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        await api.put(`/events/${id}/update`, values, {headers: { Authorization: `Bearer ${token}` }});
        toast.success("Event updated successfully!");
        navigate("/events"); 
      } catch (error) {
        console.error("Update failed:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Failed to update event");
      }
    }
  });

  const formatDateForInput = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`; // "2025-11-16"
};

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        console.log(res.data)
        const event = res.data?.data;
        if (event) {
          formik.setValues({
            title: event.title || "",
            description: event.description || "",
            date: event.date ? formatDateForInput(event.date) : "",
            venue: event.venue || "",
            eventType: event.eventType || "",
            maxParticipants: event.maxParticipants || ""
          });
        }
      } catch (error) {
        console.error("Failed to fetch event:", error.response?.data || error.message);
        alert("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading event details...</p>;

  return (
    <div className={`${styles.createContainer} ${darkMode ? styles.darkContainer : ""}`}>
      <h1>Update Event</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.inputContainer}>
          <label>Title :</label>
          <input type="text" name="title" value={formik.values.title} onChange={formik.handleChange} required/>
        </div>

        <div className={styles.inputContainer}>
          <label>Description :</label>
          <input  type="text"  name="description"  value={formik.values.description}  onChange={formik.handleChange}/>
        </div>

        <div className={styles.inputContainer}>
          <label>Date :</label>
          <input  type="date"  name="date"  value={formik.values.date}  onChange={formik.handleChange}  required/>
        </div>

        <div className={styles.inputContainer}>
          <label>Venue :</label>
          <input  type="text"  name="venue"  value={formik.values.venue}  onChange={formik.handleChange}  required/>
        </div>

        <div className={styles.inputContainer}>
          <label>Event Type :</label>
          <input  type="text"  name="eventType"  value={formik.values.eventType}  onChange={formik.handleChange}/>
        </div>

        <div className={styles.inputContainer}>
          <label>Max Participants :</label>
          <input  type="number"  name="maxParticipants"  value={formik.values.maxParticipants}  onChange={formik.handleChange}/>
        </div>

        <input className={styles.submitBtn} type="submit" value="Update Event" />
      </form>
    </div>
  );
}

export default UpdateEvent;
