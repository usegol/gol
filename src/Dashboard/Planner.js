import React, { useState } from 'react';
import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';

export default function Planner() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const handleSignOut = () => {
    auth.signOut();
    navigate('/test');
  };

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <button
            onClick={handleSignOut}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      </header>
      <main className="container mx-auto mt-10 p-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">Day to Day Planner</h2>
          <p className="text-gray-600">Plan your daily schedule and track your progress.</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate.toISOString().substr(0, 10)}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          {/* Display the schedule for the selected date here */}
          {/* Allow users to add/edit tasks and set reminders/notifications */}
        </div>
      </main>
    </div>
  );
}
