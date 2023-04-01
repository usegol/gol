import React from 'react'

// make this render a login page

export default function Login() {

    // hide the password
    // add a button to show the password
    // add a button to hide the password



    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            // signin(email, password)
        } catch {
            setError('Failed to sign in')
        }
        setLoading(false)
    }
    return (
 <div>

    <h1>Log In</h1>
    <form>
        <label htmlFor='email'>Email</label>
        <input type='email' name='email' id='email' />
        <label htmlFor='password'>Password</label>
        <input type='password' name='password' id='password' />
        <button type='submit'>Log In</button>
    </form>

 </div>
    )
}