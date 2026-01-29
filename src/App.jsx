import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import AuthCallback from './pages/AuthCallback'
import Homepage from './pages/Homepage'
import ArchivePage from './pages/ArchivePage'
import EventsPage from './pages/events/EventsPage'
import EventDetail from './pages/events/EventDetail'
import IssuesPage from './pages/issues/IssuesPage'
import Article from './pages/issues/Article'
import MenuPage from './pages/MenuPage'
import PlaylistPage from './pages/PlaylistPage'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="App">
      <Header onOpenMenu={() => setMenuOpen(true)} />
      {menuOpen && (
        <MenuPage onClose={() => setMenuOpen(false)} />
      )}
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/issues/:id" element={<Article />} />
        <Route path="/playlist" element={<PlaylistPage />} />
      </Routes>
    </div>
  )
}

export default App

