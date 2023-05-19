import React, {useEffect, useState} from 'react'
import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

const users = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl: './assets/user.png'
  }
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: false },
    { name: 'Calendar', href: '/calendar', current: false },
    { name: 'Journal', href: '/journal', current: true },
    // { name: 'Projects', href: '#', current: false },
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

export default function Journal() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            setUser(user);
          } else {
            setUser(null);
            navigate('/test');
          }
        });
    
        return () => {
          unsubscribe();
        };
      }, [navigate]);

    if (!user) {
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

      <div >
        {/* <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header> */}
        <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <main className="container mx-auto mt-10 p-4">
                {/* <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold">Welcome to Gol</h2>
                    <p className="text-gray-600">Track your goals and habits, and achieve success.</p>
                </div> */}

            </main>
            </div>
        </main>
      </div>
    </div>
  )
}
}



// import React, {useEffect, useState} from 'react'
// import { auth } from '../Firebase';
// import { useNavigate } from 'react-router-dom';
// import { Fragment } from 'react'
// import { Disclosure, Menu, Transition } from '@headlessui/react'
// import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
// import Goals from './Goals';


// const users = {
//     name: 'Tom Cook',
//     email: 'tom@example.com',
//     imageUrl: './assets/user.png'
//   }
//   const navigation = [
//     { name: 'Dashboard', href: '/dashboard', current: false },
//     { name: 'Calendar', href: '/calendar', current: false },
//     { name: 'Journal', href: '/journal', current: true },
//     // { name: 'Projects', href: '#', current: false },
//   ]
//   const userNavigation = [
//     // { name: 'Your Profile', href: '#' },
//     // { name: 'Settings', href: '#' },
//     { name: 'Sign out', onclick: () => { localStorage.removeItem('rememberMe');
//     auth.signOut();}},
//   ]
  
//   function classNames(...classes) {
//     return classes.filter(Boolean).join(' ')
//   }



// export default function Journal() {
//     const navigate = useNavigate();
//     const [user, setUser] = useState(null);
//     const [journalEntry, setJournalEntry] = useState('');
//     const [generatedPrompts, setGeneratedPrompts] = useState([]);

// // Create a variable for goal
// const goal = 'Finish reading a book';

    
//     const handleJournalSubmit = (e) => {
//         e.preventDefault();
//         console.log(journalEntry);
//         setJournalEntry('');
//     }



    
//     const generatePrompts = () => {
//         const prompts = [
//             'What was the best part of your day?',
//             'What was the most challenging part of your day?',
//             'What did you learn today?',
//             'What are you grateful for today?',
//             'What are your goals for tomorrow?',
//             'What are you looking forward to tomorrow?',
//             'What is something you want to improve on?',
//             'What is something you did well today?',
//             'What is something you are proud of today?',
//             'What is something you struggled with today?',
//         ];

    

//       setGeneratedPrompts(prompts);
//     };


//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged((user) => {
//           if (user) {
//             setUser(user);
//           } else {
//             setUser(null);
//             navigate('/test');
//           }
//         });
    
//         return () => {
//           unsubscribe();
//         };
//       }, [navigate]);

//       return (
//     <div className="min-h-screen">
//       <Disclosure as="nav" className="border-b border-gray-200 bg-white">
//         {({ open }) => (
//           <>
//             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//               <div className="flex h-16 justify-between">
//                 <div className="flex">
//                   <div className="flex flex-shrink-0 items-center">
//                     <img
//                       className="block h-8 w-auto lg:hidden"
//                       src='./assets/logo.png'
//                       alt="Gol"
//                     />
//                     <img
//                       className="hidden h-8 w-auto lg:block"
//                       src='./assets/logo.png'
//                       alt="Gol"
//                     />
//                   </div>
//                   <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
//                     {navigation.map((item) => (
//                       <a
//                         key={item.name}
//                         href={item.href}
//                         className={classNames(
//                           item.current
//                             ? 'border-green-500 text-gray-900'
//                             : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
//                           'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
//                         )}
//                         aria-current={item.current ? 'page' : undefined}
//                       >
//                         {item.name}
//                       </a>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="hidden sm:ml-6 sm:flex sm:items-center">
//                   {/* <button
//                     type="button"
//                     className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                   >
//                     <span className="sr-only">View notifications</span>
//                     <BellIcon className="h-6 w-6" aria-hidden="true" />
//                   </button> */}

