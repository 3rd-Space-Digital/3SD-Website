import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useHomepageReveal } from '../context/HomepageRevealContext'
import UserMenu from './UserMenu'
import logoIcon from '../assets/svgs/3SD.svg'
import './Header.css'

const TOP_THRESHOLD = 24

function Header({ onOpenMenu }) {
  const location = useLocation()
  const navigate = useNavigate()
  const lastScrollY = useRef(0)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [atTop, setAtTop] = useState(true)
  const { homepageRevealed } = useHomepageReveal()

  useEffect(() => {
    const isHomepage = location.pathname === '/'
    // On the homepage intro (before reveal), keep header transparent/visible.
    // iOS Safari can report a non-zero scroll position on load, which would
    // incorrectly push the header into the "glass" state.
    if (isHomepage && !homepageRevealed) {
      lastScrollY.current = 0
      setAtTop(true)
      setHeaderVisible(true)
      return
    }
    const useRevealScrollContainer = isHomepage && homepageRevealed
    const revealScrollEl = useRevealScrollContainer
      ? document.querySelector('.homepage-reveal')
      : null
    const scrollTarget = revealScrollEl || window

    const getScrollY = () => {
      if (scrollTarget === window) return window.scrollY ?? window.pageYOffset ?? 0
      return scrollTarget.scrollTop ?? 0
    }

    const handleScroll = () => {
      const y = getScrollY()
      const scrollingUp = y < lastScrollY.current
      if (y <= TOP_THRESHOLD) {
        setAtTop(true)
        setHeaderVisible(true)
      } else {
        setAtTop(false)
        setHeaderVisible(scrollingUp)
      }
      lastScrollY.current = y
    }

    const initialY = getScrollY()
    lastScrollY.current = initialY
    setAtTop(initialY <= TOP_THRESHOLD)

    scrollTarget.addEventListener('scroll', handleScroll, { passive: true })
    return () => scrollTarget.removeEventListener('scroll', handleScroll)
  }, [location.pathname, homepageRevealed])

  const handleHomeClick = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      window.location.reload()
      return
    }
    navigate('/')
  }

  const goToMenu = () => {
    if (onOpenMenu) onOpenMenu()
    else navigate('/menu')
  }

  const isHomepage = location.pathname === '/'
  const isHomepageIntro = isHomepage && !homepageRevealed
  const useLightText = location.pathname === '/issues/3'
  // Show header based on scroll behavior, even on homepage when revealed
  const showHeader = isHomepage && !homepageRevealed ? true : headerVisible
  const headerClass = [
    'header',
    !showHeader && 'header--hidden',
    showHeader && (isHomepageIntro || atTop) && 'header--transparent',
    showHeader && !isHomepageIntro && !atTop && 'header--glass',
    showHeader && useLightText && 'header--light-text',
  ].filter(Boolean).join(' ')

  return (
    <div className={headerClass}>
      <div className="header-left">
        <Link to="/" className="header-logo-link" aria-label="Home" onClick={handleHomeClick}>
          <img src={logoIcon} alt="" className="header-logo" />
        </Link>
      </div>

      <div className="header-center">
        <div className="brand-name-link" onClick={handleHomeClick}>
          <div className="brand-name">
            ThirdSpaceDigital
          </div>
        </div>
      </div>

      <div className="header-right">
        <Link to="/issues" className="header-nav-icon" aria-label="Issues">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="header-icon-svg">
            <rect x="3.5" y="1.5" width="25" height="29" rx="1.5" stroke="currentColor" strokeWidth="3"/>
            <line x1="9" y1="12.5" x2="23" y2="12.5" stroke="currentColor" strokeWidth="3"/>
            <line x1="9" y1="18.5" x2="23" y2="18.5" stroke="currentColor" strokeWidth="3"/>
            <line x1="9" y1="24.5" x2="23" y2="24.5" stroke="currentColor" strokeWidth="3"/>
          </svg>
          <span className="tooltip">issues</span>
        </Link>
        <Link to="/events" className="header-nav-icon" aria-label="Events">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="header-icon-svg">
            <path d="M21.3333 2.66663V7.99996M10.6667 2.66663V7.99996M4 13.3333H28M6.66667 5.33329H25.3333C26.8061 5.33329 28 6.5272 28 7.99996V26.6666C28 28.1394 26.8061 29.3333 25.3333 29.3333H6.66667C5.19391 29.3333 4 28.1394 4 26.6666V7.99996C4 6.5272 5.19391 5.33329 6.66667 5.33329Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="tooltip">events</span>
        </Link>
        <UserMenu />
        <button
          type="button"
          className="header-menu-button"
          onClick={goToMenu}
          aria-label="Open menu"
        >
          <i className="fa-solid fa-bars" aria-hidden="true"></i>
          <span className="tooltip">menu</span>
        </button>
      </div>
    </div>
  )
}

export default Header