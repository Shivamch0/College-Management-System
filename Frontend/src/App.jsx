import React from 'react'
import Home from './Pages/Home/Home'
import { Routes , Route } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Events from './Pages/Events/Events'
import SignUp from './Pages/SignUp/SignUp'
import Navbar from './components/Navbar/Navbar'
import styles from '../src/Pages/Home/Home.module.css';

function App() {
  return (
    <div className={styles.container}>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/events' element={<Events />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
      </Routes>
    </div>
  )
}

export default App
