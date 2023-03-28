import React from 'react'

export default function SignUp() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }
    try {
      setError('')
      setLoading(true)
      // signup(email, password)
    } catch {
      setError('Failed to create an account')
    }
    setLoading(false)
  }

  
  return (
    <form>
      <label htmlFor='email'>Email</label>
      <input type='email' name='email' id='email' />
      <label htmlFor='password'>Password</label>
      <input type='password' name='password' id='password' />
      <label htmlFor='confirm-password'>Confirm Password</label>
      <input type='password' name='confirm-password' id='confirm-password' />
      <button type='submit'>Sign Up</button>
    </form>
  )
}
