import { Suspense, useCallback, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LoadingScreen from '../../../components/LoadingScreen'
import { getImageUrl } from '../../../utils/supabaseImageRetrieval'
import { Article8Scene, preloadArticle8Model } from './scene'
import './Article8.css'

const MODEL_URL = getImageUrl('issue/article8/pulsethreeJS.glb')
const HINT_HIDE_FRAME = 10
const CREDITS_SHOW_FRAME = 240

preloadArticle8Model(MODEL_URL)

function Article8() {
  const location = useLocation()
  const navigate = useNavigate()
  const [hintVisible, setHintVisible] = useState(true)
  const [creditsVisible, setCreditsVisible] = useState(false)
  const hintVisibleRef = useRef(true)
  const creditsVisibleRef = useRef(false)

  const handleFrame = useCallback((frame) => {
    const hint = frame < HINT_HIDE_FRAME
    if (hint !== hintVisibleRef.current) {
      hintVisibleRef.current = hint
      setHintVisible(hint)
    }
    const credits = frame >= CREDITS_SHOW_FRAME
    if (credits !== creditsVisibleRef.current) {
      creditsVisibleRef.current = credits
      setCreditsVisible(credits)
    }
  }, [])

  return (
    <div className="article8">
      <button
        type="button"
        className="article8-back"
        onClick={() => navigate('/issues')}
        aria-label="Back to issues"
      >
        <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
      </button>

      <Suspense fallback={<LoadingScreen text="Loading Issue" />}>
        <Article8Scene
          modelUrl={MODEL_URL}
          debug={location.hash === '#debug'}
          onFrame={handleFrame}
        />
        <p
          className={`article8-hint${hintVisible ? '' : ' article8-hint--hidden'}`}
          aria-hidden={!hintVisible}
        >
          <span className="article8-hint-desktop">scroll to move</span>
          <span className="article8-hint-mobile">scroll up to move</span>
        </p>
        <div
          className={`article8-credits${creditsVisible ? ' article8-credits--visible' : ''}`}
          aria-hidden={!creditsVisible}
        >
          <span>
            Written By:{' '}
            <a
              href="https://www.instagram.com/jajin_ronin/"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={creditsVisible ? 0 : -1}
            >
              Giancarlo Martin
            </a>
          </span>
          <span>
            3D Scene By:{' '}
            <a
              href="https://www.instagram.com/yogurt.3d/"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={creditsVisible ? 0 : -1}
            >
              Ethan Scherwitz
            </a>
          </span>
        </div>
      </Suspense>
    </div>
  )
}

export default Article8
