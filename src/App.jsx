import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import AuthCallback from './pages/AuthCallback'
import Homepage from './pages/Homepage'
import ArchivePage from './pages/ArchivePage'
import './App.css'

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/archive" element={<ArchivePage />} />
      </Routes>
    </div>
  )
}

export default App

