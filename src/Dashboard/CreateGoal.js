import React, { useState } from 'react';
import { db } from '../Firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase';


export default function CreateGoal({ user }) {
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await db.collection('goals').add({
        userId: user.uid,
        title: goalTitle,
        description: goalDescription,
        progress: 0,
        deadline: db.firestore.Timestamp.fromDate(new Date(goalDeadline)),
      });
      console.log('Goal successfully added!');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  if (!user) {
    return (
        <form onSubmit={handleSubmit}>
          {/* Add the form fields to get input from the user */}
          <input
            type="text"
            placeholder="Goal Title"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Goal Description"
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
          />
          <input
            type="date"
            placeholder="Goal Deadline"
            value={goalDeadline}
            onChange={(e) => setGoalDeadline(e.target.value)}
          />
          <button type="submit">Create Goal</button>
        </form>
      );
  } else {
    navigate('/dashboard');
  }
}
