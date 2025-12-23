import { Link, useLocation, useNavigate } from 'react-router-dom'
import UserMenu from './UserMenu'
import instagramIcon from '../assets/svgs/instagram.svg'
import discordIcon from '../assets/svgs/discord.svg'
import './Header.css'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  // Helper function to determine if current page matches the button
  const isCurrentPage = (path) => location.pathname === path
  
  const handleBrandClick = (e) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="header">
      <div className="header-left">
        <div className="social-icons">
          <a 
            href="https://instagram.com" 
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
            href="https://discord.com" 
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
        <UserMenu />
      </div>
    </div>
  )
}

export default Header