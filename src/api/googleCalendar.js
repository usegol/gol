import axios from 'axios';

export async function createEvent(eventData, calendarId, accessToken) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const event = {
    summary: eventData.title,
    start: {
      dateTime: eventData.date,
      timeZone: userTimeZone,
    },
    end: {
      dateTime: eventData.date,
      timeZone: userTimeZone,
    },
  };

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    await axios.post(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      event,
      config
    );
    console.log('Event created successfully:', eventData);
  } catch (error) {
    console.error('Error creating event:', error);
  }
}
