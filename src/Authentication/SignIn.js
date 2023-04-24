import React from 'react'
import { Widget } from '@typeform/embed-react'
import NavigationBar from '../Landing Page/NavigationBar'
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();

  const handleTestClick = () => {
    navigate('/test');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-28 sm:px-6 lg:px-8">
      <NavigationBar backgroundColor="white" />
      <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Sign up for early access</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Since we are still in beta, we are only accepting a limited number of users. Sign up to be notified when we launch.
          </p>
        </div>
        <div className="flex justify-center">
          <button onClick={handleTestClick} className="mt-8 bg-black hover:bg-green-500 text-white font-bold py-2 px-4 rounded">
            Test what we have so far anyways
          </button>
        </div>
      </div>
      <Widget
        id="sbK7iUVS"
        className="typeform"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
