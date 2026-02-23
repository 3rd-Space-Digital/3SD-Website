import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getArticleById } from '../../utils/issuesUtils'
import { getImageUrl } from '../../utils/supabaseImageRetrieval'
import './Article2.css'

const ARTICLE_ID = '2'
const IMAGE_PATH_PREFIX = 'issue/article2'

function Article2() {
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
          <p className="article2-paragraph">
            "We The People" moves in a different direction. This three part series, captured through the eyes of three photographers, explores the breadth of expression, identity, and subculture that exists under the umbrella of Blackness. Each model embodies a distinct facet of this spectrum, from Punk and Alternative culture to Streetwear, Traditionalism and Spiritualism, and Dandyism.
          </p>
          <p className="article2-paragraph">
            The series examines how these identities coexist, contrast, and expand what Blackness looks like in public space. Our goal was to create work that felt alive, self possessed, and reflective of the multiplicity within our community.
          </p>
        </div>

        <figure className="article2-two-images">
          <div className="article2-two-images-grid">
            <div className="article2-image-wrap">
              <img
                src={getImageUrl(`${IMAGE_PATH_PREFIX}/tu2.jpg`)}
                alt="We The People"
                className="article2-image-left"
              />
            </div>
            <div className="article2-image-wrap">
              <img
                src={getImageUrl(`${IMAGE_PATH_PREFIX}/tu3.jpg`)}
                alt="We The People"
                className="article2-image-right"
              />
            </div>
          </div>
        </figure>

        <figure className="article2-two-images">
          <div className="article2-two-images-grid">
            <div className="article2-image-wrap">
              <img
                src={getImageUrl(`${IMAGE_PATH_PREFIX}/tu4.jpg`)}
                alt="We The People"
                className="article2-image-left"
              />
            </div>
            <div className="article2-image-wrap">
              <img
                src={getImageUrl(`${IMAGE_PATH_PREFIX}/tu5.jpg`)}
                alt="We The People"
                className="article2-image-right"
              />
            </div>
          </div>
        </figure>
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
    </div>
  )
}

export default Article2
