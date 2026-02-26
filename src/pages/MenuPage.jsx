import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import instagramIcon from '../assets/svgs/instagram.svg'
import discordIcon from '../assets/svgs/discord.svg'
import logoIcon from '../assets/svgs/3SD.svg'
import './MenuPage.css'

function MenuPage({ onClose }) {
  const navigate = useNavigate()
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      if (onClose) onClose()
      else navigate(-1)
    }, 300) // Match animation duration
  }

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, navigate])

  return (
    <main className={`menu-page ${isClosing ? 'menu-page--closing' : ''}`} role="dialog" aria-label="Navigation menu">
      <div
        className="menu-page-overlay"
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Escape' && handleClose()}
        role="button"
        tabIndex={0}
        aria-label="Close menu"
      />
      <div className="menu-panel" onClick={(e) => e.stopPropagation()}>
        <div className="menu-page-inner">
        <header className="menu-header">
          <button
            type="button"
            className="menu-close-button"
            onClick={handleClose}
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </header>

        <section className="menu-section">
          <h2 className="menu-section-title">Socials</h2>
          <div className="menu-section-icons">
            <a
              href="https://www.instagram.com/3rdspacedigital/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img src={instagramIcon} alt="" className="menu-icon-instagram" />
            </a>
            <a
              href="https://discord.gg/C3UeEJfjW9"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <img src={discordIcon} alt="" className="menu-icon-discord" />
            </a>
          </div>
        </section>

        <section className="menu-section">
          <Link to="/account" className="menu-section-link" onClick={handleClose}>
            <h2 className="menu-section-title">Account</h2>
          </Link>
        </section>

        <section className="menu-section">
          <Link to="/events" className="menu-section-link" onClick={handleClose}>
            <h2 className="menu-section-title">Events</h2>
          </Link>
        </section>

        <section className="menu-read-content">
          <div>
            <Link to="/issues" className="menu-section-link" onClick={handleClose}>
              <h2 className="menu-section-title menu-read-title">Read</h2>
            </Link>
            <div className="menu-read-columns">
              <div className="menu-read-item">
                <Link to="/issues" onClick={handleClose}>articles</Link>
              </div>
              <div className="menu-read-item">
                <Link to="/interviews" onClick={handleClose}>interviews</Link>
              </div>
              <div className="menu-read-item">
                <Link to="/projects" onClick={handleClose}>projects</Link>
              </div>
              <div className="menu-read-item">
                <Link to="/artists" onClick={handleClose}>artists</Link>
              </div>
              <div className="menu-read-item">
                <Link to="/music" onClick={handleClose}>music</Link>
              </div>
              <div className="menu-read-item">
                <Link to="/read" onClick={handleClose}>show all...</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="menu-section">
          <Link to="/archive" className="menu-section-link" onClick={handleClose}>
            <h2 className="menu-section-title menu-section-title-italic">Photo Archives</h2>
          </Link>
        </section>

        <section className="menu-section">
          <Link to="/playlist" className="menu-section-link" onClick={handleClose}>
            <h2 className="menu-section-title menu-section-title-italic">The Playlist</h2>
          </Link>
        </section>

        <footer className="menu-footer">
          <img src={logoIcon} alt="" className="menu-footer-logo" aria-hidden="true" />
          <img src={logoIcon} alt="" className="menu-footer-logo" aria-hidden="true" />
          <img src={logoIcon} alt="" className="menu-footer-logo" aria-hidden="true" />
        </footer>
        </div>
      </div>
    </main>
  )
}

export default MenuPage
