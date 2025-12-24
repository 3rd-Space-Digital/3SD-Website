import { useState, useEffect } from 'react'
import { getImageUrl } from '../utils/supabaseImageRetrieval'
import './Homepage.css'

function Homepage() {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(null)

  useEffect(() => {
    const imageUrl = getImageUrl('homepage/background1.jpg')
    setBackgroundImageUrl(imageUrl)
  }, [])

  return (
    <main className="homepage">
      <div 
        className="homepage-background"
        style={{
          backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none'
        }}
      />
    </main>
  )
}

export default Homepage