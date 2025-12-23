import { Link, useLocation, useNavigate } from 'react-router-dom'
import UserMenu from './UserMenu'
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
        <div className="logo-container">
          <img 
            className="logo" 
            src="/logo-placeholder.png" 
            alt="3rd Space Digital Logo"
            onError={(e) => {
              // Hide image and show placeholder if image doesn't exist
              e.target.style.display = 'none'
            }}
          />
          <div className="logo-placeholder"></div>
        </div>
        
        <Link to="/about">
          <button className={isCurrentPage('/about') ? "current-page-button" : "category-header-button"}>
            about
          </button>
        </Link>
        
        <Link to="/issues">
          <button className={isCurrentPage('/issues') ? "current-page-button" : "category-header-button"}>
            issues
          </button>
        </Link>
        
        <Link to="/contact">
          <button className={isCurrentPage('/contact') ? "current-page-button" : "category-header-button"}>
            contact
          </button>
        </Link>
      </div>
      
      <div className="header-center">
        <div className="brand-name-link" onClick={handleBrandClick}>
          <div className="brand-name">
            3rdSpaceDigital
          </div>
        </div>
      </div>
      
      <div className="header-right">
        <UserMenu />
      </div>
    </div>
  )
}

export default Header
