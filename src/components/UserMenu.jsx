import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './UserMenu.css'
import './Header.css'

function UserMenu() {
  const { user, signInWithGoogle, signOut, loading } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

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
    } catch (error) {
      console.error('Sign out error:', error)
      alert('Failed to sign out. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="user-menu">
        <button className="user-button" disabled>
          <i className="fa-solid fa-spinner fa-spin"></i>
          <div className="tooltip">Loading...</div>
        </button>
      </div>
    )
  }

  if (user) {
    // Debug: Log user data to see what we're getting
    console.log('User data:', user)
    console.log('User metadata:', user.user_metadata)
    
    // Get avatar URL - Google OAuth might use 'picture' or 'avatar_url'
    const avatarUrl = user.user_metadata?.avatar_url || 
                      user.user_metadata?.picture || 
                      user.identities?.[0]?.identity_data?.avatar_url ||
                      user.identities?.[0]?.identity_data?.picture ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'User')}&background=random`
    
    console.log('Avatar URL:', avatarUrl)
    
    return (
      <div className="user-menu">
        <button 
          className="user-button"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          {avatarUrl && avatarUrl.includes('ui-avatars') === false ? (
            <img 
              src={avatarUrl}
              alt="User avatar"
              className="user-avatar"
              onError={(e) => {
                console.error('Image failed to load:', avatarUrl)
                e.target.style.display = 'none'
                const icon = e.target.nextElementSibling
                if (icon) icon.style.display = 'flex'
              }}
            />
          ) : null}
          <i 
            className="fa-regular fa-user" 
            style={{ display: avatarUrl && !avatarUrl.includes('ui-avatars') ? 'none' : 'flex' }}
          ></i>
          <div className="tooltip">Account</div>
        </button>
        {showUserMenu && (
          <div className="user-menu-dropdown">
            <div className="user-menu-item" style={{ cursor: 'default' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85em', color: '#666' }}>
                {user.email}
              </p>
            </div>
            <div className="user-menu-divider"></div>
            <button className="user-menu-item" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="user-menu">
      <button 
        className="user-button"
        onClick={handleSignIn}
      >
        <i className="fa-regular fa-user"></i>
        <div className="tooltip">Sign In</div>
      </button>
    </div>
  )
}

export default UserMenu