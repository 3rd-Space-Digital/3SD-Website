import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getArticleById } from '../../../utils/issuesUtils'
import { getImageUrl } from '../../../utils/supabaseImageRetrieval'
import './ArticleTemplate.css'

const ARTICLE_ID = '0'
const IMAGE_PATH_PREFIX = 'issue/article0'

function ArticleTemplate() {
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
    
    // Set white background on body/html when article loads
    document.body.style.backgroundColor = 'white'
    document.documentElement.style.backgroundColor = 'white'
    
    return () => {
      // Reset on unmount
      document.body.style.backgroundColor = ''
      document.documentElement.style.backgroundColor = ''
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
        <figure className="article-template-hero">
          <img
            src={getImageUrl(`${IMAGE_PATH_PREFIX}/hira_bathroom.png`)}
            alt="Hira Shrestha Looking Over a Men's Bathroom Stall"
          />
          <figcaption className="article-template-caption">
            Hira Shrestha Looking Over a Men's Bathroom Stall
          </figcaption>
        </figure>

        <div className="article-template-body">
          <p className="article-template-paragraph">
            Ecco2k's solo EP PXE, released on YEAR0001 at the end of March, sounds like "throwing a car battery into a washing machine," per his own admission. Accompanied by a full suite of visuals created by Tokyo-based artist Freddy Carrasco, PXE follows Arogundade's remarkable 2019 debut album E. His music was always fascinating, but the momentum of his creative stride has greatly intensified in recent years.
          </p>
          <p className="article-template-paragraph">
            "I discovered what I wanted to say and how I wanted to say it," said Arogundade, describing an extended period of self-discovery that informed both releases and continues to this day. "It made me re-evaluate a lot of my personality and why I am the way I am. This change happened to come about because of a thousand different factors. It was just time for it to happen."
          </p>
        </div>

        <figure className="article-template-two-images">
          <div className="article-template-two-images-grid">
            <div className="article-template-image-wrap">
              <img
                src={getImageUrl(`${IMAGE_PATH_PREFIX}/ecko1.png`)}
                alt="Ecco2k visual"
                className="article-template-image-left"
              />
            </div>
            <div className="article-template-image-wrap">
              <img
                src={getImageUrl(`${IMAGE_PATH_PREFIX}/ecko2.jpg`)}
                alt="Ecco2k visual"
                className="article-template-image-right"
              />
            </div>
          </div>
          <figcaption className="article-template-caption">
            "In a lot of ways I already have what I want. I don't have a goal. There's no objective, there's no end point. I just want to explore and express myself, and that's it."
          </figcaption>
        </figure>

        <div className="article-template-body">
          <p className="article-template-paragraph">
            You're not supposed to say that. When you're a kid, adults ask that all the time, and you have to have a good answer. This is actually a conversation I had with Tobias a few years ago. Our parents' generation, when they were growing up, they weren't necessarily allowed to be whatever they wanted or do what they liked. They had to deal with really strict expectations that they couldn't get out of easily. Then when people like us were growing up, a lot of our parents ended up having the attitude of being different from their parents and raising freer kids. Their attitude was: "You can be whatever you want, you can do whatever you want, but you have to decide what that is. We'll support you or encourage you, but you have to make up your mind." That is really relevant here, because you're not supposed to say that you don't want anything. That's a slap in the face for everything that our parents had to overcome in their lifetime. But at the same time, it doesn't mean that you're not motivated or that you're not passionate. My approach is not a goal-oriented way of doing something; it's more about the love of doing the thing in the first place.
          </p>
        </div>
      </div>

      <div className="article-template-credits">
        <h3 className="article-template-credits-title">Credits</h3>
        <div className="article-template-credits-grid">
          <div className="article-template-credit-item">
            <span className="article-template-credit-label">Text:</span>
            <span className="article-template-credit-value">Prabhas Gade, Alexander Iadarola</span>
          </div>
          <div className="article-template-credit-item">
            <span className="article-template-credit-label">Photography:</span>
            <span className="article-template-credit-value">Hendrik Schneider</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleTemplate
