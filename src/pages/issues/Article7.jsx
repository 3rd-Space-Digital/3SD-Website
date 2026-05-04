import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getArticleById } from '../../utils/issuesUtils'
import { getImageUrl } from '../../utils/supabaseImageRetrieval'
import LoadingScreen from '../../components/LoadingScreen'
import './Article7.css'

const ARTICLE_ID = '7'
const IMAGE_PATH_PREFIX = 'issue/article7'

const img = (name) => getImageUrl(`${IMAGE_PATH_PREFIX}/${name}`)

// Muted autoplay is required for autoplay in Chromium / Safari (https://www.youtube.com/watch?v=fNMkwk0Ei9E).
const ARTICLE7_YOUTUBE_ID = 'fNMkwk0Ei9E'

const KINDRED_PARAGRAPHS_BEFORE_FIRST_SPREAD = [
  `The day that the parasites became the kings of the jungle, they sat upon much more wicked dapperlings, drunk with sin, sense of power, holding torches that looked not quite right. Far away a priest rest his forehead on the soil that had feasted on his own mother.`,
  `I could feel the coup already. I had spread the rot. As with everything else in my world it came in waves.`,
  `The sweet smell that lilted from the fruit and said goodbye to passerby was cut today with whatever took him. Me and you, together that day, painted the walls with the wet grass that stained our breath.`
]

const KINDRED_PARAGRAPHS_BEFORE_SECOND_SPREAD = [
  `You rolled the ring around in your hand, and I saw through it. Through the ring, through his hand, through my property, and through the carcass only I could love. It laid, sprawled rather, ugly, reminder of all that I couldn't repress.`,
  `You told me that he had died in a freak accident. All his belongings were homeless she said. You were homeless you said.`,
  `And no one had told me that writing would be so difficult. Writing, all that I had inherited, not one word more or less. But I wrote, and it hurt. More than the accident hurt him. It hurt more. I had it worse. I kept saying and I kept going.`,
  `Nine things sized up and laid out, only three labeled, all sad.`
]

const KINDRED_PARAGRAPHS_CLOSING = [
  `We were kindred, bonded by the shared itch on the smalls of our backs. Fettered by our fetish for the unreasonable, the impossible. For three hours we preyed on the other's pestilence, and then we prayed.`,
  `The bands on our wrists were the genesis. After all we both were quenching our thirst with something that did not belong to us. And what else could possibly unite us besides our lust? What else would?`,
  `I was as ugly as the carcass in my basement. I was as ugly as what it spit out, I was as ugly as what it had borne.`,
  `That night, sinks upon sinks upon mirrors burst with honey. Hissing with pressure and obscenity. Soldered and intrepid, each its own.`
]

function parseFlexGapPx(container) {
  if (!container) return 24
  const cs = getComputedStyle(container)
  const raw = cs.gap && cs.gap !== 'normal' ? cs.gap : cs.columnGap || cs.rowGap
  const n = parseFloat(String(raw).split(/\s+/)[0])
  return Number.isFinite(n) && n >= 0 ? n : 24
}

/** One shared rendered height for every image; scales down so the row fits (no horizontal scroll). */
function Article7ImageRow({ srcs }) {
  const containerRef = useRef(null)

  const recompute = useCallback(() => {
    const el = containerRef.current
    if (!el || !srcs.length) return
    const cw = el.clientWidth
    if (cw <= 4) return

    const imgs = Array.from(el.querySelectorAll('img'))
    if (imgs.length !== srcs.length) return

    const dims = []
    for (const im of imgs) {
      if (!im.naturalWidth || !im.naturalHeight) {
        el.style.removeProperty('--article7-row-img-h')
        return
      }
      dims.push({ w: im.naturalWidth, h: im.naturalHeight })
    }

    const gapPx = parseFlexGapPx(el)
    const sumWh = dims.reduce((acc, d) => acc + d.w / d.h, 0)
    const gapsTotal = Math.max(0, dims.length - 1) * gapPx
    const hFit = (cw - gapsTotal) / sumWh
    const hCap = Math.min(window.innerWidth * 0.3, 280)
    const h = Math.max(10, Math.min(hCap, hFit))
    el.style.setProperty('--article7-row-img-h', `${h}px`)
  }, [srcs])

  useLayoutEffect(() => {
    recompute()
    const el = containerRef.current
    if (!el) return undefined
    const ro = new ResizeObserver(recompute)
    ro.observe(el)
    window.addEventListener('resize', recompute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', recompute)
    }
  }, [recompute])

  return (
    <div ref={containerRef} className="article7-images-row">
      {srcs.map((src) => (
        <div key={src} className="article7-image-wrap">
          <img src={src} alt="" onLoad={recompute} decoding="async" />
        </div>
      ))}
    </div>
  )
}

function Article7() {
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await getArticleById(ARTICLE_ID)
        if (!data) {
          setError('Article not found')
          setLoading(false)
          return
        }
        setArticle(data)
        setError(null)
      } catch (err) {
        console.error('Error loading article:', err)
        setError('Failed to load article')
      } finally {
        setLoading(false)
      }
    }
    load()

    document.body.style.backgroundColor = 'white'
    document.documentElement.style.backgroundColor = 'white'

    return () => {
      document.body.style.removeProperty('background-color')
      document.documentElement.style.removeProperty('background-color')
    }
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return <LoadingScreen text="Loading Issue" />
  }

  if (error || !article) {
    return (
      <div className="article7 article7-error">
        <div className="article7-error-text">
          <h2>{error || 'Article not found'}</h2>
          <Link to="/issues" className="article7-back-link">← Back to Issues</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="article7">
      <div className="article7-nav">
        <button
          type="button"
          className="article7-back"
          onClick={() => navigate('/issues')}
          aria-label="Back to issues"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Issues
        </button>
      </div>

      <header className="article7-header">
        <h1 className="article7-title">{article.title}</h1>
        <div className="article7-meta">
          <span className="article7-date">{formatDate(article.article_date)}</span>
          {article.author && (
            <>
              <span className="article7-sep"> | </span>
              <span className="article7-author">{article.author}</span>
            </>
          )}
        </div>
      </header>

      <div className="article7-content">
        <figure className="article7-hero">
          <img
            src={img('thumbnail.webp')}
            alt={article.title || 'Kindred'}
          />
        </figure>
        {article.description && (
          <p className="article7-subtitle">{article.description}</p>
        )}

        <div className="article7-body">
          <p className="article7-paragraph">{KINDRED_PARAGRAPHS_BEFORE_FIRST_SPREAD[0]}</p>
          <p className="article7-paragraph">{KINDRED_PARAGRAPHS_BEFORE_FIRST_SPREAD[1]}</p>
        </div>

        <figure className="article7-two-images">
          <Article7ImageRow srcs={[img('1.webp'), img('2.webp')]} />
        </figure>

        <div className="article7-body">
          <p className="article7-paragraph">{KINDRED_PARAGRAPHS_BEFORE_FIRST_SPREAD[2]}</p>
        </div>

        <div className="article7-video-embed">
          <iframe
            title="Embedded video for Kindred"
            src={`https://www.youtube.com/embed/${ARTICLE7_YOUTUBE_ID}?autoplay=1&mute=1&playsinline=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <div className="article7-body">
          <p className="article7-paragraph">{KINDRED_PARAGRAPHS_BEFORE_SECOND_SPREAD[0]}</p>
          <p className="article7-paragraph">{KINDRED_PARAGRAPHS_BEFORE_SECOND_SPREAD[1]}</p>
        </div>

        <figure className="article7-three-images">
          <Article7ImageRow srcs={[img('3.webp'), img('4.webp'), img('5.webp')]} />
        </figure>

        <div className="article7-body">
          <p className="article7-paragraph">{KINDRED_PARAGRAPHS_BEFORE_SECOND_SPREAD[2]}</p>
          <p className="article7-paragraph">{KINDRED_PARAGRAPHS_BEFORE_SECOND_SPREAD[3]}</p>
        </div>

        <figure className="article7-two-images">
          <Article7ImageRow srcs={[img('6.webp'), img('7.webp')]} />
        </figure>

        <div className="article7-body">
          <p className="article7-paragraph">{KINDRED_PARAGRAPHS_CLOSING[0]}</p>
          <p className="article7-paragraph">{KINDRED_PARAGRAPHS_CLOSING[1]}</p>
        </div>

        <figure className="article7-two-images">
          <Article7ImageRow srcs={[img('8.webp'), img('9.webp')]} />
        </figure>

        <div className="article7-body">
          <p className="article7-paragraph">{KINDRED_PARAGRAPHS_CLOSING[2]}</p>
          <p className="article7-paragraph">{KINDRED_PARAGRAPHS_CLOSING[3]}</p>
        </div>
      </div>

      <div className="article7-credits">
        <h3 className="article7-credits-title">Credits</h3>
        <div className="article7-credits-grid">
          <div className="article7-credit-item">
            <span className="article7-credit-label">Author:</span>
            <a
              href="https://www.instagram.com/sundrypossessions/"
              target="_blank"
              rel="noopener noreferrer"
              className="article7-credit-link"
            >
              Sukriti Sinha
            </a>
          </div>
          <div className="article7-credit-item">
            <span className="article7-credit-label">Photographers:</span>
            <a
              href="https://www.instagram.com/sundrypossessions/"
              target="_blank"
              rel="noopener noreferrer"
              className="article7-credit-link"
            >
              Sukriti Sinha
            </a>
            <span className="article7-credit-sep">, </span>
            <a
              href="https://www.instagram.com/pingutography/"
              target="_blank"
              rel="noopener noreferrer"
              className="article7-credit-link"
            >
              Prabhas Gade
            </a>
            <span className="article7-credit-sep">, </span>
            <a
              href="https://www.instagram.com/emeka_0/"
              target="_blank"
              rel="noopener noreferrer"
              className="article7-credit-link"
            >
              Emeka Ohumaegbulem
            </a>
          </div>
          <div className="article7-credit-item">
            <span className="article7-credit-label">Models:</span>
            <a
              href="https://www.instagram.com/haashim_shaik8/"
              target="_blank"
              rel="noopener noreferrer"
              className="article7-credit-link"
            >
              Haashim Shaik
            </a>
            <span className="article7-credit-sep">, </span>
            <a
              href="https://www.instagram.com/sachhyum05/"
              target="_blank"
              rel="noopener noreferrer"
              className="article7-credit-link"
            >
              Sachhyam Manandhar
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Article7
