import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getArticleById } from '../../utils/issuesUtils'
import { getImageUrl } from '../../utils/supabaseImageRetrieval'
import LoadingScreen from '../../components/LoadingScreen'
import './Article4.css'

const ARTICLE_ID = '4'
const IMAGE_PATH_PREFIX = 'issue/article4'
const ANDREW_INSTAGRAM = 'https://www.instagram.com/_iso.media_/'
const ETHAN_INSTAGRAM = 'https://www.instagram.com/not.__ethan/'

const article4ImageUrl = (fileName) =>
  getImageUrl(`${IMAGE_PATH_PREFIX}/${fileName}`)

function Article4() {
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
      <div className="article4 article4-error">
        <div className="article4-error-text">
          <h2>{error || 'Article not found'}</h2>
          <Link to="/issues" className="article4-back-link">← Back to Issues</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="article4">
      <div className="article4-nav">
        <button
          type="button"
          className="article4-back"
          onClick={() => navigate('/issues')}
          aria-label="Back to issues"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Issues
        </button>
      </div>

      <header className="article4-header">
        <h1 className="article4-title">{article.title}</h1>
        <div className="article4-meta">
          <span className="article4-date">{formatDate(article.article_date)}</span>
          {article.author && (
            <>
              <span className="article4-sep"> | </span>
              <span className="article4-author">{article.author}</span>
            </>
          )}
        </div>
      </header>

      <div className="article4-content">
        <figure className="article4-hero">
          <img
            src={article4ImageUrl('pic 1.webp')}
            alt="Urban street and transit at night"
          />
        </figure>
        {article.description && (
          <p className="article4-subtitle">{article.description}</p>
        )}

        <div className="article4-body">
          <p className="article4-paragraph">
            Cities seem to always be in motion. Whether it&apos;s the zooming trains, the full stairs, or just
            the street, there&apos;s a constant sense of busyness, like the city never actually slows
            down. This perpetual motion plays a large role in what makes a city. What truly makes a
            city, though, is the people and the life there—walking around past dark, waiting for the
            train, or just exploring. A city truly is the epitome of busyness.
          </p>
          <p className="article4-paragraph">
            In the city, structure is the most important thing. Cities are built for
            people to move from one location to another. The architecture is efficient and dry,
            focusing more on function than comfort. A train station, in particular, is designed to be a
            temporary stop: you go in, then go out—a part of the journey.
          </p>
        </div>

        <figure className="article4-two-images">
          <div className="article4-two-images-grid">
            <div className="article4-image-wrap">
              <img
                src={article4ImageUrl('pic 2.webp')}
                alt="City architecture and movement"
                className="article4-image-left"
              />
            </div>
            <div className="article4-image-wrap">
              <img
                src={article4ImageUrl('pic 4.webp')}
                alt="Urban infrastructure and transit"
                className="article4-image-right"
              />
            </div>
          </div>
          <figcaption className="article4-caption">
            Built to Move People Through
          </figcaption>
        </figure>

        <div className="article4-body">
          <p className="article4-paragraph">
            Although cities aren&apos;t just about movement. While it can feel crowded and
            overwhelming, they can also offer moments of solitude. Taking a quick second to stop
            and just exist can feel great. It allows you to live in the moment and enjoy what you have.
          </p>
          <p className="article4-paragraph">
            Even with all the bustle, taking a short moment to stop and reflect can really affect
            how the city feels. The constant rush around you makes those quiet pauses more
            impactful. In places built for constant motion, there is still room to slow down and take a
            moment to observe.
          </p>
        </div>

        <figure className="article4-two-images">
          <div className="article4-two-images-grid">
            <div className="article4-image-wrap">
              <img
                src={article4ImageUrl('pic 5.webp')}
                alt="Quiet moment in the city"
                className="article4-image-left"
              />
            </div>
            <div className="article4-image-wrap">
              <img
                src={article4ImageUrl('pic 7.webp')}
                alt="Urban stillness amid motion"
                className="article4-image-right"
              />
            </div>
          </div>
          <figcaption className="article4-caption">
            Room to Slow Down and Observe
          </figcaption>
        </figure>
      </div>

      <div className="article4-credits">
        <h3 className="article4-credits-title">Credits</h3>
        <div className="article4-credits-grid">
          {article.author && (
            <div className="article4-credit-item">
              <span className="article4-credit-label">Author:</span>
              <span className="article4-credit-value">
                <a href={ANDREW_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="article4-credit-link">{article.author}</a>
              </span>
            </div>
          )}
          <div className="article4-credit-item">
            <span className="article4-credit-label">Photographer:</span>
            <span className="article4-credit-value">
              <a href={ANDREW_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="article4-credit-link">Andrew John</a>
            </span>
          </div>
          <div className="article4-credit-item">
            <span className="article4-credit-label">Model:</span>
            <span className="article4-credit-value">
              <a href={ETHAN_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="article4-credit-link">Ethan Scherwitz</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Article4
