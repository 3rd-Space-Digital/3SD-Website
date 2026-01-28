import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllEvents } from '../../utils/eventUtils'
import './EventsPage.css'

function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllEvents().then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [])

  const now = new Date()
  const upcoming = events.filter((e) => new Date(e.date) >= now)
  const past = events.filter((e) => new Date(e.date) < now)

  if (loading) {
    return (
      <div className="events-page">
        <div className="events-loading">Loading events...</div>
      </div>
    )
  }

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
