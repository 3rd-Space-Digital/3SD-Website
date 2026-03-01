import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getArticleById } from '../../utils/issuesUtils'
import { getImageUrl } from '../../utils/supabaseImageRetrieval'
import './Article3.css'

const ARTICLE_ID = '3'
const IMAGE_PATH_PREFIX = 'issue/article3'
const FALLBACK_TITLE = 'Ace of Hearts'
const FALLBACK_AUTHOR = 'Jeyem Paule'

const ARTICLE_PARAGRAPHS = [
  'Hearts, roses, chocolates, cards, basket gifts, aesthetic posts of significant others and friends of dates and hangouts. On the other hand: quiet loneliness, scrolling past couples online, checking on ex’s page when we promised we wouldn’t. A heightened awareness of our own singledom',
  'When we think of February, the first thing that pops up in most people\'s heads is Valentine’s Day.',
  'Every year, restaurants, stores, and workplaces dress themselves with red and pink as a subtle reminder of the month to declare our love to one another, to friends, to family, and to partners. A holiday, a reason to spend time, money, and energy for our public and private declarations of affection. Yet with good intentions and genuine celebrations, why does it feel almost empty?',
  'How can a month of love feel so unwholesome? Even with these displays of vulnerability and honesty, it almost feels, dare I say, performative?',
  'The absurdity is in the peripherals.',
  'We live in the golden age of information. We know how to say the right things, know the right captions, angles, aesthetics. But we also live in an age where marketing is so nuanced it subconsciously makes us want to buy things, do things, and need things. Marketing these days doesn’t shout, it whispers to our ears. It nudges our heads into what love should look like, what it should cost, and how it should be displayed.',
  'But we know how to show love. But how do we practice it? Because in February, loving others is celebrated, and loving ourselves is postponed.',
  'We always pour into relationships, friendships, families, but in February it feels forcefully intensified. Especially in a STEM focused school, we get bogged down with early waves of midterms, deliverables, and project deadlines. We show up, we give, we compromise, we stretch, we abuse and put ourselves in situations we know we don’t want to be in, all for the betterment of something or someone. And somewhere in all those selfless acts, we neglect the one person who carries us every season: ourselves.',
  'We neglect the one person who deserves our love the most. We neglect our Ace of hearts. The one running on empty, the one pushing through burnout, the one mistaking exhaustion from devotion. Maybe that’s why it feels so empty. Not because the love in February is hollow, but because we’ve limited it.',
  'February was never meant to be the month of outward declarations. February doesn’t have to be about proving our worth through who or what chooses us. It can be about choosing ourselves. About unearthing passions we buried under obligation. About fighting for our peace, our freedom, and our becoming.',
  'February is not just the month of love, it’s the month of unearthing, the month we remember that our individuality is worth fighting for, that we are worth fighting for.',
  'Now let’s see and hope what March brings.'
]

function Article3() {
  const navigate = useNavigate()
  const [article, setArticle] = useState({
    title: FALLBACK_TITLE,
    author: FALLBACK_AUTHOR,
    article_date: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await getArticleById(ARTICLE_ID)
        if (!isMounted) return

        if (data) {
          setArticle((prev) => ({
            ...prev,
            ...data,
            title: data.title || FALLBACK_TITLE,
            author: data.author || FALLBACK_AUTHOR
          }))
          setError(null)
        } else {
          setError('Article not found')
        }
      } catch (err) {
        console.error('Error loading article 3:', err)
        setError('Failed to load article')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()

    document.body.style.backgroundColor = '#000'
    document.documentElement.style.backgroundColor = '#000'

    return () => {
      isMounted = false
      document.body.style.removeProperty('background-color')
      document.documentElement.style.removeProperty('background-color')
    }
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return null

    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formattedDate = formatDate(article.article_date)

  if (loading) {
    return (
      <div className="article3 article3-loading">
        <div className="article3-loading-text">Loading article...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="article3 article3-error">
        <div className="article3-error-text">
          <h2>{error}</h2>
          <Link to="/issues" className="article3-back-link">← Back to Issues</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="article3">
      <div className="article3-nav">
        <button
          type="button"
          className="article3-back"
          onClick={() => navigate('/issues')}
          aria-label="Back to issues"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Issues
        </button>
      </div>

      <header className="article3-header">
        <h1 className="article3-title">{article.title || FALLBACK_TITLE}</h1>
        <div className="article3-meta">
          <span className="article3-date">{formattedDate || ''}</span>
          {(article.author || FALLBACK_AUTHOR) && (
            <>
              <span className="article3-sep"> | </span>
              <span className="article3-author">{article.author || FALLBACK_AUTHOR}</span>
            </>
          )}
        </div>
      </header>

      <div className="article3-content">
        <figure className="article3-hero">
          <img
            src={getImageUrl(`${IMAGE_PATH_PREFIX}/thumbnail.webp`)}
            alt="Ace of Hearts"
          />
        </figure>

        <div className="article3-body">
          {ARTICLE_PARAGRAPHS.map((paragraph, idx) => (
            <p key={`p-${idx}`} className="article3-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="article3-credits">
        <h3 className="article3-credits-title">Credits</h3>
        <div className="article3-credits-grid">
          <div className="article3-credit-item">
            <span className="article3-credit-label">Author:</span>
            <span className="article3-credit-value">{article.author || FALLBACK_AUTHOR}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Article3