//                   {/* Profile dropdown */}
//                   <Menu as="div" className="relative ml-3">
//                     {/* <div>
//                       <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
//                         <span className="sr-only">Open user menu</span>
//                         <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
//                       </Menu.Button>
//                     </div> */}
//                     {/* <Transition
//                       as={Fragment}
//                       enter="transition ease-out duration-200"
//                       enterFrom="transform opacity-0 scale-95"
//                       enterTo="transform opacity-100 scale-100"
//                       leave="transition ease-in duration-75"
//                       leaveFrom="transform opacity-100 scale-100"
//                       leaveTo="transform opacity-0 scale-95"
//                     > */}
//                     <button
//                         onClick={() => {
//                         localStorage.removeItem('rememberMe');
//                         auth.signOut();
//                         }}
//                         className="bg-black text-white px-4 py-2 rounded"
//                     >
//                         Sign Out
//                     </button>
//                       {/* <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                         {userNavigation.map((item) => (
//                           <Menu.Item key={item.name}>
//                             {({ active }) => (
//                               <a
//                                 href={item.href}
//                                 className={classNames(
//                                   active ? 'bg-gray-100' : '',
//                                   'block px-4 py-2 text-sm text-gray-700'
//                                 )}
//                               >
//                                 <button
//                                     onClick={() => {
//                                     localStorage.removeItem('rememberMe');
//                                     auth.signOut();
//                                     }}
//                                     className=" text-black px-4 py-2 rounded text-center font-semibold hover:bg-green-500 hover:text-white transition duration-200 ease-in-out"
//                                 >
//                                     Sign Out
//                                 </button>
//                               </a>
//                             )}
//                           </Menu.Item>
//                         ))}
//                       </Menu.Items> */}
//                     {/* </Transition> */}
//                   </Menu>
//                 </div>
//                 <div className="-mr-2 flex items-center sm:hidden">
//                   {/* Mobile menu button */}
//                   <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
//                     <span className="sr-only">Open main menu</span>
//                     {open ? (
//                       <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
//                     ) : (
//                       <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
//                     )}
//                   </Disclosure.Button>
//                 </div>
//               </div>
//             </div>

//             <Disclosure.Panel className="sm:hidden">
//               <div className="space-y-1 pb-3 pt-2">
//                 {navigation.map((item) => (
//                   <Disclosure.Button
//                     key={item.name}
//                     as="a"
//                     href={item.href}
//                     className={classNames(
//                       item.current
//                         ? 'border-green-500 bg-indigo-50 text-green-700'
//                         : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
//                       'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
//                     )}
//                     aria-current={item.current ? 'page' : undefined}
//                   >
//                     {item.name}
//                   </Disclosure.Button>
//                 ))}
//               </div>
//               <div className="border-t border-gray-200 pb-3 pt-4">
//                 <div className="flex items-center px-4">
//                   <div className="flex-shrink-0">
//                     <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
//                   </div>
//                   <div className="ml-3">
//                     <div className="text-base font-medium text-gray-800">{user.name}</div>
//                     <div className="text-sm font-medium text-gray-500">{user.email}</div>
//                   </div>
//                   <button
//                     type="button"
//                     className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                   >
//                     <span className="sr-only">View notifications</span>
//                     <BellIcon className="h-6 w-6" aria-hidden="true" />
//                   </button>
//                 </div>
//                 <div className="mt-3 space-y-1">
//                   {userNavigation.map((item) => (
//                     <Disclosure.Button
//                       key={item.name}
//                       as="a"
//                       href={item.href}
//                       className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
//                     >
//                       {item.name}
//                     </Disclosure.Button>
//                   ))}
//                 </div>
//               </div>
//             </Disclosure.Panel>
//           </>
//         )}
//       </Disclosure>

//       <div className="py-10">
//         <header>
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
//           </div>
//         </header>
//         <main>
//             <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//             <main className="container mx-auto mt-10 p-4">
//                 {/* <div className="text-center mb-8">
//                     <h2 className="text-2xl font-semibold">Welcome to Gol</h2>
//                     <p className="text-gray-600">Track your goals and habits, and achieve success.</p>
//                 </div> */}
//               <div className="min-h-screen bg-gray-100 font-inter p-4">
//               <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-2xl font-semibold mb-4">Journaling for Goal: {goal.title}</h2>
//                 <textarea
//                   placeholder="Write about your progress..."
//                   value={journalEntry}
//                   onChange={(e) => setJournalEntry(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded h-40"
//                 ></textarea>
//                 <button
//                   onClick={handleJournalSubmit}
//                   className="w-full py-2 mt-4 bg-gray-800 text-white font-semibold rounded"
//                 >
//                   Generate Prompts
//                 </button>
//                 {generatedPrompts.length > 0 && (
//                   <div className="mt-6 space-y-4">
//                     <h3 className="text-xl font-semibold mb-2">Personalized Prompts:</h3>
//                     <ul className="list-disc pl-6">
//                       {generatedPrompts.map((prompt, index) => (
//                         <li key={index}>{prompt}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//               </div>
//             </main>
//             </div>
//         </main>
//       </div>
//     </div>
//   )
// }
