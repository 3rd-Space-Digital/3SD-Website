import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getArticleById } from '../../utils/issuesUtils'
import { getImageUrl } from '../../utils/supabaseImageRetrieval'
import './Article2.css'

const ARTICLE_ID = '2'
const IMAGE_PATH_PREFIX = 'issue/article2'

function ImageCarousel({ images, carouselId, onImageClick }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const imagesPerView = 4
  const totalImages = images.length

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

  const getVisibleImages = () => {
    const visible = []
    for (let i = 0; i < imagesPerView; i++) {
      const index = (currentIndex + i) % totalImages
      visible.push({
        image: images[index],
        key: `${carouselId}-${currentIndex}-${i}`,
        actualIndex: index
      })
    }
    return visible
  }

  return (
    <div className="article2-carousel">
      <button
        type="button"
        className="article2-carousel-arrow article2-carousel-arrow-left"
        onClick={prevSlide}
        aria-label="Previous images"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <div className="article2-carousel-images">
        {getVisibleImages().map((item, idx) => (
          <div 
            key={item.key} 
            className="article2-carousel-image-wrap"
            onClick={() => onImageClick(item.actualIndex)}
          >
            <img
              src={item.image}
              alt={`We The People ${idx + 1}`}
              className="article2-carousel-image"
            />
          </div>
        ))}
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
  
  // Create array alternating between thumbnail.png and nails.png
  const carouselImages = Array.from({ length: 10 }, (_, index) => 
    getImageUrl(`${IMAGE_PATH_PREFIX}/${index % 2 === 0 ? 'thumbnail.png' : 'nails.png'}`)
  )

  const handleImageClick = (index) => {
    setModalImageIndex(index)
  }

  const handleCloseModal = () => {
    setModalImageIndex(null)
  }

  const handleNextImage = () => {
    if (modalImageIndex !== null && modalImageIndex < carouselImages.length - 1) {
      setModalImageIndex(modalImageIndex + 1)
    } else if (modalImageIndex === carouselImages.length - 1) {
      setModalImageIndex(0)
    }
  }

  const handlePrevImage = () => {
    if (modalImageIndex !== null && modalImageIndex > 0) {
      setModalImageIndex(modalImageIndex - 1)
    } else if (modalImageIndex === 0) {
      setModalImageIndex(carouselImages.length - 1)
    }
  }

  useEffect(() => {
    if (modalImageIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setModalImageIndex(null)
      } else if (e.key === 'ArrowRight') {
        if (modalImageIndex < carouselImages.length - 1) {
          setModalImageIndex(modalImageIndex + 1)
        } else {
          setModalImageIndex(0)
        }
      } else if (e.key === 'ArrowLeft') {
        if (modalImageIndex > 0) {
          setModalImageIndex(modalImageIndex - 1)
        } else {
          setModalImageIndex(carouselImages.length - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalImageIndex, carouselImages.length])

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
    return (
      <div className="article2 article2-loading">
        <div className="article2-loading-text">Loading article...</div>
      </div>
    )
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
        <figure className="article2-hero">
          <img
            src={getImageUrl(`${IMAGE_PATH_PREFIX}/thumbnail.png`)}
            alt="We The People"
          />
        </figure>
        {article.description && (
          <p className="article2-subtitle">{article.description}</p>
        )}

        <div className="article2-body">
          <p className="article2-paragraph">
            Black history month for many is a time of communal retrospection. As a people and a county the struggles of the black persons through enslavement, jim crowe, and the lasting effects of systemic injustice often has served as a benchmark in which we measure social progress. Branded with the survivor tag, the identity of Blackness, though full of joy, expression, and diversity, is still too often reduced. Stories of trauma and pain remain overexposed and commodified, overshadowing the fullness of who we are.
          </p>
        </div>

        <ImageCarousel images={carouselImages} carouselId="carousel-1" onImageClick={handleImageClick} />

        <div className="article2-body">
          <p className="article2-paragraph">
            "We The People" moves in a different direction. This three part series, captured through the eyes of three photographers, explores the breadth of expression, identity, and subculture that exists under the umbrella of Blackness. Each model embodies a distinct facet of this spectrum, from Punk and Alternative culture to Streetwear, Traditionalism and Spiritualism, and Dandyism.
          </p>
        </div>

        <ImageCarousel images={carouselImages} carouselId="carousel-2" onImageClick={handleImageClick} />

        <div className="article2-body">
          <p className="article2-paragraph">
            The series examines how these identities coexist, contrast, and expand what Blackness looks like in public space. Our goal was to create work that felt alive, self possessed, and reflective of the multiplicity within our community.
          </p>
        </div>

        <ImageCarousel images={carouselImages} carouselId="carousel-3" onImageClick={handleImageClick} />
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
              src={carouselImages[modalImageIndex]} 
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
