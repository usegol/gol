import React from 'react';
import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';

// Dashboard component is displayed when a user is logged in
export default function Dashboard() {
  // Declare state variables and hooks
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  // React useEffect hook to handle user authentication state changes
  React.useEffect(() => {
    // Add a listener for authentication state changes
    auth.onAuthStateChanged((user) => {
      if (user) {
        // If user is logged in, set the user state
        setUser(user);
      } else {
        // If user is not logged in, navigate to '/test' route
        navigate('/test');
      }
    });
  }, [navigate]); // Dependency array with navigate

  // Render the dashboard component
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Display the user's email if logged in, otherwise display 'No user' */}
      <p>{user ? user.email : 'No user'}</p>
      {/* Add a button to sign out the user */}
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
}
