import React from 'react'
import LandingPage from './Landing Page/LandingPage'
import Pricing from './Landing Page/Pricing'
import About from './Landing Page/About'
import SignIn from './Authentication/SignIn'
import SignUp from './Authentication/SignUp'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  )
}

