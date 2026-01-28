import { Link } from 'react-router-dom'
import './EventsPage.css'

function EventsPage() {
  // ============================================
  // TEMPORARY HARDCODED DATA - REMOVE WHEN REAL EVENTS ARE IMPLEMENTED
  // ============================================
  // TODO: Replace this section with actual database fetch (DB-only, no per-event component files)
  // TODO: import { useState, useEffect } from 'react'
  // TODO: import { getAllEvents } from '../utils/eventUtils'
  // TODO: Remove all hardcoded event objects below
  
  const hardcodedUpcoming = [
    {
      id: 1,
      title: 'Summer Gallery Opening',
      event_date: '2024-07-15T18:00:00Z',
      description: 'A Third Space is a location that is neither one\'s home nor workplace and provides a safe space for relaxation and recreation.',
      thumbnailUrl: '/placeholder-thumbnail.jpg' // Will use getEventThumbnailUrl(id) later
    },
    {
      id: 2,
      title: 'Music Fest 2024',
      event_date: '2024-08-20T19:00:00Z',
      description: 'A Third Space is a location that is neither one\'s home nor workplace and provides a safe space for relaxation and recreation.',
      thumbnailUrl: '/placeholder-thumbnail.jpg'
    },
    {
      id: 3,
      title: 'Art Exhibition',
      event_date: '2024-09-10T17:00:00Z',
      description: 'A Third Space is a location that is neither one\'s home nor workplace and provides a safe space for relaxation and recreation.',
      thumbnailUrl: '/placeholder-thumbnail.jpg'
    }
  ]

  const hardcodedPast = [
    {
      id: 4,
      title: 'Spring Showcase',
      event_date: '2024-04-15T18:00:00Z',
      description: 'A Third Space is a location that is neither one\'s home nor workplace and provides a safe space for relaxation and recreation.',
      thumbnailUrl: '/placeholder-thumbnail.jpg'
    },
    {
      id: 5,
      title: 'Winter Gathering',
      event_date: '2024-01-20T19:00:00Z',
      description: 'A Third Space is a location that is neither one\'s home nor workplace and provides a safe space for relaxation and recreation.',
      thumbnailUrl: '/placeholder-thumbnail.jpg'
    }
  ]

  // ============================================
  // END OF TEMPORARY HARDCODED DATA
  // ============================================

  // TODO: Uncomment and use this code once real events are in the database:
  // const [events, setEvents] = useState([])
  // const [loading, setLoading] = useState(true)
  // useEffect(() => {
  //   getAllEvents().then(data => { setEvents(data); setLoading(false) })
  // }, [])
  // const now = new Date()
  // const upcoming = events.filter(e => new Date(e.event_date) >= now)
  // const past = events.filter(e => new Date(e.event_date) < now)

  // TEMPORARY: Using hardcoded data
  const upcoming = hardcodedUpcoming
  const past = hardcodedPast

  return (
    <div className="events-page">
      {/* Header */}
      <div className="events-header">
        <h1 className="events-title">Events</h1>
        <div className="events-search-icon">
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="events-section">
        <div className="events-section-divider">
          <span className="events-section-title">Upcoming</span>
        </div>
        <div className="events-grid">
          {upcoming.length > 0 ? (
            upcoming.map(event => (
              <Link 
                key={event.id} 
                to={`/events/${event.id}`}
                className="event-card"
              >
                <div className="event-image">
                  <img src={event.thumbnailUrl} alt={event.title} />
                </div>
                <h2 className="event-title">{event.title}</h2>
                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
              </Link>
            ))
          ) : (
            <p className="events-empty">No upcoming events</p>
          )}
        </div>
      </div>

      {/* Past Events Section */}
      <div className="events-section">
        <div className="events-section-divider">
          <span className="events-section-title">Past Events</span>
        </div>
        <div className="events-grid">
          {past.length > 0 ? (
            past.map(event => (
              <Link 
                key={event.id} 
                to={`/events/${event.id}`}
                className="event-card"
              >
                <div className="event-image">
                  <img src={event.thumbnailUrl} alt={event.title} />
                </div>
                <h2 className="event-title">{event.title}</h2>
                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
              </Link>
            ))
          ) : (
            <p className="events-empty">No past events</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventsPage
