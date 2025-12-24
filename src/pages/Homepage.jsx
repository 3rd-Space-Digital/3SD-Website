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

      {/* Text elements */}
      <div className="homepage-text homepage-text-1">
        What is<br />3rd Space Digital?
      </div>
      
      <div className="homepage-text homepage-text-2">
        <div className="text-section-1">3rd Space Digital</div>
        <div className="text-section-2">Noun</div>
        <div className="text-section-3">A social events organization and visual arts editorial made by and for creatives</div>
      </div>
    </main>
  )
}

export default Homepage