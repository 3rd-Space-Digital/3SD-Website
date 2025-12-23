import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import AuthCallback from './pages/AuthCallback'
import './App.css'

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={
          <main className="main-content">
            <h1>3rdSpaceDigital</h1>
            <p>A digital third place for artists to collaborate, showcase, and grow.</p>
          </main>
        } />
      </Routes>
    </div>
  )
}

export default App

