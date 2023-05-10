import React from 'react'
import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';

export default function Navigation() {
    const navigate = useNavigate();
    const navToDashboard = () => navigate('/dashboard');
    

  return (
    <header className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex justify-between items-center space-x-16">
                <img src='./assets/logo.png' alt="Logo" className="h-8" />
                <div id='navigation'>
                    <button onClick={navToDashboard}>Dashboard</button>
                </div>
            </div>
            <button
                onClick={() => {
                localStorage.removeItem('rememberMe');
                auth.signOut();
                }}
                className="bg-black text-white px-4 py-2 rounded"
            >
                Sign Out
            </button>
        </div>
    </header>
  )
}
