import React, { useState, useEffect } from 'react';
import { auth, db } from '../Firebase';
import { useNavigate, Link } from 'react-router-dom';
import CreateGoal from './CreateGoal';

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

  const fetchGoals = async (userId) => {
    try {
      const goalsSnapshot = await db
        .collection('goals')
        .where('userId', '==', userId)
        .get();
  
      if (goalsSnapshot.empty) {
        console.log('No goals found.');
        return;
      }
  
      const goalsData = goalsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(goalsData);
      console.log('Fetched goals: ', goalsData);
    } catch (error) {
      console.error('Error fetching goals: ', error);
    }
  };
  

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{user ? user.email : 'No user'}</p>
      <button onClick={() => auth.signOut()}>Sign Out</button>
      <div>
        <h2>Active Goals</h2>
        {goals.map((goal) => (
          <div key={goal.id}>
            <h3>
              <Link to={`/goal/${goal.id}`}>{goal.title}</Link>
            </h3>
            {/* Replace '50' with the actual completion percentage */}
            <p>Completion: 50%</p>
            {/* Replace '10' with the actual days remaining */}
            <p>Days remaining: 10</p>
          </div>
        ))}
      </div>
      <div>
        <h2>Create a New Goal</h2>
        <Link to="/create-goal">Create Goal</Link>

      </div>
      {/* Add the other dashboard components (e.g., graphs, charts, social features, etc.) here */}
    </div>
  );
}


// import React, { useState, useEffect } from 'react';
// import { db } from '../Firebase';
// import { collection, query, where, onSnapshot } from 'firebase/firestore';
// import { Link } from 'react-router-dom';

// export default function Dashboard({ user }) {
//   const [goals, setGoals] = useState([]);

//   useEffect(() => {
//     if (user) {
//       const q = query(collection(db, 'goals'), where('userId', '==', user.uid));
//       const unsubscribe = onSnapshot(q, (querySnapshot) => {
//         const goalsData = [];
//         querySnapshot.forEach((doc) => {
//           goalsData.push({ id: doc.id, ...doc.data() });
//         });
//         setGoals(goalsData);
//       });

//       return () => unsubscribe();
//     }
//   }, [user]);

//   return (
//     <div>
//       <h2>Welcome, {user.displayName}</h2>
//       <div>
//         <h3>Active Goals</h3>
//         <ul>
//           {goals.map((goal) => (
//             <li key={goal.id}>
//               <Link to={`/goal/${goal.id}`}>{goal.title}</Link>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <Link to="/create-goal">Create New Goal</Link>
//     </div>
//   );
// }