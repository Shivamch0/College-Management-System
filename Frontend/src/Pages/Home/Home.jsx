import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/axios.js'; 

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);   

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.get('/events');
        const eventsData = Array.isArray(res?.data?.data?.events)
          ? res.data.data.events
          : [];

        const sortedEvents = eventsData.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setEvents(sortedEvents.slice(0, 4));
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.firstLine}>
            Welcome to <span className="text-blue-400">CEMS</span>
          </h1>
          <h3 className={styles.secondLine}>College Event Management System</h3>
          <p className={styles.para}>
            Plan, manage, and participate in college events seamlessly.
          </p>
          <div className={styles.btnContainer}>
            <button
              className={styles.startBtn}
              onClick={() => navigate('/login')}
            >
              Get Started
            </button>
            <button
              className={styles.viewBtn}
              onClick={() => navigate('/events')}
            >
              View Events
            </button>
          </div>
        </div>

        <section className={styles.featuresSection}>
          <h1>Features</h1>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <i className="fa-solid fa-calendar-check"></i>
              <h3>Create Events Easily</h3>
              <p>Easily create and schedule events</p>
            </div>
            <div className={styles.featureItem}>
              <i className="fa-solid fa-users"></i>
              <h3>Manage Participants</h3>
              <p>Track and manage event participants</p>
            </div>
            <div className={styles.featureItem}>
              <i className="fa-solid fa-bell"></i>
              <h3>Get Notifications</h3>
              <p>Receive notifications about Events</p>
            </div>
            <div className={styles.featureItem}>
              <i className="fa-solid fa-chart-simple"></i>
              <h3>Track Analytics</h3>
              <p>Track event performance and engage.</p>
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <h1>Upcoming Events</h1>

          {loading ? (
            <p>Loading events...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : events.length > 0 ? (
            <div className={styles.featuresGrid}>
              {events.map((event) => (
                <div key={event._id} className={styles.featureItem}>
                  <h3>{event.title}</h3>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <p>{event.venue || 'Venue not specified'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No upcoming events found.</p>
          )}

          <button onClick={() => navigate('/events')}>View All Events</button>
        </section>
      </div>
    </>
  );
}

export default Home;
