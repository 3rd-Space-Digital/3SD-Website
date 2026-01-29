import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import AuthCallback from './pages/AuthCallback'
import Homepage from './pages/Homepage'
import ArchivePage from './pages/ArchivePage'
import EventsPage from './pages/events/EventsPage'
import EventDetail from './pages/events/EventDetail'
import IssuesPage from './pages/issues/IssuesPage'
import './App.css'

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/issues" element={<IssuesPage />} />
      </Routes>
    </div>
  )
}

export default App

