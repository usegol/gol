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
      setHabitStreaks(prevState => ({...prevState, [userId]: habitStreaksDoc.data()}));
    }
  };

  const completeHabit = async (habit) => {
    const habitRef = doc(db, 'habits', habit.id);
    const habitStreaksRef = doc(db, 'habitStreaks', user.uid);

    if (!habitStreaks[habit.predefinedId]) {
      await setDoc(habitStreaksRef, { [habit.predefinedId]: 1 }, { merge: true });
    } else {
      await updateDoc(habitStreaksRef, {
        [habit.predefinedId]: habitStreaks[habit.predefinedId] + 1,
      });
    }

    await deleteDoc(habitRef);
  };

  const addNewHabit = async () => {
    const habitsRef = collection(db, 'habits');
    const habitData = {
      title: newHabit,
      userId: user.uid,
    };
    await addDoc(habitsRef, habitData);
    setNewHabit("");
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Habit Tracking</h3>
        <button className="bg-black text-white py-1 px-3 rounded hover:bg-green-400" onClick={() => setShowHabitSelection(!showHabitSelection)}>Choose Habits</button>
      </div>
      {showHabitSelection && 
        <div className="mb-4 overflow-x-auto whitespace-nowrap py-2" style={{ scrollbarWidth: 'thin' }}>
          <h4 className="text-md font-semibold mb-2">Choose habits:</h4>
          <ul className="flex space-x-2">
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
          <div className="flex space-x-2 mt-2">
            <input type="text" value={newHabit} onChange={e => setNewHabit(e.target.value)} placeholder="Enter new habit" className="p-1 rounded border border-gray-300" />
            <button className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-400" onClick={addNewHabit}>Add New Habit</button>
          </div>
          <button className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-400 mt-2" onClick={saveSelectedHabits}>Save Selected Habits</button>
        </div>
      }
      <div className="flex overflow-x-auto whitespace-nowrap py-2" style={{ scrollbarWidth: 'thin' }}>
        {habits.map((habit) => (
          <div key={habit.id} className={`bg-gray-100 p-3 rounded mr-2 ${selectedHabits.find((selected) => selected.id === habit.predefinedId) ? 'rounded-lg' : ''}`}>
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg">{habit.title}</h4>
              <FiTrash2 onClick={() => completeHabit(habit)} className="text-black cursor-pointer" />
            </div>
            <p className="text-gray-500">Streak: {habitStreaks[habit.predefinedId]?.streak || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
