import React, { useState, useEffect } from 'react';
import { db, auth } from '../Firebase';
import { collection, addDoc, Timestamp, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Mixpanel } from '../Mixpanel';
// Add the ColorPicker component
function ColorPicker({ onSelect }) {
  const colors = ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#9333EA', '#FB7185', '#65A30D'];
  const [selectedColor, setSelectedColor] = useState('');

  const handleColorSelection = (color) => {
    setSelectedColor(color);
    onSelect(color);
  };

  return (
    <div className="flex space-x-2">
      {colors.map((color, index) => (
        <button
          key={index}
          onClick={() => handleColorSelection(color)}
          className={`w-6 h-6 rounded-full border-2 ${
            color === selectedColor ? 'border-black' : 'border-white'
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl: './assets/user.png'
}
const navigation = [
  // { name: 'Dashboard', href: '#', current: true },
  // { name: 'Team', href: '#', current: false },
  // { name: 'Projects', href: '#', current: false },
  // { name: 'Calendar', href: '#', current: false },
]
const userNavigation = [
  // { name: 'Your Profile', href: '#' },
  // { name: 'Settings', href: '#' },
  { name: 'Sign out', onclick: () => { localStorage.removeItem('rememberMe');
  auth.signOut();}},
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


function CreateGoal() {
  const [goalTitle, setGoalTitle] = useState('');
  const [goalType, setGoalType] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalMotivation, setGoalMotivation] = useState('');
  const [goalHabits, setGoalHabits] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [goalColor, setGoalColor] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');
  const [activeGoals, setActiveGoals] = useState();


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch active goals when user is authenticated
        const fetchActiveGoals = () => {
          const q = query(collection(db, 'goals'), where('userId', '==', currentUser.uid));

          const unsubscribeGoals = onSnapshot(q, (querySnapshot) => {
            let activeGoalsCount = 0;

            querySnapshot.forEach((doc) => {
              const goalData = { id: doc.id, ...doc.data() };

              if (!goalData.completed) {
                activeGoalsCount++;
              }
            });

            setActiveGoals(activeGoalsCount);
          });

          return () => unsubscribeGoals();
        };

        fetchActiveGoals();
      } else {
        setUser(null);
        setActiveGoals(0); // Reset active goals count when user logs out
      }
    });

    // Clean up the listener when the component is unmounted
    return () => {
      unsubscribeAuth();
    };
}, []);


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (activeGoals >= 3) {
      navigate('/subscribe');
      return;
    }
 
    try {
      await addDoc(collection(db, 'goals'), {
        userId: user.uid,
        title: goalTitle,
        description: goalDescription,
        progress: 0,
        deadline: Timestamp.fromDate(new Date(goalDeadline)),
        color: goalColor,
        goalType: goalType,
        goalMotivation: goalMotivation,
        goalHabits: goalHabits,
        heightFt: goalType === 'fitness' ? heightFt : null,
        heightIn: goalType === 'fitness' ? heightIn : null,
        weight: goalType === 'fitness' ? weight : null,
      });
      Mixpanel.track('Goal Created');
      console.log('Goal successfully added!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  if (!user) {
    navigate('/test');
    return null;
  } else {
    return (
      <div className="min-h-screen">
      <Disclosure as="nav" className="border-b border-gray-200 bg-white">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      className="block h-8 w-auto lg:hidden"
                      src='./assets/logo.png'
                      alt="Gol"
                    />
                    <img
                      className="hidden h-8 w-auto lg:block"
                      src='./assets/logo.png'
                      alt="Gol"
                    />
                  </div>
                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'border-green-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  {/* <button
                    type="button"
                    className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button> */}

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    {/* <div>
                      <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                      </Menu.Button>
                    </div> */}
                    {/* <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    > */}
                    <button
                        onClick={() => {
                        localStorage.removeItem('rememberMe');
                        auth.signOut();
                        }}
                        className="bg-black text-white px-4 py-2 rounded"
                    >
                        Sign Out
                    </button>
                      {/* <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                <button
                                    onClick={() => {
                                    localStorage.removeItem('rememberMe');
                                    auth.signOut();
                                    }}
                                    className=" text-black px-4 py-2 rounded text-center font-semibold hover:bg-green-500 hover:text-white transition duration-200 ease-in-out"
                                >
                                    Sign Out
                                </button>
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items> */}
                    {/* </Transition> */}
                  </Menu>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'border-green-500 bg-indigo-50 text-green-700'
                        : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                      'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1> */}
          </div>
        </header>
        <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <main className="container mx-auto mt-10 p-4">
            <main className="container mx-auto mt-10 p-4">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold">Create New Goal</h2>
                  <p className="text-gray-600">Set your goal and track your progress.</p>
                </div>
                <div className="bg-white p-6 rounded shadow">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Goal Title</label>
                      <input
                        type="text"
                        value={goalTitle}
                        onChange={(e) => setGoalTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Goal Type</label>
                        <select
                          value={goalType}
                          onChange={(e) => setGoalType(e.target.value)}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Select Goal Type</option>
                          <option value="fitness">Fitness</option>
                          <option value="productivity">Productivity</option>
                          <option value="wellness">Wellness</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      {goalType === 'fitness' && (
                        <>
                          <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Height (ft)</label>
                            <input
                              type="number"
                              value={heightFt}
                              onChange={(e) => setHeightFt(e.target.value)}
                              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Height (in)</label>
                            <input
                              type="number"
                              value={heightIn}
                              onChange={(e) => setHeightIn(e.target.value)}
                              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Weight (lbs)</label>
                            <input
                              type="number"
                              value={weight}
                              onChange={(e) => setWeight(e.target.value)}
                              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </>
                      )}
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Goal Description</label>
                        <textarea
                          value={goalDescription}
                          onChange={(e) => setGoalDescription(e.target.value)}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Goal Deadline</label>
                        <input
                          type="date"
                          value={goalDeadline}
                          onChange={(e) => setGoalDeadline(e.target.value)}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Motivation</label>
                        <textarea
                          value={goalMotivation}
                          onChange={(e) => setGoalMotivation(e.target.value)}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Habits/Actions</label>
                        <textarea
                          value={goalHabits}
                          onChange={(e) => setGoalHabits(e.target.value)}
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                          ></textarea>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2">Goal Color</label>
                          <ColorPicker onSelect={setGoalColor} />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
                          >
                            Create Goal
                          </button>
                        </div>
                      </form>
                    </div>
              </main>
            </main>
            </div>
        </main>
      </div>
      </div>
        );
      }
    }
                       
export { CreateGoal as default, ColorPicker };
