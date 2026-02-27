/* eslint-disable react/prop-types */
import './LoadingScreen.css'

const ROWS = 12

function LoadingScreen({ label = '', text }) {
  const phrase = (text?.trim() || `Loading ${label}`.trim()).trim()

  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-label={phrase}>
      <div className="loading-screen-column" aria-hidden="true">
        {Array.from({ length: ROWS }).map((_, idx) => (
          <div key={idx} className="loading-screen-row" style={{ '--i': idx }}>
            {phrase}
          </div>
        ))}
      </div>
      <span className="loading-screen-sr">{phrase}</span>
    </div>
  )
}

export default LoadingScreen
