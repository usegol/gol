import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { gapi } from 'gapi-script';
 

async function createEvent(event, timeZone) {
    const response = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: {
        summary: event.title,
        start: {
          dateTime: event.start,
          timeZone: timeZone,
        },
        end: {
          dateTime: event.end,
          timeZone: timeZone,
        },
      },
    });
    console.log(response);
  }

  async function generateEvents(prompt) {
    const response = await fetch(`https://api.openai.com/v1/engines/davinci-codex/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,

      },
      body: JSON.stringify({
        prompt: `${prompt}`,
        max_tokens: 100,
        temperature: 0.7,
        n: 5,
        stop: ['\n'],
      }),
    });
  
    const data = await response.json();
  
    if (!data.choices || data.choices.length === 0) {
      console.error('Invalid API response or no event choices found.');
      return [];
    }
  
    const events = data.choices[0].text.split('\n').filter((event) => event !== '');
    return events.map((event) => ({
      title: event,
      start: moment().add(Math.floor(Math.random() * 7), 'days').toDate(),
      end: moment().add(Math.floor(Math.random() * 7) + 1, 'days').toDate(),
    }));
  }
  

  
//   async function generateEvents(prompt) {
//     const response = await fetch(`https://api.openai.com/v1/engines/davinci-codex/completions`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//       },

//       body: JSON.stringify({
//         prompt: `${prompt}`,
//         max_tokens: 100,
//         temperature: 0.7,
//         n: 5,
//         stop: ['\n'],
//       }),
//     });
    
//     const data = await response.json();
  
//     if (!data.choices || data.choices.length === 0) {
//       console.error('Invalid API response or no event choices found.');
//       return [];
//     }
  
//     const events = data.choices[0].text.split('\n').filter((event) => event !== '');
//     return events.map((event) => ({
//       title: event,
//       start: moment().add(Math.floor(Math.random() * 7), 'days').toDate(),
//       end: moment().add(Math.floor(Math.random() * 7) + 1, 'days').toDate(),
//     }));
//   }
  
 
export function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar.events',
      }).then(() => {
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          fetchEvents();
        } else {
          gapi.auth2.getAuthInstance().signIn();
        }
      });
    });
  }, []);

  const fetchEvents = async () => {
    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.result.items.map((event) => ({
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      title: event.summary,
      id: event.id,
    }));

    setEvents(events);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleGenerateEvents = async () => {
    const generatedEvents = await generateEvents(prompt);
    generatedEvents.forEach(async (event) => {
      await createEvent(event);
    });
    fetchEvents();
  };

  return (
    <>
      <div>
        <input type="text" value={prompt} onChange={handlePromptChange} />
        <button onClick={handleGenerateEvents}>Generate Events</button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </>
  );
};

 
const localizer = momentLocalizer(moment);


export default MyCalendar;