import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getArticleById, getArticleImages } from '../../../utils/issuesUtils'
import './ArticleTemplate.css'

const ARTICLE_ID = '0'

const PARAGRAPHS = [
  'First paragraph. Edit when you copy this template.',
  'Second paragraph. Add or remove paragraphs as needed.',
]

const EXTRA_CREDITS = [
  { label: 'Photography', value: 'Photographer Name' },
]

function ArticleTemplate() {
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [images, setImages] = useState([])
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
        const imgs = await getArticleImages(ARTICLE_ID)
        setArticle(data)
        setImages(imgs)
        setError(null)
      } catch (err) {
        console.error('Error loading article:', err)
        setError('Failed to load article')
      } finally {
        setLoading(false)
      }
    }
    load()
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
      <div className="article-template article-template-loading">
        <div className="article-template-loading-text">Loading article...</div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="article-template article-template-error">
        <div className="article-template-error-text">
          <h2>{error || 'Article not found'}</h2>
          <Link to="/issues" className="article-template-back-link">← Back to Issues</Link>
        </div>
      </div>
    )
  }

  const allCredits = [
    ...(article.author ? [{ label: 'Text', value: article.author }] : []),
    ...EXTRA_CREDITS
  ]

  return (
    <div className="article-template">
      <div className="article-template-nav">
        <button
          type="button"
          className="article-template-back"
          onClick={() => navigate('/issues')}
          aria-label="Back to issues"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Issues
        </button>
      </div>

      <header className="article-template-header">
        <h1 className="article-template-title">{article.title}</h1>
        <div className="article-template-meta">
          <span className="article-template-date">{formatDate(article.article_date)}</span>
          {article.author && (
            <>
              <span className="article-template-sep"> | </span>
              <span className="article-template-author">{article.author}</span>
            </>
          )}
        </div>
        {article.description && (
          <p className="article-template-subtitle">{article.description}</p>
        )}
      </header>

      <div className="article-template-content">
        <div className="article-template-body">
          {PARAGRAPHS.map((text, i) => (
            <p key={i} className="article-template-paragraph">{text}</p>
          ))}
        </div>
      </div>

      {images.length > 0 && (
        <div className="article-template-gallery">
          <h3 className="article-template-gallery-title">Gallery</h3>
          <div className="article-template-gallery-grid">
            {images.map((img, index) => (
              <div key={index} className="article-template-gallery-item">
                <img
                  src={img.url}
                  alt={img.name || `Gallery image ${index + 1}`}
                  loading={index < 9 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {allCredits.length > 0 && (
        <div className="article-template-credits">
          <h3 className="article-template-credits-title">Credits</h3>
          <div className="article-template-credits-grid">
            {allCredits.map((credit, i) => (
              <div key={i} className="article-template-credit-item">
                <span className="article-template-credit-label">{credit.label}:</span>
                <span className="article-template-credit-value">{credit.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ArticleTemplate
