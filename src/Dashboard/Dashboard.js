import React, { useState, useEffect } from 'react';
import { auth, db } from '../Firebase';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { ColorPicker } from './CreateGoal';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [showCompletedGoals, setShowCompletedGoals] = useState(false);
  const [filteredGoals, setFilteredGoals] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchGoals(user.uid);
      } else {
        navigate('/login');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  const snapshotToGoals = (setter) => (querySnapshot) => {
    const goalsData = [];
    querySnapshot.forEach((doc) => {
      goalsData.push({ id: doc.id, ...doc.data() });
    });
    setter(goalsData);
  };

  const filterGoalsByColor = (color) => {
    if (color) {
      setFilteredGoals(goals.filter((goal) => goal.color === color));
    } else {
      setFilteredGoals(goals);
    }
  };

  const fetchGoals = (userId) => {
    const q = query(collection(db, 'goals'), where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const activeGoalsData = [];
      const completedGoalsData = [];

      querySnapshot.forEach((doc) => {
        const goalData = { id: doc.id, ...doc.data() };

        if (goalData.completed) {
          completedGoalsData.push(goalData);
        } else {
          activeGoalsData.push(goalData);
        }
      });

      setGoals(activeGoalsData);
      setFilteredGoals(activeGoalsData);
      setCompletedGoals(completedGoalsData);
    });

    return () => unsubscribe();
  };

  const markGoalAsCompleted = async (goalId) => {
    await updateDoc(doc(db, 'goals', goalId), {
      completed: true,
      completedAt: new Date()
    });
  };

  const toggleCompletedGoals = () => {
    setShowCompletedGoals(!showCompletedGoals);
  };

  const resetFilter = () => {
    setFilteredGoals(goals);
  };

  if (!user) {
    navigate('/login');
  } else {
    return (
      <div className="min-h-screen bg-gray-100 font-inter">
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <img src='./assets/logo.png' alt="Logo" className="h-8" />
            <button
              onClick={() => {
                localStorage.removeItem('rememberMe');
                auth.signOut();
              }}
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
                <div className="mb-4 flex items-bottom">
                  <div>
                    <label className="block text-gray-700 mb-2">Filter by Color</label>
                    <ColorPicker onSelect={filterGoalsByColor} />
                  </div>
                  <button
                    onClick={resetFilter}
                    className="ml-4 w-6 h-6 bg-gray-200 text-white flex items-center justify-center rounded-full hover:bg-gray-950"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ul className="space-y-2">
                  {filteredGoals.map((goal) => (
                    <li
                      key={goal.id}
                      onClick={() => navigate(`/goal/${goal.id}`)}
                      className="p-3 bg-gray-100 border border-gray-200 rounded flex justify-between items-center"
                    >
                      <div
                        className="w-4 h-full mr-4"
                        style={{ backgroundColor: goal.color }}
                      ></div>
                      <Link
                        to={`/goal/${goal.id}`}
                        className="text-black font-semibold flex-grow"
                      >
                        {goal.title}
                      </Link>
                      <button
                        onClick={() => markGoalAsCompleted(goal.id)}
                        className="bg-gray-300 text-white w-8 h-8 rounded-md flex items-center justify-center hover:bg-green-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                        </svg>
                      </button>

                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 mb-4">
              <button
                onClick={toggleCompletedGoals}
                className="bg-black text-white px-4 py-2 rounded"
              >
                {showCompletedGoals ? "Hide" : "View Completed Goals"}
              </button>
            </div>
            {showCompletedGoals && (
              <div className="col-span-1 md:col-span-2">
                <div className="bg-white p-6 rounded shadow">
                  <h3 className="text-lg font-semibold mb-4">Completed Goals</h3>
                  <ul className="space-y-2">
                    {completedGoals.map((goal) => (
                      <li
                        key={goal.id}
                        className="p-3 bg-gray-100 border border-gray-200 rounded"
                        onClick={() => navigate(`/goal/${goal.id}`)}
                      >
                        <div
                          className="w-4 h-full mr-4"
                          style={{ backgroundColor: goal.color }}
                        ></div>
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
            )}
          </div>
        </main>
        <Link
          to="/create-goal"
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </Link>
      </div>
    );
  }
  return null;
}

