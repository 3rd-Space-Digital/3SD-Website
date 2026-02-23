import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import AuthCallback from './pages/AuthCallback'
import Homepage from './pages/Homepage'
import ArchivePage from './pages/ArchivePage'
import EventsPage from './pages/events/EventsPage'
import EventDetail from './pages/events/EventDetail'
import IssuesPage from './pages/issues/IssuesPage'
// import Article from './pages/issues/Article'
import ArticleTemplate from './pages/issues/template/ArticleTemplate'
import Article1 from './pages/issues/Article1'
import MenuPage from './pages/MenuPage'
import PlaylistPage from './pages/PlaylistPage'
import ComingSoonPage from './pages/ComingSoonPage'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // If OAuth redirect landed on wrong path (e.g. / instead of /auth/callback) with hash, send to callback so flow completes
  useEffect(() => {
    const hash = window.location.hash
    const hasAuthHash = hash && /access_token|error=/.test(hash)
    const isCallback = location.pathname === '/auth/callback'
    if (hasAuthHash && !isCallback) {
      navigate(`/auth/callback${hash}`, { replace: true })
    }
  }, [location.pathname, navigate])

  useEffect(() => {
    const isHomepage = location.pathname === '/'
    
    if (isHomepage) {
      document.documentElement.style.removeProperty('background-color')
      document.body.style.removeProperty('background-color')
    } else {
      document.documentElement.style.backgroundColor = '#fff'
      document.body.style.backgroundColor = '#fff'
    }

    return () => {
      document.documentElement.style.removeProperty('background-color')
      document.body.style.removeProperty('background-color')
    }
  }, [location.pathname])

  return (
    <div className="App">
      <Header onOpenMenu={() => setMenuOpen(true)} />
      {menuOpen && (
        <MenuPage onClose={() => setMenuOpen(false)} />
      )}
      <div className="app-routes" style={{ flex: 1, width: '100%' }}>
        <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/archive/:folderName" element={<ArchivePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/issues/0" element={<ArticleTemplate />} />
        <Route path="/issues/1" element={<Article1 />} />
        {/* <Route path="/issues/:id" element={<Article />} /> */}
        <Route path="/playlist" element={<PlaylistPage />} />
        <Route path="/account" element={<ComingSoonPage />} />
        <Route path="/projects" element={<ComingSoonPage />} />
        <Route path="/artists" element={<ComingSoonPage />} />
        <Route path="/music" element={<ComingSoonPage />} />
        <Route path="/interviews" element={<ComingSoonPage />} />
        <Route path="/read" element={<ComingSoonPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

