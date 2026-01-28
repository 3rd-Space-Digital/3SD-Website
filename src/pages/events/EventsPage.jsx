import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getAllEvents } from '../../utils/eventUtils'
import './EventsPage.css'

function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef(null)

  useEffect(() => {
    getAllEvents().then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [searchOpen])

  const now = new Date()
  const q = searchQuery.trim().toLowerCase()
  const filtered = q
    ? events.filter((e) => e.title.toLowerCase().includes(q))
    : events
  const upcoming = filtered.filter((e) => new Date(e.date) >= now)
  const past = filtered.filter((e) => new Date(e.date) < now)

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
        <div className="events-search-wrapper">
          {searchOpen ? (
            <>
              <input
                ref={searchInputRef}
                type="text"
                className="events-search-input"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search events by title"
              />
              <button
                type="button"
                className="events-search-close"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="events-search-icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          )}
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
