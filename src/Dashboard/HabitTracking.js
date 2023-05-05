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
import { BeakerIcon, BookOpenIcon, LightningBoltIcon, PencilAltIcon, PlayIcon, SpeakerphoneIcon } from '@heroicons/react/outline';
import { FiTrash2 } from 'react-icons/fi';


const predefinedHabits = [
  {
    id: 'drink_water',
    title: 'Drink 8 cups of water',
    // icon: BeakerIcon,
  },
  {
    id: 'exercise',
    title: 'Exercise for 30 minutes',
    // icon: LightningBoltIcon,
  },
  {
    id: 'read',
    title: 'Read for 20 minutes',
    // icon: BookOpenIcon,
  },
  {
    id: 'meditate',
    title: 'Meditate for 10 minutes',
    // icon: SpeakerphoneIcon,
  },
  {
    id: 'write_journal',
    title: 'Write in journal',
    // icon: PencilAltIcon,
  },
  {
    id: 'practice_language',
    title: 'Practice a language for 15 minutes',
    // icon: PlayIcon,
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


const updateHabitStreak = async (habitId) => {
    const habitRef = doc(db, 'habits', habitId);
    const habitDoc = await getDoc(habitRef);
    const habitData = habitDoc.data();
  
    // Get the current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight
  
    // Get the last completed date
    const lastCompleted = habitData.lastCompleted?.toDate() || null;
  
    // Calculate the difference in days
    const dayDifference = lastCompleted
      ? Math.floor((currentDate - lastCompleted) / (1000 * 60 * 60 * 24))
      : null;
  
    // Determine the new streak
    let newStreak = habitData.streak || 0;
    if (dayDifference === 1) {
      // If the difference is 1 day, increment the streak
      newStreak += 1;
    } else if (dayDifference !== 0) {
      // If the difference is not 0 or 1 day, reset the streak
      newStreak = 1;
    }
  
    // Update the habit document
    await updateDoc(habitRef, {
      lastCompleted: currentDate,
      streak: newStreak,
    });
  
    // Refresh the habits list
    fetchHabits(user.uid);
  };
  

  const deleteHabit = async (habitId) => {
    // Get a reference to the habit document
    const habitRef = doc(db, 'habits', habitId);
  
    // Delete the habit document
    await deleteDoc(habitRef);
  
    // Optionally, you can also delete the habit streak associated with this habit
    // ...
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
              {/* <habit.icon className="w-6 h-6 text-gray-400" /> */}
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
    <ul className="space-y-2">
      {habits.map((habit) => (
        <li
          key={habit.id}
          onClick={() => updateHabitStreak(habit.id)}
          className={`p-3 bg-gray-100 border border-gray-200 rounded flex justify-between items-center cursor-pointer`}
        >
          <span className="text-black font-semibold">{habit.title}</span>
          <span className="text-black font-semibold">{habitStreaks[habit.id] || 0} days           <button onClick={() => deleteHabit(habit.id)} className="text-red-100 focus:outline-none hover:text-red-500">
            <FiTrash2 size={18} />
          </button></span>
        </li>
      ))}
    </ul>
  </div>
);
}
