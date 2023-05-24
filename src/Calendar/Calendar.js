import React, { useEffect, useState } from 'react';
import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import { Disclosure, Menu } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { generateEventsFromPrompt } from '../api/gpt4.js'; // Replace this with your GPT-4 API call function
import { createEvent } from '../api/googleCalendar'; // Replace this with your Google Calendar API call function
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Mixpanel } from '../Mixpanel';

const localizer = momentLocalizer(moment);

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: false },
    { name: 'Calendar', href: '/calendar', current: true },
    { name: 'Journal', href: '/journal', current: false },
    // { name: 'Projects', href: '#', current: false },
  ]

const UserCalendar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userPrompt, setUserPrompt] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [events, setEvents] = useState([]);

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

    useEffect(() => {
        const initClient = async () => {
            await window.gapi.client.init({
                apiKey: process.env.REACT_APP_GOOGLE_API_KEY, // Replace with your Google API key
                clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID, // Replace with your Google OAuth client ID
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                scope: 'https://www.googleapis.com/auth/calendar',
            });
            window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
        };

        if (window.gapi) {
            window.gapi.load('client:auth2', initClient);
        }
    }, [navigate]);

    const updateSigninStatus = (isSignedIn) => {
        setIsAuthenticated(isSignedIn);
        if (isSignedIn) {
            fetchEvents();
        }
    };

    const fetchEvents = async () => {
      const authInstance = window.gapi.auth2.getAuthInstance();
      const currentUser = authInstance.currentUser.get();
      const accessToken = currentUser.getAuthResponse().access_token;
      const calendarId = currentUser.getBasicProfile().getEmail();
  
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      });
  
      const data = await response.json();
      console.log(data); // Log the raw data
  
      // Transform the events into the format expected by react-big-calendar
      const transformedEvents = data.items.map((item) => ({
          title: item.summary,
          start: new Date(item.start.dateTime || item.start.date),
          end: new Date(item.end.dateTime || item.end.date),
      }));
  
      console.log(transformedEvents); // Log the transformed events
  
      setEvents(transformedEvents);
  };
  

    const handleCreateEventsFromPrompt = async () => {
      if (!userPrompt) {
          alert('Please enter a prompt');
          return;
      }

      const gptResponse = await generateEventsFromPrompt(userPrompt);
      if (!gptResponse) {
          alert('Error generating events from the prompt');
          return;
      }

      const parsedEvents = JSON.parse(gptResponse);

      const authInstance = window.gapi.auth2.getAuthInstance();
      const currentUser = authInstance.currentUser.get();
      const accessToken = currentUser.getAuthResponse().access_token;
      const calendarId = currentUser.getBasicProfile().getEmail();

      for (const eventData of parsedEvents) {
          await createEvent(eventData, calendarId, accessToken);
      }

      Mixpanel.track('User Entered Calendar Prompt');
      alert('Events created successfully');
      setUserPrompt('');
      fetchEvents(); // Fetch events again after creating new ones
  };

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
                                  <button
                                            onClick={() => {
                                                localStorage.removeItem('rememberMe');
                                                auth.signOut();
                                            }}
                                            className="bg-black text-white px-4 py-2 rounded"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </Disclosure>

                <div className="py-10">
                    <header>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                                Calendar
                            </h1>
                        </div>
                    </header>
                    <main>
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <div className="container mx-auto mt-10 p-4">
                                <h1 className="text-3xl mb-2 text-left font-bold">Create Events with AI</h1>
                                <input
                                    type="text"
                                    value={userPrompt}
                                    onChange={(e) => setUserPrompt(e.target.value)}
                                    placeholder="Enter a prompt"
                                    className="w-full p-2 border border-gray-300 rounded mb-4"
                                />
                                <button onClick={handleCreateEventsFromPrompt} className="bg-black text-white px-4 py-2 rounded">
                                    Create Events
                                </button>
                                <div className="mt-8">
                                    <div style={{ height: 500 }}>
                                        <Calendar
                                            localizer={localizer}
                                            events={events}
                                            startAccessor="start"
                                            endAccessor="end"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }
};

export default UserCalendar;