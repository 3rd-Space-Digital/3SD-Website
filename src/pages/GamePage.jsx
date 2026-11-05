import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { mountThreeSdGame } from '../games/3sd-go/embed.js'
import './GamePage.css'

export default function GamePage() {
  const stageRef = useRef(null)

  useEffect(() => {
    const game = mountThreeSdGame(stageRef.current)
    return () => game.destroy(true)
  }, [])

  return (
    <div className="game-page">
      <Link to="/" className="game-home" aria-label="Home">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M20 6L10 16L20 26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
      <div ref={stageRef} className="game-stage" />
    </div>
  )
}
