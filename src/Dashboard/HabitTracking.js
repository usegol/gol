import React, { useState, useEffect } from 'react';
import { db } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  writeBatch,
  deleteDoc,
  arrayUnion, 
  arrayRemove
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FiTrash2 } from 'react-icons/fi';


const predefinedHabits = [
  {
    id: 'drink_water',
    title: 'Drink 8 cups of water',
  },
  {
    id: 'exercise',
    title: 'Exercise for 30 minutes',
  },
  {
    id: 'read',
    title: 'Read for 20 minutes',
  },
  {
    id: 'meditate',
    title: 'Meditate for 10 minutes',
  },
  {
    id: 'write_journal',
    title: 'Write in journal',
  },
  {
    id: 'practice_language',
    title: 'Practice a language for 15 minutes',
  },
];

export default function HabitTracking() {
  const [habits, setHabits] = useState([]);
  const [habitStreaks, setHabitStreaks] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const [selectedHabits, setSelectedHabits] = useState(new Set());
  const [showHabitSelection, setShowHabitSelection] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const [hoveredHabit, setHoveredHabit] = useState(null);
  const [message, setMessage] = useState("");

  const handleHabitSelection = (habit) => {
    if (selectedHabits.has(habit.id)) {
      selectedHabits.delete(habit.id);
    } else {
      selectedHabits.add(habit.id);
    }
    setSelectedHabits(new Set(selectedHabits));
  };

  const saveSelectedHabits = async () => {
    const batch = writeBatch(db);

    selectedHabits.forEach((habitId) => {
      const habitData = {
        title: predefinedHabits.find((habit) => habit.id === habitId).title,
        userId: user.uid,
        predefinedId: habitId,
        completed: [],
        streak: 0,
      };
      const newHabitRef = doc(collection(db, 'habits'));
      batch.set(newHabitRef, habitData);
    });

    await batch.commit();
    setSelectedHabits(new Set());
    setShowHabitSelection(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchHabits(user.uid);
      } else {
        navigate('/test');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

// ...

// This function takes a habit object and updates its streak.
  const updateStreak = async (habit) => {
    const habitRef = doc(db, 'habits', habit.id);
    let lastCompletion = habit.completed.length > 0 ? new Date(habit.completed[habit.completed.length - 1].seconds * 1000) : null;

    if (lastCompletion) {
      lastCompletion.setHours(0, 0, 0, 0); // normalize time part

      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // normalize time part

      const daysSinceLastCompletion = Math.round((currentDate - lastCompletion) / oneDay);

      if (daysSinceLastCompletion > 1) {
        // If more than 1 day has passed since the last completion, reset the streak
        await updateDoc(habitRef, {
          streak: 0
        });
      }
    }
  };

  const fetchHabits = async (userId) => {
    const habitsRef = collection(db, 'habits');
    const habitsQuery = query(habitsRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(habitsQuery, (querySnapshot) => {
      const habitsData = [];
      querySnapshot.forEach((doc) => {
        const habit = { id: doc.id, ...doc.data() };
        habitsData.push(habit);
        updateStreak(habit);  // Update the streak of each habit
      });
      setHabits(habitsData);
    });

    return () => unsubscribe();
  };


  const completeHabit = async (habit) => {
    const habitRef = doc(db, 'habits', habit.id);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // normalize time part to avoid miscompares
  
    let lastCompletion = habit.completed.length > 0 ? new Date(habit.completed[habit.completed.length - 1].seconds * 1000) : null;
    if (lastCompletion) {
      lastCompletion.setHours(0, 0, 0, 0); // normalize time part
    }
  
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const daysSinceLastCompletion = lastCompletion ? Math.round((currentDate - lastCompletion) / oneDay) : null;
  
    let newStreak = habit.streak;
    if (daysSinceLastCompletion === null) {
      // increment the streak if the habit has never been completed before
      newStreak = 1;
    } else if (daysSinceLastCompletion === 1) {
      // increment the streak if the habit was last completed yesterday
      newStreak = lastCompletion === null ? 1 : habit.streak + 1;
    } else if (daysSinceLastCompletion > 1) {
      // reset the streak if the habit was last completed more than 1 day ago
      newStreak = 0;
    }
  
    if (!lastCompletion || +lastCompletion !== +currentDate) {
      // add a new date to completed array only if last completion wasn't today
      await updateDoc(habitRef, {
        streak: newStreak,
        completed: arrayUnion(currentDate),
      });
      setMessage("");
    } else {
      setMessage("You have already completed this habit today.");
    }
  };
  
  

  const deleteHabit = async (habit) => {
    const habitRef = doc(db, 'habits', habit.id);
    await deleteDoc(habitRef);
  };
  

  const addNewHabit = async () => {
    const habitData = {
      title: newHabit,
      userId: user.uid,
      predefinedId: null,
      completed: [],
      streak: 0,
    };
    await addDoc(collection(db, 'habits'), habitData);
    setNewHabit("");
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Habit Tracking</h3>
        <button className="bg-black text-white py-1 px-3 rounded hover:bg-green-400" onClick={() => setShowHabitSelection(!showHabitSelection)}>Choose Habits</button>
      </div>
      {message && <h3 className="text-s font-semibold text-red-500">{message}</h3>}
      {showHabitSelection && 
        <div className="mb-4 overflow-x-auto whitespace-nowrap py-2" style={{ scrollbarWidth: 'thin' }}>
          <h4 className="text-md font-semibold mb-2">Choose habits:</h4>
          <ul className="flex space-x-2">
            {predefinedHabits.map((habit) => (
              <li
                key={habit.id}
                onClick={() => handleHabitSelection(habit)}
                className={`p-3 bg-gray-100 border border-gray-200 rounded flex justify-between items-center cursor-pointer ${
                  selectedHabits.has(habit.id)
                    ? 'bg-gray-400'
                    : ''
                }`}
              >
                <span className="text-black font-semibold">{habit.title}</span>
              </li>
            ))}
          </ul>
          <div className="flex space-x-2 mt-2">
            <input type="text" value={newHabit} onChange={e => setNewHabit(e.target.value)} placeholder="Enter new habit" className="p-1 rounded border border-gray-300" />
            <button className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-400" onClick={addNewHabit}>Add New Habit</button>
          </div>
          <button className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-400 mt-2" onClick={saveSelectedHabits}>Save Selected Habits</button>
        </div>
      }
      <div className="flex overflow-x-auto whitespace-nowrap py-2" style={{ scrollbarWidth: 'thin' }}>
        {habits.map((habit) => (
          <div
            onClick={() => completeHabit(habit)}
            key={habit.id}
            className={`bg-gray-100 p-3 rounded mr-2 ${selectedHabits.has(habit.predefinedId) ? 'rounded-lg' : ''}`}
            onMouseEnter={() => setHoveredHabit(habit.id)}
            onMouseLeave={() => setHoveredHabit(null)}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg">{habit.title}</h4>
              {hoveredHabit === habit.id && (
                <FiTrash2 onClick={() => deleteHabit(habit)} className="text-black cursor-pointer" />
              )}
            </div>
            <p className="text-gray-500">Streak: {habit.streak || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}