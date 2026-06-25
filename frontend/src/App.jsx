import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container" style={{ marginTop: '2rem' }}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
