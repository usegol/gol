import React, { useState, useEffect } from 'react';
import { auth, db } from '../Firebase';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchGoals(user.uid);
      } else {
        navigate('/test');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  const fetchGoals = (userId) => {
    const q = query(collection(db, 'goals'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const goalsData = [];
      querySnapshot.forEach((doc) => {
        goalsData.push({ id: doc.id, ...doc.data() });
      });
      setGoals(goalsData);
    });

    return () => unsubscribe();
  };

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
          <h2 className="text-2xl font-semibold">Welcome to Gol</h2>
          <p className="text-gray-600">Track your goals and habits, and achieve success.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Active Goals</h3>
              <ul className="space-y-2">
                {goals.map((goal) => (
                  <li
                    key={goal.id}
                    className="p-3 bg-gray-100 border border-gray-200 rounded"
                    onClick={() => navigate(`/goal/${goal.id}`)}
                  >
                    <Link
                      to={`/goal/${goal.id}`}
                      className="text-black font-semibold hover:underline"
                    >
                      {goal.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-span-1">
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Create New Goal</h3>
              <Link
                to="/create-goal"
                className="bg-black text-white px-4 py-2 rounded"
              >
                Create Goal
              </Link>
            </div>
          </div>
          {/* Additional components such as graphs, charts, and social features can be added here */}
        </div>
        </main>
        </div>
  );
}

