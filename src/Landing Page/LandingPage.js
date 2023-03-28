import React from 'react';
import './LandingPage.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Pricing from './Pricing';
import About from './About';

export default function LandingPage() {
  return (
    <Router>
      <nav className='main-nav'>
        <img src="./assets/logo.png" alt="logo" />
        <div className='nav-link-div'>
          <Link to='/pricing'>Pricing</Link>
          <Link to='/about'>About</Link>
        </div>
      </nav>
      <Routes>
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </Router>
  );
}
