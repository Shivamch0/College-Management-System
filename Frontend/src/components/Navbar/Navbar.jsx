import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { UserContext } from "../../Context/userContext.js";

function Navbar({ darkMode, toggleTheme }) {
  const { user } = useContext(UserContext); 

  return (
    <header className={`${styles.header} ${ darkMode ? styles.dark : styles.light}`}>
      <div className={styles.logo}>
        <img className={styles.img} src="c_logo.jpg" alt="CEMS" />
        <Link to="/"><h1 className={styles.logoHeading}>CEMS</h1></Link>
      </div>

      <nav className={styles.navLinks}>
        <Link to="/events">Events</Link>

        {user?.role === "admin" && (
          <Link to="/admin/dashboard">Dashboard</Link>
        )}

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">SignUp</Link>
          </>
        ) : (
          <>
            <Link to="/profile">Profile</Link>
          </>
        )}

        <label className={styles.switchLabel}>
          <input
            type="checkbox"
            className={styles.switchInput}
            checked={darkMode}
            onChange={toggleTheme}
          />
          <span className={styles.switchSlider}></span>
        </label>
      </nav>
    </header>
  );
}

export default Navbar;
