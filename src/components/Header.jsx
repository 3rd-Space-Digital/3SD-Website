import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import UserMenu from './UserMenu'
import instagramIcon from '../assets/svgs/instagram.svg'
import discordIcon from '../assets/svgs/discord.svg'
import cameraIcon from '../assets/svgs/camera.svg'
import './Header.css'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isCurrentPage = (path) => location.pathname === path
  
  const handleBrandClick = (e) => {
    e.preventDefault()
    navigate('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="header">
      <div className="header-left">
        <div className="social-icons">
          <a 
            href="https://www.instagram.com/3rdspacedigital/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon-link"
          >
            <img 
              src={instagramIcon} 
              alt="Instagram" 
              className="social-icon social-icon-instagram"
            />
          </a>
          <a 
            href="https://discord.gg/yT8u83Ga" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon-link"
          >
            <img 
              src={discordIcon} 
              alt="Discord" 
              className="social-icon social-icon-discord"
            />
          </a>
          <Link 
            to="/archive"
            className="social-icon-link"
          >
            <img 
              src={cameraIcon} 
              alt="Archive" 
              className="social-icon social-icon-camera"
            />
          </Link>
        </div>
      </div>
      
      <div className="header-center">
        <div className="brand-name-link" onClick={handleBrandClick}>
          <div className="brand-name">
            3rdSpaceDigital
          </div>
        </div>
      </div>
      
      <div className="header-right">
        {/* Desktop Navigation - visible above breakpoint */}
        <div className="desktop-nav">
          <Link to="/issues">
            <button className={isCurrentPage('/issues') ? "current-page-button" : "category-header-button"}>
              Issues
            </button>
          </Link>
          
          <Link to="/events">
            <button className={isCurrentPage('/events') ? "current-page-button" : "category-header-button"}>
              Events
            </button>
          </Link>
          
          <Link to="/contact-us">
            <button className={isCurrentPage('/contact-us') ? "current-page-button" : "category-header-button"}>
              Contact Us
            </button>
          </Link>
        </div>

        {/* Hamburger Menu Button - visible at breakpoint */}
        <button 
          className="hamburger-menu-button"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <i className={isMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
        </button>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="mobile-nav-dropdown">
            <Link to="/issues" onClick={closeMenu}>
              <button className={isCurrentPage('/issues') ? "mobile-nav-item current" : "mobile-nav-item"}>
                Issues
              </button>
            </Link>
            
            <Link to="/events" onClick={closeMenu}>
              <button className={isCurrentPage('/events') ? "mobile-nav-item current" : "mobile-nav-item"}>
                Events
              </button>
            </Link>
            
            <Link to="/contact-us" onClick={closeMenu}>
              <button className={isCurrentPage('/contact-us') ? "mobile-nav-item current" : "mobile-nav-item"}>
                Contact Us
              </button>
            </Link>
          </div>
        )}

        <UserMenu />
      </div>
    </div>
  )
}

export default Header