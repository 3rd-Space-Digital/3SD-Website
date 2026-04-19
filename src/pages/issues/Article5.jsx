import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getArticleById } from '../../utils/issuesUtils'
import { getImageUrl } from '../../utils/supabaseImageRetrieval'
import LoadingScreen from '../../components/LoadingScreen'
import './Article5.css'

const ARTICLE_ID = '5'
const IMAGE_PATH_PREFIX = 'issue/article5'

const img = (name) => getImageUrl(`${IMAGE_PATH_PREFIX}/${name}`)

function Article5() {
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
      <div className="article5 article5-error">
        <div className="article5-error-text">
          <h2>{error || 'Article not found'}</h2>
          <Link to="/issues" className="article5-back-link">← Back to Issues</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="article5">
      <div className="article5-nav">
        <button
          type="button"
          className="article5-back"
          onClick={() => navigate('/issues')}
          aria-label="Back to issues"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Issues
        </button>
      </div>

      <header className="article5-header">
        <h1 className="article5-title">{article.title}</h1>
        <div className="article5-meta">
          <span className="article5-date">{formatDate(article.article_date)}</span>
          {article.author && (
            <>
              <span className="article5-sep"> | </span>
              <span className="article5-author">{article.author}</span>
            </>
          )}
        </div>
      </header>

      <div className="article5-content">
        <figure className="article5-hero">
          <img
            src={img('thumbnail.webp')}
            alt={article.title || 'Issue hero'}
          />
        </figure>
        {article.description && (
          <p className="article5-subtitle">{article.description}</p>
        )}

        <div className="article5-body">
          <p className="article5-paragraph">
            We drive down a random hill, see a lone security guard, and we know we&apos;re in the right
            place. Driving in, we see outfits of all kinds with the confidence to back them up. This show
            has been anticipated for months and it&apos;s finally coming to fruition. Nerves run high and
            you wonder if you even belong in a space like this, but the moment you walk in those nerves fade
            and excitement takes over. Everyone is talking with everyone, meeting and connecting as much as
            they can. The vibes were great from the matcha by the entrance, to the cameras at the end of the
            runway, to the jazz band on the opposite side. You could tell Monochrome Collective had a night in
            store for everyone in attendance.
          </p>
        </div>

        <h2 className="article5-section-heading">Monochromatic Elegance</h2>
        <div className="article5-body">
          <p className="article5-paragraph">
            The show opened with a striking rose gold dress, complete with shoulder draping and a flowing
            bottom hem, as the model walked with slow confidence and memorability. She knows the world stares
            at her and she invites it to. As the jazz ensemble plays in the background, similar themes of
            elegance, formality, and mystery surround the first half of the show with highlights such as a
            dress with huge belts holding it together, a shimmering metallic dress paired with a huge belt and
            red gloves to disrupt the image, and a final look with an umbrella reminiscent of the trees in the
            Lorax shrouding the models upper body in mystery. After the first half, I spoke with JT, the
            stylist behind the first half of the collection. &quot;I drew inspiration from Versace&apos;s 90s
            runway. I wanted a vintage 90s look.&quot;
          </p>
        </div>

        <figure className="article5-three-images">
          <div className="article5-three-images-grid">
            <div className="article5-image-wrap">
              <img src={img('1.webp')} alt="Runway look 1" />
            </div>
            <div className="article5-image-wrap">
              <img src={img('2.webp')} alt="Runway look 2" />
            </div>
            <div className="article5-image-wrap article5-image-wrap--obj-nudge-x">
              <img src={img('3.webp')} alt="Runway look 3" />
            </div>
          </div>
          <figcaption className="article5-caption">
            The safety clip dress for Versace Spring/Summer 1994 Photographed by Richard Avedon
          </figcaption>
        </figure>

        <h2 className="article5-section-heading">Monochromatic Confidence</h2>
        <div className="article5-body">
          <p className="article5-paragraph">
            Thirty minutes pass in a flash and the second half begins with slightly faster musical
            accompaniment from the ensemble, and a new atmosphere on the runway. This half is characterized
            with a lot more audacity and spunk contrasting the composed elegance of the first, with the first
            three looks showing a lot more skin and form for the models. Some highlights included a suit
            jacket with mirrors reflecting the light of the fashion world, a dress with frills from top to
            bottom completely concealing any of the models features besides her face, and a two piece harem
            pants inspired look with hoop like appendages covering the limbs of the body. This half showcased
            raw creativity through fashion design, atmosphere, and emotion conveyed by the models.
          </p>
        </div>

        <figure className="article5-single-image">
          <img src={img('4.webp')} alt="Runway moment" />
        </figure>

        <h2 className="article5-section-heading">Final Moments</h2>
        <div className="article5-body">
          <p className="article5-paragraph">
            For the final part of the runway, the models and the owners performed a clap walk, clapping for
            themselves as the crowd applauded the efforts of the models and the team behind the show. After a
            few closing words from the owners of the show, we were released to meet everyone else at the venue.
            Immediately, you could feel the energy and the community in the air, everyone talking and meeting
            with everyone, getting to know fashion designers, stylists, photographers, and more. No one felt out
            of reach, and attendees took the opportunity to meet designers, stylists, photographers, and others in
            the industry, connect on instagram, plan future events, and take photos, as fashion enthusiasts
            often do. When asked what the purpose of the show was, co-owner Monico Zarate, said &quot;to create
            a safe haven for creatives and show them that Dallas is also on the rise.&quot;
          </p>
        </div>

        <figure className="article5-two-images">
          <div className="article5-two-images-grid">
            <div className="article5-image-wrap">
              <img src={img('5.webp')} alt="Runway look 5" className="article5-image-left" />
            </div>
            <div className="article5-image-wrap">
              <img src={img('6.webp')} alt="Runway look 6" className="article5-image-right" />
            </div>
          </div>
        </figure>
      </div>

      <div className="article5-credits">
        <h3 className="article5-credits-title">Credits</h3>
        <div className="article5-credits-grid">
          <div className="article5-credit-item">
            <span className="article5-credit-label">Author:</span>
            <span className="article5-credit-value">
              <a
                href="https://www.instagram.com/archive.oos/"
                target="_blank"
                rel="noopener noreferrer"
                className="article5-credit-link"
              >
                Tomiwa Sodeinde
              </a>
            </span>
          </div>
          <div className="article5-credit-item">
            <span className="article5-credit-label">Photography:</span>
            <span className="article5-credit-value">
              <a
                href="https://www.instagram.com/emeka_0/"
                target="_blank"
                rel="noopener noreferrer"
                className="article5-credit-link"
              >
                Emeka Ohumaegbulem
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Article5
