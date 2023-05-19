import React from 'react';
import LandingPage from './Landing Page/LandingPage';
import Pricing from './Landing Page/Pricing';
import About from './Landing Page/About';
import SignIn from './Authentication/SignIn';
import SignUp from './Authentication/SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Login from './Authentication/login';
import ForgotPasword from './Authentication/ForgotPasword';
import CreateGoal from './Dashboard/CreateGoal';
import GoalDetail from './Dashboard/GoalDetail';
import UserCalendar from './Calendar/Calendar';
import MyCalendar from './Calendar/Calendar';
import Journal from './Dashboard/Journal';

export default function App() {
  return (
    <div style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/test" element={<Login />} />          
          <Route path="/auth/forgot-password" element={<ForgotPasword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="create-goal" element={<CreateGoal />} />
          <Route path="/goal/:goalId" element={<GoalDetail />} />
          {/* <Route path="/calendar" element={<UserCalendar />} /> */}
          <Route path="/calendar" element={<MyCalendar />} />
          <Route path="/journal" element={<Journal /> } />
        </Routes>
      </Router>
    </div>
  );
}