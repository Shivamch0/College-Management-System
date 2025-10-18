import React from 'react'
import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
  return (
    <>
      <div className={styles.container}>
        

       <div className={styles.content}>
        <h1 className={styles.firstLine}>Welcome to <span className="text-blue-400">CEMS</span></h1>
        <h3 className={styles.secondLine}>College Event Management System</h3>
        <p className={styles.para}>
          Plan, manage, and participate in college events seamlessly.
        </p>
        <div className={styles.btnContainer}>
            <button className={styles.startBtn} onClick={() => navigate("/login")}>Get Started</button>
            <button className={styles.viewBtn} onClick={() => navigate("/events")}>View Events</button>
        </div>
      </div>

      <section className={styles.featuresSection}>
        <h1>Features</h1>
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <i class="fa-solid fa-calendar-check"></i>
            <h3>Create Events Easily</h3>
            <p>Easily create and schedule events</p>
          </div>

          <div className={styles.featureItem}>
            <i class="fa-solid fa-users"></i>
            <h3>Manage Participants</h3>
            <p>Track and manage event participants</p>
          </div>

          <div className={styles.featureItem}>
            <i class="fa-solid fa-bell"></i>
            <h3>Get Notifications</h3>
            <p>Recieve notifications about Events</p>
          </div>

          <div className={styles.featureItem}>
            <i class="fa-solid fa-chart-simple"></i>
            <h3>Track Analytics</h3>
            <p>Track event performance and engage.</p>
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <h1>Upcoming Events</h1>
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <h3>Tech Talks</h3>
            <p>Apr 25 , 2025</p>
            <p>Main Auditorium</p>
          </div>

          <div className={styles.featureItem}>
            <h3>Art Exhibition</h3>
            <p>May 10, 2025</p>
            <p>Art Gallery</p>
          </div>

          <div className={styles.featureItem}>
            <h3>Sports Meet</h3>
            <p>Jun 20, 2025</p>
            <p>Sports Complex</p>
          </div>

          <div className={styles.featureItem}>
            <h3>ESport Event</h3>
            <p>15 Nov, 2025</p>
            <p>Seminal Hall</p>
          </div>
        </div>
        <button onClick={() => navigate("/events")}>View All Events</button>
      </section>

      </div>
    </>
  )
}

export default Home
