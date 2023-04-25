import React, { useState, useEffect } from 'react';
import { db, auth } from '../Firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function CreateGoal() {
  const [user, setUser] = useState(null);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalType, setGoalType] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalMotivation, setGoalMotivation] = useState('');
  const [goalHabits, setGoalHabits] = useState([]);
  const [reminderFrequency, setReminderFrequency] = useState('');
  const navigate = useNavigate();

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
        type: goalType,
        description: goalDescription,
        motivation: goalMotivation,
        habits: goalHabits,
        reminderFrequency: reminderFrequency,
        progress: 0,
        deadline: Timestamp.fromDate(new Date(goalDeadline)),
      });
      console.log('Goal successfully added!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  
  const handleHabitChange = (event) => {
    const { value } = event.target;
    if (goalHabits.includes(value)) {
      setGoalHabits(goalHabits.filter(habit => habit !== value));
    } else {
      setGoalHabits([...goalHabits, value]);
    }
  };

  if (!user) {
    navigate('/login'); // Redirect to the login page if the user is not authenticated
    return null;
  } else {
    return (
      <div className="min-h-screen bg-gray-100 font-inter p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Create New Goal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Goal Title"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <select
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Goal Type</option>
              <option value="fitness">Fitness</option>
              <option value="productivity">Productivity</option>
              <option value="wellness">Wellness</option>
              <option value="custom">Custom</option>
</select>
<textarea
placeholder="Goal Description"
value={goalDescription}
onChange={(e) => setGoalDescription(e.target.value)}
className="w-full p-2 border border-gray-300 rounded"
></textarea>
<textarea
placeholder="Motivation"
value={goalMotivation}
onChange={(e) => setGoalMotivation(e.target.value)}
className="w-full p-2 border border-gray-300 rounded"
></textarea>
<div className="flex flex-wrap items-center">
<label className="w-full">Habits:</label>
<div className="space-x-2">
<label>
<input
type="checkbox"
value="exercise"
checked={goalHabits.includes('exercise')}
onChange={handleHabitChange}
/> Exercise
</label>
<label>
<input
type="checkbox"
value="meditation"
checked={goalHabits.includes('meditation')}
onChange={handleHabitChange}
/> Meditation
</label>
<label>
<input
type="checkbox"
value="reading"
checked={goalHabits.includes('reading')}
onChange={handleHabitChange}
/> Reading
</label>
</div>
</div>
<select
value={reminderFrequency}
onChange={(e) => setReminderFrequency(e.target.value)}
className="w-full p-2 border border-gray-300 rounded"
>
<option value="">Reminder Frequency</option>
<option value="daily">Daily</option>
<option value="weekly">Weekly</option>
<option value="monthly">Monthly</option>
</select>
<input
type="date"
placeholder="Goal Deadline"
value={goalDeadline}
onChange={(e) => setGoalDeadline(e.target.value)}
className="w-full p-2 border border-gray-300 rounded"
/>
<button
           type="submit"
           className="w-full py-2 bg-gray-800 text-white font-semibold rounded"
         >
Create Goal
</button>
</form>
</div>
</div>
);
}
}
