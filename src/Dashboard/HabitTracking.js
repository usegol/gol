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
  setDoc,
    deleteDoc
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
  const [selectedHabits, setSelectedHabits] = useState([]);
  const [showHabitSelection, setShowHabitSelection] = useState(false);
  const [newHabit, setNewHabit] = useState("");

  const handleHabitSelection = (habit) => {
    if (selectedHabits.find((selected) => selected.id === habit.id)) {
      setSelectedHabits(selectedHabits.filter((selected) => selected.id !== habit.id));
    } else {
      setSelectedHabits([...selectedHabits, habit]);
    }
  };

  const saveSelectedHabits = async () => {
    const habitsRef = collection(db, 'habits');
    const batch = writeBatch(db);
  
    selectedHabits.forEach((habit) => {
      const habitData = {
        title: habit.title,
        userId: user.uid,
        predefinedId: habit.id,
      };
      const newHabitRef = doc(habitsRef);
      batch.set(newHabitRef, habitData);
    });
  
    await batch.commit();
    setSelectedHabits([]);
    setShowHabitSelection(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchHabits(user.uid);
        fetchHabitStreaks(user.uid);
      } else {
        navigate('/test');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);


  const fetchHabits = async (userId) => {
    const habitsRef = collection(db, 'habits');
    const habitsQuery = query(habitsRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(habitsQuery, (querySnapshot) => {
      const habitsData = [];
      querySnapshot.forEach((doc) => {
        habitsData.push({ id: doc.id, ...doc.data() });
      });
      setHabits(habitsData);
    });

    return () => unsubscribe();
  };

  const fetchHabitStreaks = async (userId) => {
    const habitStreaksRef = doc(db, 'habitStreaks', userId);
    const habitStreaksDoc = await getDoc(habitStreaksRef);
    if (habitStreaksDoc.exists()) {
      setHabitStreaks(habitStreaksDoc.data());
    } else {
      setHabitStreaks({});
    }
};

  const addCustomHabit = async () => {
    const habitsRef = collection(db, 'habits');
    const habitData = {
      title: newHabit,
      userId: user.uid,
    };
    await addDoc(habitsRef, habitData);
    setNewHabit("");
    fetchHabits(user.uid);
  };

  const updateHabitStreak = async (habitId) => {
    const habitRef = doc(db, 'habits', habitId);
    const habitDoc = await getDoc(habitRef);
    const habitData = habitDoc.data();
  
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
  
    const lastCompleted = habitData.lastCompleted?.toDate() || null;
  
    const dayDifference = lastCompleted
      ? Math.floor((currentDate - lastCompleted) / (1000 * 60 * 60 * 24))
      : null;
  
    let newStreak = habitData.streak || 0;
    if (dayDifference === 1) {
      newStreak += 1;
    } else if (dayDifference !== 0) {
      newStreak = 1;
    }
  
    await updateDoc(habitRef, {
      lastCompleted: currentDate,
      streak: newStreak,
    });
  
    fetchHabits(user.uid);
  };

  const deleteHabit = async (habitId) => {
    const habitRef = doc(db, 'habits', habitId);
    await deleteDoc(habitRef);
    fetchHabits(user.uid);
  };
  

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Habit Tracking</h3>
      {!showHabitSelection ? (
        <button
          className="bg-black text-white py-2 px-4 rounded hover:bg-green-500 mb-4"
          onClick={() => setShowHabitSelection(true)}
        >
          Start tracking habits
        </button>
      ) : (
        <div className="mb-4">
          <h4 className="text-md font-semibold mb-2">Choose habits:</h4>
          <ul className="space-y-2">
            {predefinedHabits.map((habit) => (
              <li
                key={habit.id}
                onClick={() => handleHabitSelection(habit)}
                className={`p-3 bg-gray-100 border border-gray-200 rounded flex justify-between items-center cursor-pointer ${
                  selectedHabits.find((selected) => selected.id === habit.id)
                    ? 'bg-gray-400'
                    : ''
                }`}
              >
                <span className="text-black font-semibold">{habit.title}</span>
              </li>
            ))}
          </ul>
          <button
              className="bg-green-500 text-white py-2 px-4 rounded mt-4 hover:bg-green-600"
              onClick={saveSelectedHabits}
          >
              Done
          </button>
        </div>
      )}
      <div>
        <input
          type="text"
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          placeholder="Enter a new habit"
        />
        <button
          onClick={addCustomHabit}
        >
          Add Habit
        </button>
      </div>
      {habits.map((habit) => (
        <div key={habit.id} className="bg-gray-100 p-3 mb-4 rounded">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-md font-semibold">{habit.title}</h4>
            <button onClick={() => deleteHabit(habit.id)}>
              <FiTrash2 size={20} />
            </button>
          </div>
          <p className="text-gray-500">Streak: {habit.streak || 0} days</p>
          <button
            className="bg-black text-white py-1 px-2 rounded mt-2 hover:bg-green-500"
            onClick={() => updateHabitStreak(habit.id)}
          >
            I did this today
          </button>
        </div>
      ))}
    </div>
  );
}
