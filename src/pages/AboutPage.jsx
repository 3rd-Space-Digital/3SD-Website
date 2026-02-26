import { Link } from 'react-router-dom'
import './AboutPage.css'

function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-page-inner">
        <h1 className="about-page-title">About</h1>
        <p className="about-page-text">
          Third Space Digital is a platform for creative voices, community, and culture.
        </p>
        <Link to="/" className="about-page-back">← Back</Link>
      </div>
    </main>
  )
}

export default AboutPage
