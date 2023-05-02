import React, { useState, useEffect } from 'react';
import { db, auth } from '../Firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Add the ColorPicker component
function ColorPicker({ onSelect }) {
  const colors = ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#9333EA', '#FB7185', '#65A30D'];
  const [selectedColor, setSelectedColor] = useState('');

  const handleColorSelection = (color) => {
    setSelectedColor(color);
    onSelect(color);
  };

  return (
    <div className="flex space-x-2">
      {colors.map((color, index) => (
        <button
          key={index}
          onClick={() => handleColorSelection(color)}
          className={`w-6 h-6 rounded-full border-2 ${
            color === selectedColor ? 'border-black' : 'border-white'
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}



function CreateGoal() {
  const [goalTitle, setGoalTitle] = useState('');
  const [goalType, setGoalType] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalMotivation, setGoalMotivation] = useState('');
  const [goalHabits, setGoalHabits] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [goalColor, setGoalColor] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    // Clean up the listener when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await addDoc(collection(db, 'goals'), {
        userId: user.uid,
        title: goalTitle,
        description: goalDescription,
        progress: 0,
        deadline: Timestamp.fromDate(new Date(goalDeadline)),
        color: goalColor,
        goalType: goalType,
        goalMotivation: goalMotivation,
        goalHabits: goalHabits,
        heightFt: goalType === 'fitness' ? heightFt : null,
        heightIn: goalType === 'fitness' ? heightIn : null,
        weight: goalType === 'fitness' ? weight : null,
      });
      console.log('Goal successfully added!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  } else {
    return (
      <div className="min-h-screen bg-gray-100 font-inter">
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <img src='./assets/logo.png' alt="Logo" className="h-8" />
            <button
              onClick={() => auth.signOut()}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
        </header>
        <main className="container mx-auto mt-10 p-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Create New Goal</h2>
            <p className="text-gray-600">Set your goal and track your progress.</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Goal Type</label>
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Goal Type</option>
                    <option value="fitness">Fitness</option>
                    <option value="productivity">Productivity</option>
                    <option value="wellness">Wellness</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                {goalType === 'fitness' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Height (ft)</label>
                      <input
                        type="number"
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Height (in)</label>
                      <input
                        type="number"
                        value={heightIn}
                        onChange={(e) => setHeightIn(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Weight (lbs)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </>
                )}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Goal Description</label>
                  <textarea
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Goal Deadline</label>
                  <input
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Motivation</label>
                  <textarea
                    value={goalMotivation}
                    onChange={(e) => setGoalMotivation(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Habits/Actions</label>
                  <textarea
                    value={goalHabits}
                    onChange={(e) => setGoalHabits(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Goal Color</label>
                    <ColorPicker onSelect={setGoalColor} />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
                    >
                      Create Goal
                    </button>
                  </div>
                </form>
              </div>
            </main>
          </div>
        );
      }
    }
                       
export { CreateGoal as default, ColorPicker };