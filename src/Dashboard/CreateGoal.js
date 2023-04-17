import React, { useState, useEffect } from 'react';
import { db, auth } from '../Firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function CreateGoal() {
  const [user, setUser] = useState(null);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
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
        description: goalDescription,
        progress: 0,
        deadline: Timestamp.fromDate(new Date(goalDeadline)),
      });
      console.log('Goal successfully added!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  
  

  if (!user) {
    navigate('/login'); // Redirect to the login page if the user is not authenticated
    return null;
  } else {
    return (
      <form onSubmit={handleSubmit}>
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
  }
}
