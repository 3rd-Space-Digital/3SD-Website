import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './UserMenu.css'
import './Header.css'

function UserMenu() {
  const { user, signInWithGoogle, signOut, loading } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [imageError, setImageError] = useState(false)
  const buttonRef = useRef(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Sign in error:', error)
      alert('Failed to sign in. Please try again.')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setShowUserMenu(false)
      setImageError(false) // Reset error state on sign out
    } catch (error) {
      console.error('Sign out error:', error)
      alert('Failed to sign out. Please try again.')
    }
  }

  const handleToggleMenu = () => {
    if (!showUserMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      })
    }
    setShowUserMenu(!showUserMenu)
  }

  const handleClose = () => {
    setShowUserMenu(false)
  }

  useEffect(() => {
    if (showUserMenu) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          handleClose()
        }
      }
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [showUserMenu])

  if (loading) {
    return (
      <div className="user-menu">
        <button className="user-button" disabled>
          <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
          <span className="tooltip">Loading...</span>
        </button>
      </div>
    )
  }

  if (user) {
    // Get avatar URL
    const avatarUrl = user.user_metadata?.avatar_url || 
                      user.user_metadata?.picture || 
                      user.identities?.[0]?.identity_data?.avatar_url ||
                      user.identities?.[0]?.identity_data?.picture ||
                      null
    
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'User')}&background=random`
    
    // Use avatar URL if available, otherwise use fallback
    const displayUrl = avatarUrl || fallbackUrl
    const isFallback = !avatarUrl
    
    
    return (
      <>
        <div className="user-menu">
          <button 
            ref={buttonRef}
            className="user-button"
            onClick={handleToggleMenu}
          >
            {!imageError ? (
              <img 
                src={displayUrl}
                alt="User avatar"
                className="user-avatar"
                onError={(e) => {
                  console.error('Image failed to load:', displayUrl)
                  setImageError(true)
                  e.target.style.display = 'none'
                }}
              />
            ) : null}
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="user-icon-svg"
              style={{ display: imageError ? 'block' : 'none' }}
            >
              <path d="M26.6666 28V25.3333C26.6666 23.9188 26.1047 22.5623 25.1045 21.5621C24.1044 20.5619 22.7478 20 21.3333 20H10.6666C9.25216 20 7.8956 20.5619 6.89541 21.5621C5.89522 22.5623 5.33331 23.9188 5.33331 25.3333V28M21.3333 9.33333C21.3333 12.2789 18.9455 14.6667 16 14.6667C13.0545 14.6667 10.6666 12.2789 10.6666 9.33333C10.6666 6.38781 13.0545 4 16 4C18.9455 4 21.3333 6.38781 21.3333 9.33333Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="tooltip">account</span>
          </button>
        </div>
        {showUserMenu && (
          <div className="user-menu-popup">
            <div 
              className="user-menu-overlay"
              onClick={handleClose}
            />
            <div 
              className="user-menu-dropdown"
              style={{
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="user-menu-item" style={{ cursor: 'default' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>
                  {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
                </p>
                <p className="user-menu-email">
                  {user.email}
                </p>
              </div>
              <div className="user-menu-divider"></div>
              <button className="user-menu-item" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="user-menu">
      <button 
        ref={buttonRef}
        className="user-button"
        onClick={handleSignIn}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="user-icon-svg">
          <path d="M26.6666 28V25.3333C26.6666 23.9188 26.1047 22.5623 25.1045 21.5621C24.1044 20.5619 22.7478 20 21.3333 20H10.6666C9.25216 20 7.8956 20.5619 6.89541 21.5621C5.89522 22.5623 5.33331 23.9188 5.33331 25.3333V28M21.3333 9.33333C21.3333 12.2789 18.9455 14.6667 16 14.6667C13.0545 14.6667 10.6666 12.2789 10.6666 9.33333C10.6666 6.38781 13.0545 4 16 4C18.9455 4 21.3333 6.38781 21.3333 9.33333Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="tooltip">account</span>
      </button>
    </div>
  )
}

export default UserMenu