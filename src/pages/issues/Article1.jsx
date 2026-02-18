import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getArticleById } from '../../utils/issuesUtils'
import { getImageUrl } from '../../utils/supabaseImageRetrieval'
import './Article1.css'

const ARTICLE_ID = '1'
const IMAGE_PATH_PREFIX = 'issue/article1'

function Article1() {
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
      <div className="article1 article1-loading">
        <div className="article1-loading-text">Loading article...</div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="article1 article1-error">
        <div className="article1-error-text">
          <h2>{error || 'Article not found'}</h2>
          <Link to="/issues" className="article1-back-link">← Back to Issues</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="article1">
      <div className="article1-nav">
        <button
          type="button"
          className="article1-back"
          onClick={() => navigate('/issues')}
          aria-label="Back to issues"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Issues
        </button>
      </div>

      <header className="article1-header">
        <h1 className="article1-title">{article.title}</h1>
        <div className="article1-meta">
          <span className="article1-date">{formatDate(article.article_date)}</span>
          {article.author && (
            <>
              <span className="article1-sep"> | </span>
              <span className="article1-author">{article.author}</span>
            </>
          )}
        </div>
        {article.description && (
          <p className="article1-subtitle">{article.description}</p>
        )}
      </header>

      <div className="article1-content">
        <figure className="article1-hero">
          <img
            src={getImageUrl(`${IMAGE_PATH_PREFIX}/tu1.jpg`)}
            alt="Tuesdaz Urban Photo Meet-Up"
          />
          <figcaption className="article1-caption">
            Unique People, Unique Styles.
          </figcaption>
        </figure>

        <div className="article1-body">
          <p className="article1-paragraph">
            Imagine with me now, it's about 20 degrees outside on the dimly lit streets of Deep Ellum. You just left your car in a super sketchy back alley and you're wondering if you had the right address, when suddenly the warm glow of an unassuming record store catches your eye. With the only other option being your untimely demise in this Texas winter, you muster up the courage to finally walk inside. And suddenly,without warning, you've been sucked into another dimension, buzzing with music, color, and a personality big enough to swallow you whole. This past month, Tuesdaz Urban — a creative space in Dallas built for Black, brown, and LGBTQ photographers — teamed up with Get Records With Me to host their New Talent Photo Meet‑Up, a space for aspiring models and photographers alike to hone their skills, network, and have a good time.
          </p>
          <p className="article1-paragraph">
            Ok, I'll admit being the most underdressed person in that room definitely did not do my nerves any favors, but after a 30 minute car ride worth of motivational podcasts there's no way I was turning back. So begrudgingly, I entered. The only thing I can really compare walking into this record store to is that scene from Dr.Who when they enter that telephone box. At a first glance the front door is unassuming, but as soon as you walk in your first realization is just how much of an optical illusion this place is. With high lofted ceilings, multiple floors, and walls littered with posters, I couldn't help but get distracted by how cool of a space Get Records With Me was able to put together.
          </p>
        </div>

        <figure className="article1-two-images">
          <div className="article1-two-images-grid">
            <div className="article1-image-wrap">
              <img
                src={getImageUrl(`${IMAGE_PATH_PREFIX}/tu2.jpg`)}
                alt="Tuesdaz Urban Photo Meet-Up"
                className="article1-image-left"
              />
            </div>
            <div className="article1-image-wrap">
              <img
                src={getImageUrl(`${IMAGE_PATH_PREFIX}/tu3.jpg`)}
                alt="Tuesdaz Urban Photo Meet-Up"
                className="article1-image-right"
              />
            </div>
          </div>
          <figcaption className="article1-caption">
            In Places Like This, Inspiration Is Everywhere
          </figcaption>
        </figure>

        <div className="article1-body">
          <p className="article1-paragraph">
            But even with all that visual character, the space quickly became secondary to the people in it. The room was full of creatives with wildly different styles and personalities, and that diversity set the tone for the entire night. One minute you'd find yourself talking to somebody covered head to toe in early‑2000s cyber‑grunge, and the next you'd be face‑to‑face with someone who looked like they'd stepped straight off a Vogue cover, fur coat and all. In such an interconnected space bustling with conversation I knew I had to meet the mastermind behind it all.
          </p>
          <p className="article1-paragraph">
            Navigating through a sea of fishnets, septum piercings, and leather jackets I was excited to finally meet Destiny, the ring leader behind this whole operation. In our conversation, they explained that the idea for Tuesdaz Urban came from noticing just how few photographers were represented in traditional gallery spaces. "Tuesdaz Urban is an artist hub for Black, brown, and LGBTQ individuals in Dallas," they told me, adding that the project began after attending a gallery show where only one or two photographers were featured. That moment pushed them to imagine something different, a space where underrepresented creatives could not only gather, but present their work in a gallery‑like setting and reach wider audiences. For Destiny, building community wasn't an afterthought; it was the entire point.
          </p>
          <p className="article1-paragraph">
            As we talked, I had an opportunity to see just what went on behind the scenes to put together an event of this scope.They spoke highly of Get Records With Me, the LGBTQ‑run record store hosting the event, and how meaningful that collaboration was. "They're really, really cool," Destiny told me. "Just them holding the space for individuals like us to come in and create this networking or events in general means a lot, because not many LGBTQ individuals are holding spaces for creatives." As the night went on it became pretty clear to me that opportunities like this, although rare, were greatly appreciated by the community.
          </p>
          <p className="article1-paragraph">
            Beyond the flash photography and flashier outfits however, what stood out most throughout the night was the stories people carried with them. Anthony, one of the featured models, told me that spaces like this helped him rediscover the sense of community he had been missing since moving to Texas. "Everybody out here is so supportive," he said. "It doesn't matter if you're a model, a stylist, a photographer. People want to see you win." Staevan, another attendee, shared a similar feeling from a model's perspective and described the meet‑up as a rare chance to connect across mediums. "I come out here and I network as much as I can," he told me. "You meet so many different people." For both of them, the night wasn't just an event, but an opportunity to stay connected with like minded community otherwise sparse throughout the Dallas area.
          </p>
          <p className="article1-paragraph">
            As the night wound down, I felt like Dorothy from The Wizard of Oz saying goodbye to her ragtag cast of characters. After the routine exchanges of contacts and half‑promised future collaborations, I figured it was probably time to head back to Kansas. But in the solemn car ride home I couldn't help but laugh. Amidst the faded vintage tees, maxi skirts, and archive japanese denim, I realized everyone there was a little nervous, a little unsure, maybe a little hesitant, but they showed up anyway. They showed up on a saturday night in 20 degree weather because they were chasing something bigger than a good photo. They were looking for connection, for a place to be seen, for community. And somewhere between the bright flashes, awkward laughs, and honest conversations, I came to realize that too.
          </p>
        </div>

        <figure className="article1-two-images">
          <div className="article1-two-images-grid">
            <div className="article1-image-wrap">
              <img
                src={getImageUrl(`${IMAGE_PATH_PREFIX}/tu4.jpg`)}
                alt="Tuesdaz Urban Photo Meet-Up"
                className="article1-image-left"
              />
            </div>
            <div className="article1-image-wrap">
              <img
                src={getImageUrl(`${IMAGE_PATH_PREFIX}/tu5.jpg`)}
                alt="Tuesdaz Urban Photo Meet-Up"
                className="article1-image-right"
              />
            </div>
          </div>
          <figcaption className="article1-caption">
            Creatives From Every Category Sharing Their Craft
          </figcaption>
        </figure>
      </div>

      <div className="article1-credits">
        <h3 className="article1-credits-title">Credits</h3>
        <div className="article1-credits-grid">
          <div className="article1-credit-item">
            <span className="article1-credit-label">Author:</span>
            <span className="article1-credit-value">Emeka Ohumaegbulem</span>
          </div>
          <div className="article1-credit-item">
            <span className="article1-credit-label">Photography:</span>
            <span className="article1-credit-value">Emeka Ohumaegbulem</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Article1
