import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getEventById, getEventImages } from '../../utils/eventUtils'
import './EventDetail.css'

function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getEventById(id)
      setEvent(data)
      const imgs = await getEventImages(id)
      setImages(imgs)
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
      <h1 className="event-detail-title">{event.title}</h1>
      <p className="event-detail-date">
        {new Date(event.date).toLocaleDateString(undefined, {
          dateStyle: 'long'
        })}
      </p>
      {event.description && (
        <p className="event-detail-description">{event.description}</p>
      )}
      {images.length > 0 && (
        <div className="event-detail-images">
          {images.map((img, i) => (
            <img key={img.name} src={img.url} alt="" />
          ))}
        </div>
      )}
    </div>
  )
}

export default EventDetail
