import React, {useState, useEffect} from 'react'
import NavigationBar from './NavigationBar'
import Footer from './Footer'

import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Mixpanel } from '../Mixpanel';
import { logEvent } from 'firebase/analytics';

const incentives = [
  {
    name: 'Set and personalize  your goals',
    imageSrc: './assets/flag-icon.svg',
    description: "Tailoring Objectives to Reflect Your Unique Aspirations and Lifestyle",
  },
  {
    name: 'Track your progress',
    imageSrc: './assets/progress-icon.svg',
    description: "Monitor and Evaluate Milestones to Stay Motivated and Agile",
  },
  {
    name: 'View your habit patterns',
    imageSrc: './assets/habit-patterns-icon.svg',
    description:
      "Analyze and Optimize Behavioral Trends for Sustainable Change",
  },
]


export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    logEvent(auth, 'Landing Page Viewed');
    Mixpanel.track('Landing Page Viewed');

    const checkAuthAndNavigate = (user) => {
      if (user && localStorage.getItem('rememberMe') === 'true') {
        logEvent(auth, 'User Signed In');
        Mixpanel.track('User Signed In')
        navigate('/dashboard');
      }
    };
  
    // Check the current user's authentication state and navigate if necessary
    checkAuthAndNavigate(auth.currentUser);
  
    // Set up a listener for future changes in the authentication state
    const unsubscribe = onAuthStateChanged(auth, checkAuthAndNavigate);
  
    // Clean up the subscription
    return () => {
      unsubscribe();
    };
  }, []);
  

  return (
    
    <div className="bg-white">
      <NavigationBar backgroundColor="white" />
      <div class="relative isolate pt-14">
        <svg class="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
          <defs>
            <pattern id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y="-1" class="overflow-visible fill-gray-50">
            <path d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z" stroke-width="0" />
          </svg>
          <rect width="100%" height="100%" stroke-width="0" fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
        </svg>
        <div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          <div class="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <div class="flex">
            </div>
            <h1 class="mt-10 max-w-lg text-4xl font-bold tracking-tight textColor-primary sm:text-6xl">Your Personal AI Assistant</h1>
            <p class="mt-6 text-lg leading-8 textColor-primary">Struggling with goals & habits? Stay motivated with our AI-powered habit tracker! Boost your success today.</p>
            <div class="mt-10 flex items-center gap-x-6">
              <a href="/signin" class="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Get started</a>
              <a href="/about" class="text-sm font-semibold leading-6 text-gray-900">Learn more <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div class="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            {/* <svg viewBox="0 0 366 729" role="img" class="mx-auto w-[22.875rem] max-w-full drop-shadow-xl">
              <title>App screenshot</title>
              <defs>
                <clipPath id="2ade4387-9c63-4fc4-b754-10e687a0d332">
                  <rect width="316" height="684" rx="36" />
                </clipPath>
              </defs>
              <path fill="#4B5563" d="M363.315 64.213C363.315 22.99 341.312 1 300.092 1H66.751C25.53 1 3.528 22.99 3.528 64.213v44.68l-.857.143A2 2 0 0 0 1 111.009v24.611a2 2 0 0 0 1.671 1.973l.95.158a2.26 2.26 0 0 1-.093.236v26.173c.212.1.398.296.541.643l-1.398.233A2 2 0 0 0 1 167.009v47.611a2 2 0 0 0 1.671 1.973l1.368.228c-.139.319-.314.533-.511.653v16.637c.221.104.414.313.56.689l-1.417.236A2 2 0 0 0 1 237.009v47.611a2 2 0 0 0 1.671 1.973l1.347.225c-.135.294-.302.493-.49.607v377.681c0 41.213 22 63.208 63.223 63.208h95.074c.947-.504 2.717-.843 4.745-.843l.141.001h.194l.086-.001 33.704.005c1.849.043 3.442.37 4.323.838h95.074c41.222 0 63.223-21.999 63.223-63.212v-394.63c-.259-.275-.48-.796-.63-1.47l-.011-.133 1.655-.276A2 2 0 0 0 366 266.62v-77.611a2 2 0 0 0-1.671-1.973l-1.712-.285c.148-.839.396-1.491.698-1.811V64.213Z" />
              <path fill="#343E4E" d="M16 59c0-23.748 19.252-43 43-43h246c23.748 0 43 19.252 43 43v615c0 23.196-18.804 42-42 42H58c-23.196 0-42-18.804-42-42V59Z" />
              <foreignObject width="316" height="684" transform="translate(24 24)" clip-path="url(#2ade4387-9c63-4fc4-b754-10e687a0d332)">
                <img src="https://tailwindui.com/img/component-images/mobile-app-screenshot.png" alt="" />
              </foreignObject>
            </svg> */}
          </div>
        </div>
      </div>
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-4xl font-bold tracking-tight text-black-900 sm:text-6xl">Here’s how it works</h2>
        <p class="mt-6 text-lg leading-8 text-black-600">Sign up now and start your journey towards developing positive habits and achieving your goals with our AI-powered habit tracker.</p>
      </div>

      <div className="mx-auto max-w-7xl py-24 sm:px-2 sm:py-32 lg:px-4">
        <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
            {incentives.map((incentive) => (
              <div key={incentive.name} className="sm:flex lg:block">
                <div className="sm:flex-shrink-0">
                  <img className="h-16 w-16" src={incentive.imageSrc} alt="" />
                </div>
                <div className="mt-4 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-sm font-medium text-black-900">{incentive.name}</h3>
                  <p className="mt-2 text-sm text-black-500">{incentive.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
