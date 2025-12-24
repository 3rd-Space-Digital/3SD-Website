import { useState, useEffect } from 'react'
import { getImageUrl } from '../utils/supabaseImageRetrieval'
import logo from '../assets/svgs/3SD.svg'
import './Homepage.css'

function Homepage() {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(null)

  useEffect(() => {
    const imageUrl = getImageUrl('homepage/background2.jpg')
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
      <img src={logo} alt="3SD Logo" className="homepage-logo" />
    </main>
  )
}

export default Homepage