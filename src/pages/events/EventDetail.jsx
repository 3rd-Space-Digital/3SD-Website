import { useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { eventComponents } from '../../config/eventComponents'

function EventDetail() {
  const { id } = useParams()
  const location = useLocation()
  const [EventComponent, setEventComponent] = useState(null)
  
  // Get metadata from route state (passed from EventsPage) or use ID
  const metadata = location.state || { id: parseInt(id) }

  useEffect(() => {
    async function loadComponent() {
      const eventId = parseInt(id)
      
      // Load the component for this event ID
      if (eventComponents[eventId]) {
        const module = await eventComponents[eventId]()
        setEventComponent(() => module.default)
      } else {
        console.warn(`No component found for event ID: ${eventId}`)
      }
    }

    loadComponent()
  }, [id])

  if (!EventComponent) return <div>Loading...</div>

  // Pass metadata (id, title, event_date) to the custom component
  return <EventComponent metadata={metadata} />
}

export default EventDetail
