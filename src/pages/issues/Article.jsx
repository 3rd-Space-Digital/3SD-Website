import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getArticleById, getArticleImages } from '../../utils/issuesUtils'
import './Article.css'

function Article() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadArticle()
  }, [id])

  const loadArticle = async () => {
    try {
      setLoading(true)
      const articleData = await getArticleById(id)
      
      if (!articleData) {
        setError('Article not found')
        setLoading(false)
        return
      }
      
      const articleImages = await getArticleImages(id)
      setArticle(articleData)
      setImages(articleImages)
      setError(null)
    } catch (err) {
      console.error('Error loading article:', err)
      setError('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

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
      <div className="article-page">
        <div className="article-loading">Loading article...</div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="article-page">
        <div className="article-error">
          <h2>{error || 'Article not found'}</h2>
          <Link to="/issues" className="back-button">
            ← Back to Issues
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="article-page">
      {/* Navigation */}
      <div className="article-nav">
        <button 
          onClick={() => navigate('/issues')}
          className="back-button"
          aria-label="Back to issues"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Issues
        </button>
      </div>

      {/* Article Header */}
      <header className="article-header">
        <div className="article-meta">
          <span className="article-date">{formatDate(article.article_date)}</span>
          {article.author && (
            <span className="article-author">By {article.author}</span>
          )}
        </div>
        
        <h1 className="article-title">{article.title}</h1>
        
        {article.description && (
          <p className="article-subtitle">{article.description}</p>
        )}
      </header>

      {/* Featured Image */}
      {article.thumbnailUrl && (
        <div className="article-featured-image">
          <img 
            src={article.thumbnailUrl} 
            alt={article.title}
            loading="lazy"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="article-content">
        <div className="article-body">
          <p>{article.description}</p>
        </div>

        {/* Gallery Images */}
        {images.length > 0 && (
          <div className="article-gallery">
            <h3 className="gallery-title">Gallery</h3>
            <div className="gallery-grid">
              {images.map((img, index) => (
                <div key={index} className="gallery-item">
                  <img 
                    src={img.url} 
                    alt={`Gallery image ${index + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="article-footer">
        <div className="article-share">
          <span className="share-label">Share:</span>
          <button className="share-button" aria-label="Share on Facebook">
            <i className="fa-brands fa-facebook"></i>
          </button>
          <button className="share-button" aria-label="Share on Twitter">
            <i className="fa-brands fa-twitter"></i>
          </button>
          <button className="share-button" aria-label="Copy link">
            <i className="fa-solid fa-link"></i>
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Article