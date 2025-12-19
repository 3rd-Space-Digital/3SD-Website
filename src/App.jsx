import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>3rd Space Digital</h1>
        <p>A digital third place for artists to collaborate, showcase, and grow.</p>
      </header>
    </div>
  )
}

export default App

