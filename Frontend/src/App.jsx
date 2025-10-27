import React , {useState , useEffect , useContext} from 'react'
import Home from './Pages/Home/Home'
import { Routes , Route , useNavigate , useLocation } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Events from './Pages/Events/Events'
import SignUp from './Pages/SignUp/SignUp'
import Navbar from './components/Navbar/Navbar'
import styles from '../src/Pages/Home/Home.module.css';
import Profile from './Pages/Profile/Profile'
import Admin from './Pages/Admin/Admin';
import { UserContext } from './Context/userContext.js';
import AdminUsers from './Pages/Admin/AdminUsers'
import AdminEvents from './Pages/Admin/AdminEvents'
import AdminRegistrations from './Pages/Admin/AdminRegisterations.jsx'
import CreateEvent from './Pages/Events/Crud/CreateEvent.jsx'
import UpdateEvent from './Pages/Events/Crud/UpdateEvent.jsx';
import { Toaster } from "react-hot-toast";

function App() {

  const [darkMode , setDarkMode] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const {user} = useContext(UserContext);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  }

  useEffect(() => {
    document.body.className = darkMode ? styles.dark : styles.light
  } , [darkMode]);

  useEffect(() => {
    if (user && location.pathname === "/") {
      if (user.role === "admin") {
        navigate("/admin/dashboard" , {replace : true});
      } else if (user.role === "student") {
        navigate("/" , {replace : true});
      } else if (user.role === "organizer") {
        navigate("/events" , {replace : true});
      } else {
        navigate("/");
      }
    }
  }, [user , location.pathname , navigate]);

  return (
    <>
    <Toaster position="top-right" toastOptions={{style: { background: "#333", color: "#fff" },}}/>
    <div className={`${styles.mainContainer} ${darkMode ? styles.dark : styles.light}`}>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme}/>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/events' element={<Events />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/admin/dashboard' element={<Admin darkMode={darkMode} />}></Route>
        <Route path='/admin/users' element={<AdminUsers darkMode={darkMode} />}></Route>
        <Route path='/admin/events' element={<AdminEvents darkMode={darkMode} />}></Route>
        <Route path='/admin/registerations' element={<AdminRegistrations darkMode={darkMode} />}></Route>
        <Route path='/events/create' element={<CreateEvent darkMode={darkMode}/>}></Route>
        <Route path='/events/update/:id' element={<UpdateEvent darkMode={darkMode}/>}></Route>
      </Routes>
    </div>
    </>
  )
}

export default App
