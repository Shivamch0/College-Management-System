import React from 'react';
import {useFormik} from "formik";
import styles from "./Create.module.css";
import { api } from "../../../api/axios.js";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

function CreateEvent({darkMode}) {
  const navigate = useNavigate()
  const {values , handleChange , handleSubmit} = useFormik({
    initialValues : {
      title : "",
      description : "",
      date : "",
      venue : "",
      eventType : "",
      maxParticipants : ""
    },
    onSubmit :async (values , action) => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.post("/events/create" , values , {headers: {Authorization: `Bearer ${token}`}});
        console.log(" Event created", res.data);
        action.resetForm()
        toast.success("Event Created...")
        navigate("/events");
      } catch (error) {
        console.error(error)
      }
    }   
  })
  return (
    <div className={`${styles.createContainer} ${darkMode ? styles.darkContainer : styles.lightContainer}`}>
      <h1>Create Events</h1>
      <form action="" onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <label>Title : </label>
          <input  type="text" name='title' value={values.title} onChange={handleChange} required/>
        </div>

        <div className={styles.inputContainer}>
          <label>Description : </label>
          <input type="text" name='description' value={values.description} onChange={handleChange} />
        </div>

        <div className={styles.inputContainer}>
          <label>Date : </label>
          <input type="date" name='date' value={values.date} onChange={handleChange} required/>
        </div>

        <div className={styles.inputContainer}>
          <label>Venue : </label>
          <input type="text" name='venue' value={values.venue} onChange={handleChange} required/>
        </div>

        <div className={styles.inputContainer}>
          <label>EventType : </label>
          <input type="text" name='eventType' value={values.eventType} onChange={handleChange}/>
        </div>

        <div className={styles.inputContainer}>
          <label>Max Participants : </label>
          <input type="number" name='maxParticipants' value={values.maxParticipants} onChange={handleChange}/>
        </div>

        <input className={styles.submitBtn} type="submit" value="Create Event" />
      </form>
    </div>
  )
}

export default CreateEvent
