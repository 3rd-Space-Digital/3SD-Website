import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getEventById } from '../../utils/eventUtils'
import { getArchiveFolders } from '../../utils/archiveUtils'
import './EventDetail.css'

function formatEventDate(d) {
  if (!d) return ''
  const date = new Date(d)
  const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${day} at ${time}`
}

function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [archiveFolderName, setArchiveFolderName] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getEventById(id)
      setEvent(data)
      
      if (data?.archive_folder_name) {
        const folders = await getArchiveFolders()
        const folderNames = new Set(folders.map(f => f.folderName.toLowerCase()))
        if (folderNames.has(data.archive_folder_name.toLowerCase())) {
          setArchiveFolderName(data.archive_folder_name)
        }
      }
      
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="event-detail event-detail-loading">Loading...</div>
  if (!event) return <div className="event-detail event-detail-error">Event not found</div>

  return (
    <div className="event-detail">
      <button type="button" className="event-detail-back" onClick={() => navigate('/events')}>
        ← Back to Events
      </button>

      <div className="event-detail-content">
        <div className="event-detail-left">
          <h1 className="event-detail-title">{event.title}</h1>
          <p className="event-detail-date">{formatEventDate(event.date)}</p>
          {event.location && (
            <p className="event-detail-location">{event.location}</p>
          )}
          <h2 className="event-detail-about-heading">About This Event</h2>
          {event.description && (
            <p className="event-detail-description">{event.description}</p>
          )}
        </div>

        <div className="event-detail-right">
          <div className="event-detail-poster-wrapper">
            {event.thumbnailUrl ? (
              <img
                src={event.thumbnailUrl}
                alt={event.title}
                className="event-detail-poster"
              />
            ) : (
              <div className="event-detail-poster-placeholder" />
            )}
          {archiveFolderName && (
            <Link 
              to={`/archive/${encodeURIComponent(archiveFolderName)}?fromEvent=${id}`}
              className="event-detail-archive-link"
            >
              View Archive
            </Link>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
