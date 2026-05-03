import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { HomepageRevealProvider } from './context/HomepageRevealContext'
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
import Article2 from './pages/issues/Article2'
import Article3 from './pages/issues/Article3'
import Article4 from './pages/issues/Article4'
import Article5 from './pages/issues/Article5'
import Article6 from './pages/issues/Article6'
import MenuPage from './pages/MenuPage'
import AppsPage from './pages/apps/AppsPage'
import PlaylistPage from './pages/PlaylistPage'
import ProjectsPage from './pages/projects/ProjectsPage'
import ComingSoonPage from './pages/ComingSoonPage'
import AboutPage from './pages/AboutPage'
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
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.style.backgroundColor = '#fff'
      document.body.style.backgroundColor = '#fff'
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }

    return () => {
      document.documentElement.style.removeProperty('background-color')
      document.body.style.removeProperty('background-color')
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [location.pathname])

  return (
    <HomepageRevealProvider>
      <div className="App">
        <Header onOpenMenu={() => setMenuOpen(true)} />
        {menuOpen && (
          <MenuPage onClose={() => setMenuOpen(false)} />
        )}
        <div className="app-routes" style={{ flex: 1, width: '100%' }}>
          <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/archive/:folderName" element={<ArchivePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/issues" element={<IssuesPage contentType="all" pageTitle="All Issues" />} />
          <Route path="/articles" element={<IssuesPage contentType="article" pageTitle="Articles" />} />
          <Route path="/issues/0" element={<ArticleTemplate />} />
          <Route path="/issues/1" element={<Article1 />} />
          <Route path="/issues/2" element={<Article2 />} />
          <Route path="/issues/3" element={<Article3 />} />
          <Route path="/issues/4" element={<Article4 />} />
          <Route path="/issues/5" element={<Article5 />} />
          <Route path="/issues/6" element={<Article6 />} />
          {/* <Route path="/issues/:id" element={<Article />} /> */}
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route path="/account" element={<ComingSoonPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/artists" element={<ComingSoonPage />} />
          <Route path="/music" element={<ComingSoonPage />} />
          <Route path="/interviews" element={<ComingSoonPage />} />
          <Route path="/read" element={<Navigate to="/issues" replace />} />
          </Routes>
        </div>
        <Analytics />
      </div>
    </HomepageRevealProvider>
  )
}

export default App

