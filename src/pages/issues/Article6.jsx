import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getArticleById } from '../../utils/issuesUtils'
import LoadingScreen from '../../components/LoadingScreen'
import './Article6.css'
import heroImage from './Article6Images/hero.jpg'
import flowerRed from './Article6Images/red.png'
import flowerWhite from './Article6Images/white.png'
import flowerPurple from './Article6Images/purple.png'
import flowerYellow from './Article6Images/yellow.png'

const ARTICLE_ID = '6'

const FLOWER_IMAGES = [flowerRed, flowerWhite, flowerPurple, flowerYellow]
const FLOWER_COLUMNS_PER_SIDE = 1
const FLOWER_ITEMS_PER_COLUMN = 14

const ARTICLE_PARAGRAPHS = [
  `Ask the question, “Would you from one year ago like who you are now?”`,
  `How about two years? Then go back as far as five years ago and ask the same question. A few would say yes, some would say no, and a lot would say maybe and talk about tiny comparisons, old expectations, or about their younger selves’s dreams and goals.`,
  `Now ask the question, “Do you like the you now more than the you from a year ago?”`,
  `How about two years? Five years ago? A lot would say yes, some would say no, and a few would point out the nuances about how life was back then, how simple it was, the people they were surrounded by, going on tangent about the things that happened in high school, hinting at the fact they peaked. But the question was about yourself, not anything or anyone else.`,
  `Despite these different answers, you look back on the past and reflect and wonder “when did it all change?”. Then you start replaying all your phases, past relationships, crazy and not so crazy exes, stupid decisions and then great ones, goals and career expectations, so on and so forth. It's a lot. A lot of change stacked on top of itself.`,
  `But despite all of it, some people still feel stuck.`,
  `And that's the confusing part. On paper, everything changed. You changed environments, people, habits, maybe even your goals you were dead set on. You can clearly spot differences between who you were and who you are now. But internally, there's this quiet feeling that nothing has really moved. Like you're carrying the same weight, maybe even more, but just in a different setting.`,
  `That's where growing pains live. We know growth isn't always loud or obvious. It's not always about leveling up or becoming this completely new person overnight. Sometimes it looks like sitting with things you used to avoid. Sometimes it's realizing patterns in yourself that you can't unsee anymore. Sometimes it's understanding why you are the way you are and not being able to blame it on ignorance, life situation, or your parents or anyone for that matter.`,
  `And that's the part that hurts more than the obvious and life changing events that've already happened in life. Because maturing isn't just adding these new objects, friends, hobbies, lifestyles, these things, these layers. It's also peeling them back.`,
  `There's a reason why therapy exists. Not because people are broken, but because looking inward is very uncomfortable. You start digging, and suddenly you're not just dealing with the present. You're unearthing old versions of yourself, old wounds, old beliefs you didn't even realize were still shaping you that you refuse to accept and acknowledge. You realize why you react the way you do, why certain things still affect you, why you've been holding onto things longer than you should. And once you see it, you can't unsee it, just as the same way you were before: blindfolded from your own truths because you choose to see otherwise.`,
  `But now you do. A part of you knows the direction you're moving toward. Another part feels completely unprepared. And that tension, that in between, is so exhausting. You're no longer comfortable being the old version of yourself, but the new version isn't stable yet. So you exist in this middle space. This Limbo.`,
  `Maturity is often imagined as confidence, stability, certainty. But the process of getting there looks nothing like that. Doubt. Confusion. Identity. Frustration. Failures. Unclear Emotions. And somehow, we expect ourselves to arrive there immediately. Healthy, emotionally stable, successful, and certain of our future.`,
  `But what's the big time rush? That's not how growth works. We're allowed to be in the middle of becoming, we don't have to have everything figured out just because we've started figuring things out. We're asked as college students, as early adults to make permanent decisions while we're still forming our identity.`,
  `“Choose a career. Choose your path. Choose your people. Choose your future”`,
  `All the while still trying to understand who you even are. It's like building a car while learning to drive it.`,
  `That's why it feels so uncomfortable. Not because you're doing something wrong, but because you're doing something strange, something normally accepted but ignored, something natural.`,
  `Because you're becoming someone you’ve never been before. But there's something quietly beautiful about it, because uncovering uncomfortable truths, you're getting closer to something real. Not the version of you shaped by expectations, or phases, or other people. Something more honest, something chosen.`,
  `And despite everything, despite every phase, every mistake, every version of you that came and went.`,
  `You’re still you.`,
  `Not the exact same, but not completely different either.`,
  `More aware. More layered. More real.`
]

const FlowerRail = ({ side }) => {
  const columns = Array.from({ length: FLOWER_COLUMNS_PER_SIDE }, (_, columnIndex) => {
    const items = Array.from({ length: FLOWER_ITEMS_PER_COLUMN }, (_, i) => {
      const src = FLOWER_IMAGES[(i + columnIndex) % FLOWER_IMAGES.length]
      return (
        <img
          key={`${side}-img-${columnIndex}-${i}`}
          className="article6-flower"
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
        />
      )
    })

    const directionClass = columnIndex % 2 === 0 ? 'article6-flower-col--down' : 'article6-flower-col--up'
    const speedClass = columnIndex === 1 ? 'article6-flower-col--slow' : columnIndex === 2 ? 'article6-flower-col--fast' : ''

    return (
      <div
        key={`${side}-col-${columnIndex}`}
        className={`article6-flower-col ${directionClass} ${speedClass}`.trim()}
        aria-hidden="true"
      >
        <div className="article6-flower-track">{items}</div>
        <div className="article6-flower-track" aria-hidden="true">{items}</div>
      </div>
    )
  })

  return (
    <div className={`article6-flower-rail article6-flower-rail--${side}`} aria-hidden="true">
      {columns}
    </div>
  )
}

function Article6() {
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
      <div className="article6 article6-error">
        <div className="article6-error-text">
          <h2>{error || 'Article not found'}</h2>
          <Link to="/issues" className="article6-back-link">← Back to Issues</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="article6">
      <div className="article6-nav">
        <button
          type="button"
          className="article6-back"
          onClick={() => navigate('/issues')}
          aria-label="Back to issues"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Issues
        </button>
      </div>

      <header className="article6-header">
        <h1 className="article6-title">{article.title}</h1>
        <div className="article6-meta">
          <span className="article6-date">{formatDate(article.article_date)}</span>
          {article.author && (
            <>
              <span className="article6-sep"> | </span>
              <span className="article6-author">{article.author}</span>
            </>
          )}
        </div>
      </header>

      <div className="article6-main">
        <div className="article6-flower-rails" aria-hidden="true">
          <FlowerRail side="left" />
          <FlowerRail side="right" />
        </div>

        <div className="article6-content">
          <figure className="article6-hero">
            <img
              src={heroImage}
              alt={article.title || 'Issue hero'}
            />
          </figure>
          {article.description && (
            <p className="article6-subtitle">{article.description}</p>
          )}

          <div className="article6-body">
            {ARTICLE_PARAGRAPHS.map((paragraph, idx) => (
              <p key={`p-${idx}`} className="article6-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="article6-credits">
          <h3 className="article6-credits-title">Credits</h3>
          <div className="article6-credits-grid">
            {article.author && (
              <div className="article6-credit-item">
                <span className="article6-credit-label">Author:</span>
                <span className="article6-credit-value">{article.author}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Article6

