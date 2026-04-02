import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getArticleById } from '../../utils/issuesUtils'
import { getImageUrl } from '../../utils/supabaseImageRetrieval'
import LoadingScreen from '../../components/LoadingScreen'
import { IssueImageCarousel } from '../../components/issues/IssueImageCarousel'
import './Article4.css'

const ARTICLE_ID = '4'
const IMAGE_PATH_PREFIX = 'issue/article4'
const ANDREW_INSTAGRAM = 'https://www.instagram.com/_iso.media_/'
const ETHAN_INSTAGRAM = 'https://www.instagram.com/not.__ethan/'
const CAROUSEL_IMAGES_PER_VIEW = 4

/** Hero alternates between these (pic 12 is not in row-2 carousel) */
const HERO_CYCLE_FILES = ['pic 1.webp', 'pic 12.webp']
const HERO_CYCLE_ALTS = [
  'Urban street and transit at night',
  'Urban Interlude'
]
const HERO_CYCLE_INTERVAL_MS = 5000

/** Row 1 carousel: former two-up rows (pics 2, 4, 5, 7) */
const CAROUSEL_ROW1_FILES = ['pic 2.webp', 'pic 4.webp', 'pic 5.webp', 'pic 7.webp']

/** Row 2 carousel */
const CAROUSEL_ROW2_FILES = ['pic 8.webp', 'pic 9.webp', 'pic 10.webp', 'pic 11.webp']

const article4ImageUrl = (fileName) =>
  getImageUrl(`${IMAGE_PATH_PREFIX}/${fileName}`)

function Article4() {
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalImageIndex, setModalImageIndex] = useState(null)
  const [modalImages, setModalImages] = useState([])

  const carouselRow1Urls = useMemo(
    () => CAROUSEL_ROW1_FILES.map((f) => article4ImageUrl(f)),
    []
  )
  const carouselRow2Urls = useMemo(
    () => CAROUSEL_ROW2_FILES.map((f) => article4ImageUrl(f)),
    []
  )

  const heroCycleUrls = useMemo(
    () => HERO_CYCLE_FILES.map((f) => article4ImageUrl(f)),
    []
  )

  const [heroImageIndex, setHeroImageIndex] = useState(0)

  useEffect(() => {
    if (heroCycleUrls.length < 2) return
    const id = window.setInterval(() => {
      setHeroImageIndex((i) => (i + 1) % heroCycleUrls.length)
    }, HERO_CYCLE_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [heroCycleUrls.length])

  const handleImageClick = (images, index) => {
    setModalImages(images)
    setModalImageIndex(index)
  }

  const handleCloseModal = () => {
    setModalImageIndex(null)
    setModalImages([])
  }

  const handleNextImage = () => {
    if (modalImageIndex !== null && modalImageIndex < modalImages.length - 1) {
      setModalImageIndex(modalImageIndex + 1)
    } else if (modalImageIndex === modalImages.length - 1) {
      setModalImageIndex(0)
    }
  }

  const handlePrevImage = () => {
    if (modalImageIndex !== null && modalImageIndex > 0) {
      setModalImageIndex(modalImageIndex - 1)
    } else if (modalImageIndex === 0) {
      setModalImageIndex(modalImages.length - 1)
    }
  }

  useEffect(() => {
    if (modalImageIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setModalImageIndex(null)
      } else if (e.key === 'ArrowRight') {
        if (modalImageIndex < modalImages.length - 1) {
          setModalImageIndex(modalImageIndex + 1)
        } else {
          setModalImageIndex(0)
        }
      } else if (e.key === 'ArrowLeft') {
        if (modalImageIndex > 0) {
          setModalImageIndex(modalImageIndex - 1)
        } else {
          setModalImageIndex(modalImages.length - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalImageIndex, modalImages.length])

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
        <figure className="article4-hero" aria-live="polite">
          <img
            src={heroCycleUrls[heroImageIndex]}
            alt={HERO_CYCLE_ALTS[heroImageIndex] ?? 'Urban Interlude'}
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

        <figure className="article4-carousel-figure">
          <IssueImageCarousel
            ns="article4"
            altLabel="Urban Interlude"
            images={carouselRow1Urls}
            carouselId="article4-carousel-row1"
            imagesPerView={CAROUSEL_IMAGES_PER_VIEW}
            onImageClick={(index) => handleImageClick(carouselRow1Urls, index)}
          />
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

        {carouselRow2Urls.length > 0 && (
          <figure className="article4-carousel-figure">
            <IssueImageCarousel
              ns="article4"
              altLabel="Urban Interlude"
              images={carouselRow2Urls}
              carouselId="article4-carousel-row2"
              imagesPerView={CAROUSEL_IMAGES_PER_VIEW}
              onImageClick={(index) => handleImageClick(carouselRow2Urls, index)}
            />
            <figcaption className="article4-caption">
              Room to Slow Down and Observe
            </figcaption>
          </figure>
        )}
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

      {modalImageIndex !== null && (
        <div className="article4-modal" onClick={handleCloseModal} role="presentation">
          <button
            type="button"
            className="article4-modal-close"
            onClick={handleCloseModal}
            aria-label="Close modal"
          >
            ×
          </button>
          <button
            type="button"
            className="article4-modal-prev"
            onClick={(e) => {
              e.stopPropagation()
              handlePrevImage()
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <div className="article4-modal-content" onClick={(e) => e.stopPropagation()} role="presentation">
            <img
              src={modalImages[modalImageIndex]}
              alt={`Urban Interlude ${modalImageIndex + 1}`}
              className="article4-modal-image"
            />
          </div>
          <button
            type="button"
            className="article4-modal-next"
            onClick={(e) => {
              e.stopPropagation()
              handleNextImage()
            }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}

export default Article4
