import React , {useState , useEffect} from 'react'
import Home from './Pages/Home/Home'
import { Routes , Route } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Events from './Pages/Events/Events'
import SignUp from './Pages/SignUp/SignUp'
import Navbar from './components/Navbar/Navbar'
import styles from '../src/Pages/Home/Home.module.css';
import Profile from './Pages/Profile/Profile'

function App() {

  const [darkMode , setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  }

  useEffect(() => {
    document.body.className = darkMode ? styles.dark : styles.light
  } , [darkMode])

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme}/>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/events' element={<Events />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
      </Routes>
    </div>
  )
}

export default App
