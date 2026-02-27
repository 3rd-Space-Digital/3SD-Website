import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../config/supabase'
import { getArticleById } from '../../utils/issuesUtils'
import { getImageUrl } from '../../utils/supabaseImageRetrieval'
import LoadingScreen from '../../components/LoadingScreen'
import './Article2.css'

const ARTICLE_ID = '2'
const CAROUSEL_IMAGE_PATH_PREFIXES = ['issues/article2', 'issue/article2']
const HERO_THUMBNAIL_PATH = 'issue/article2/thumbnail.webp'
const ARCHIVE_FOLDER_NAME = 'We The People'

const IMAGE_EXTENSIONS_REGEX = /\.(jpg|jpeg|png|gif|webp|avif)$/i
const CAROUSEL_IMAGES_PER_VIEW = 4

function ImageCarousel({ images, carouselId, onImageClick }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const totalImages = images.length
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const [slideStep, setSlideStep] = useState(0)

  if (totalImages === 0) {
    return null
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      if (nextIndex >= totalImages) {
        return 0
      }
      return nextIndex
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const prevIndexNew = prevIndex - 1
      if (prevIndexNew < 0) {
        return totalImages - 1
      }
      return prevIndexNew
    })
  }

  const trackImages = useMemo(() => [...images, ...images], [images])

  useEffect(() => {
    const updateSlideStep = () => {
      if (!viewportRef.current || !trackRef.current) return

      const viewportWidth = viewportRef.current.clientWidth
      const trackStyles = window.getComputedStyle(trackRef.current)
      const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0') || 0
      const columns = parseInt(trackStyles.getPropertyValue('--carousel-columns'), 10) || CAROUSEL_IMAGES_PER_VIEW
      const itemWidth = (viewportWidth - gap * (columns - 1)) / columns
      setSlideStep(itemWidth + gap)
    }

    updateSlideStep()
    window.addEventListener('resize', updateSlideStep)
    return () => window.removeEventListener('resize', updateSlideStep)
  }, [totalImages])

  return (
    <div className="article2-carousel article2-fullbleed">
      <button
        type="button"
        className="article2-carousel-arrow article2-carousel-arrow-left"
        onClick={prevSlide}
        aria-label="Previous images"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <div className="article2-carousel-images" ref={viewportRef}>
        <div
          className="article2-carousel-track"
          ref={trackRef}
          style={{ transform: `translateX(-${currentIndex * slideStep}px)` }}
        >
          {trackImages.map((image, idx) => (
          <div 
            key={`${carouselId}-track-${idx}`}
            className="article2-carousel-track-item article2-carousel-image-wrap"
            onClick={() => onImageClick(idx % totalImages)}
          >
            <img
              src={image}
              alt={`We The People ${(idx % totalImages) + 1}`}
              className="article2-carousel-image"
              loading={idx < totalImages ? 'eager' : 'lazy'}
              fetchPriority={idx < CAROUSEL_IMAGES_PER_VIEW ? 'high' : 'auto'}
              decoding="async"
            />
          </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="article2-carousel-arrow article2-carousel-arrow-right"
        onClick={nextSlide}
        aria-label="Next images"
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  )
}

function Article2() {
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalImageIndex, setModalImageIndex] = useState(null)
  const [modalImages, setModalImages] = useState([])
  const [emekaImages, setEmekaImages] = useState([])
  const [tamiloreImages, setTamiloreImages] = useState([])
  const [tariqImages, setTariqImages] = useState([])

  const loadCarouselImages = async (folderName) => {
    for (const basePath of CAROUSEL_IMAGE_PATH_PREFIXES) {
      const folderPath = `${basePath}/${folderName}`
      const { data: files, error: listError } = await supabase.storage
        .from('images')
        .list(folderPath, {
          limit: 1000,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        })

      if (listError) {
        console.error(`Error listing images in ${folderPath}:`, listError)
        continue
      }

      const urls = (files || [])
        .filter((file) => file.id != null && IMAGE_EXTENSIONS_REGEX.test(file.name))
        .map((file) => getImageUrl(`${folderPath}/${file.name}`))

      if (urls.length > 0) {
        return urls
      }
    }

    return []
  }

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
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        const data = await getArticleById(ARTICLE_ID)
        if (!data) {
          setError('Article not found')
          setLoading(false)
          return
        }

        if (!isMounted) return
        setArticle(data)
        setError(null)
        setLoading(false)

        loadCarouselImages('emeka')
          .then((images) => {
            if (!isMounted) return
            setEmekaImages(images)
          })
          .catch((carouselErr) => {
            console.error('Error loading emeka carousel images:', carouselErr)
          })

        loadCarouselImages('tamilore')
          .then((images) => {
            if (!isMounted) return
            setTamiloreImages(images)
          })
          .catch((carouselErr) => {
            console.error('Error loading tamilore carousel images:', carouselErr)
          })

        loadCarouselImages('tariq')
          .then((images) => {
            if (!isMounted) return
            setTariqImages(images)
          })
          .catch((carouselErr) => {
            console.error('Error loading tariq carousel images:', carouselErr)
          })
      } catch (err) {
        console.error('Error loading article:', err)
        if (!isMounted) return
        setError('Failed to load article')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    load()
    
    document.body.style.backgroundColor = '#FAF0E6'
    document.documentElement.style.backgroundColor = '#FAF0E6'
    
    return () => {
      isMounted = false
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
    return <LoadingScreen label="Article" />
  }

  if (error || !article) {
    return (
      <div className="article2 article2-error">
        <div className="article2-error-text">
          <h2>{error || 'Article not found'}</h2>
          <Link to="/issues" className="article2-back-link">← Back to Issues</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="article2">
      <div className="article2-nav">
        <button
          type="button"
          className="article2-back"
          onClick={() => navigate('/issues')}
          aria-label="Back to issues"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Issues
        </button>
      </div>

      <header className="article2-header">
        <h1 className="article2-title">{article.title}</h1>
        <div className="article2-meta">
          <span className="article2-date">{formatDate(article.article_date)}</span>
          {article.author && (
            <>
              <span className="article2-sep"> | </span>
              <span className="article2-author">{article.author}</span>
            </>
          )}
        </div>
      </header>

      <div className="article2-content">
        <figure className="article2-hero article2-fullbleed">
          <img
            src={getImageUrl(HERO_THUMBNAIL_PATH)}
            alt="We The People"
          />
        </figure>
        <div className="article2-reading">
          {article.description && (
            <p className="article2-subtitle">{article.description}</p>
          )}

          <div className="article2-body">
            <p className="article2-paragraph">
              Black history month for many is a time of communal retrospection. As a people and a county the struggles of the black persons through enslavement, jim crowe, and the lasting effects of systemic injustice often has served as a benchmark in which we measure social progress. Branded with the survivor tag, the identity of Blackness, though full of joy, expression, and diversity, is still too often reduced. Stories of trauma and pain remain overexposed and commodified, overshadowing the fullness of who we are.
            </p>
          </div>
        </div>

        {emekaImages.length > 0 && (
          <ImageCarousel
            images={emekaImages}
            carouselId="carousel-1"
            onImageClick={(index) => handleImageClick(emekaImages, index)}
          />
        )}

        <div className="article2-reading">
          <div className="article2-body">
            <p className="article2-paragraph">
              "We The People" moves in a different direction. This three part series, captured through the eyes of three photographers, explores the breadth of expression, identity, and subculture that exists under the umbrella of Blackness. Each model embodies a distinct facet of this spectrum, from Punk and Alternative culture to Streetwear, Traditionalism and Spiritualism, and Dandyism.
            </p>
          </div>
        </div>

        {tamiloreImages.length > 0 && (
          <ImageCarousel
            images={tamiloreImages}
            carouselId="carousel-2"
            onImageClick={(index) => handleImageClick(tamiloreImages, index)}
          />
        )}

        <div className="article2-reading">
          <div className="article2-body">
            <p className="article2-paragraph">
              The series examines how these identities coexist, contrast, and expand what Blackness looks like in public space. Our goal was to create work that felt alive, self possessed, and reflective of the multiplicity within our community.
            </p>
          </div>
        </div>

        {tariqImages.length > 0 && (
          <ImageCarousel
            images={tariqImages}
            carouselId="carousel-3"
            onImageClick={(index) => handleImageClick(tariqImages, index)}
          />
        )}

        <div className="article2-archive-cta">
          <Link
            to={`/archive/${encodeURIComponent(ARCHIVE_FOLDER_NAME)}`}
            className="article2-archive-link"
          >
            View Archive
          </Link>
        </div>
      </div>

      <div className="article2-credits">
        <h3 className="article2-credits-title">Credits</h3>
        <div className="article2-credits-grid">
          <div className="article2-credit-item">
            <span className="article2-credit-label">Author:</span>
            <span className="article2-credit-value">
              <a href="https://www.instagram.com/emeka_0/" target="_blank" rel="noopener noreferrer" className="article2-credit-link">Emeka Ohumaegbulem</a>
            </span>
          </div>
          <div className="article2-credit-item">
            <span className="article2-credit-label">Stylist:</span>
            <span className="article2-credit-value">
              <a href="https://www.instagram.com/archive.oos/" target="_blank" rel="noopener noreferrer" className="article2-credit-link">Oluwatomiwa Sodeinde</a>
            </span>
          </div>
          <div className="article2-credit-item">
            <span className="article2-credit-label">Photographers:</span>
            <span className="article2-credit-value">
              <a href="https://www.instagram.com/emeka_0/" target="_blank" rel="noopener noreferrer" className="article2-credit-link">Emeka Ohumaegbulem</a>
              {', '}
              <a href="https://www.instagram.com/tamiloreoni/" target="_blank" rel="noopener noreferrer" className="article2-credit-link">Tamilore Oni</a>
              {', '}
              <a href="https://www.instagram.com/tq._photography/" target="_blank" rel="noopener noreferrer" className="article2-credit-link">Tariq Quebral</a>
            </span>
          </div>
          <div className="article2-credit-item">
            <span className="article2-credit-label">Models:</span>
            <span className="article2-credit-value">
              <a href="https://www.instagram.com/qu1ncy/" target="_blank" rel="noopener noreferrer" className="article2-credit-link">Quincy Kemany</a>
              {', '}
              <a href="https://www.instagram.com/bolaji.babs/" target="_blank" rel="noopener noreferrer" className="article2-credit-link">Mobolaji Babalola</a>
              {', '}
              <a href="https://www.instagram.com/aphroditesswann/" target="_blank" rel="noopener noreferrer" className="article2-credit-link">Wafa Hassabelnabi</a>
              {', '}
              <a href="https://www.instagram.com/itzabrian/" target="_blank" rel="noopener noreferrer" className="article2-credit-link">Brian Echezona</a>
            </span>
          </div>
        </div>
      </div>

      {modalImageIndex !== null && (
        <div className="article2-modal" onClick={handleCloseModal}>
          <button 
            className="article2-modal-close"
            onClick={handleCloseModal}
            aria-label="Close modal"
          >
            ×
          </button>
          <button 
            className="article2-modal-prev"
            onClick={(e) => {
              e.stopPropagation()
              handlePrevImage()
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <div className="article2-modal-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={modalImages[modalImageIndex]} 
              alt={`We The People ${modalImageIndex + 1}`}
              className="article2-modal-image"
            />
          </div>
          <button 
            className="article2-modal-next"
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

export default Article2
