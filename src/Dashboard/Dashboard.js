import React from 'react'
import { auth } from '../Firebase'
import { useNavigate } from 'react-router-dom'

//this is a dashboard component for when a user is logged in
export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        navigate('/test')
      }
    })
  }
  , [navigate])

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{user ? user.email : 'No user'}</p>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  )
}
