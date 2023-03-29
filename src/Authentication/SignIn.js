import React from 'react'


export default function SignIn() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      // signin(email, password)
    } catch {
      setError('Failed to sign in')
    }
    setLoading(false)
  }


  return (

    <form>
      <label htmlFor='email'>Email</label>
      <input type='email' name='email' id='email' />
      <label htmlFor='password'>Password</label>
      <input type='password' name='password' id='password' />
      <button type='submit'>Sign In</button>
    </form>
  )
}
