import React from 'react';
import { Link } from "react-router-dom";
import styles from './Navbar.module.css';

function Navbar({darkMode , toggleTheme }) {
  return (
    <>
      <header className={`${styles.header} ${darkMode ? styles.dark : styles.light}`}>
        <div className={styles.logo}>
            <img className={styles.img} src="c_logo.jpg" alt="cems" />
            <Link to="/"><h1 className={styles.logoHeading}>CEMS</h1></Link>
        </div>

        <nav className={styles.navLinks}>
           <Link to="/profile">Profile</Link>
           <Link to="/events">Events</Link>
           <Link to="/login">Login</Link>
           <Link to="/signup">SignUp</Link>
           <label className={styles.switchLabel}>
            <input type="checkbox" className={styles.switchInput} checked={darkMode} onChange={toggleTheme} />
            <span className={styles.switchSlider}></span>
          </label>
        </nav>
      </header>
    </>
  )
}

export default Navbar
