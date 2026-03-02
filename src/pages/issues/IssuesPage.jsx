import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getAllArticles } from '../../utils/issuesUtils'
import LoadingScreen from '../../components/LoadingScreen'
import './IssuesPage.css'

function IssuesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const preloadImage = (src) =>
      new Promise((resolve) => {
        if (!src) {
          resolve()
          return
        }

        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve()
        img.src = src
      })

    const load = async () => {
      try {
        const data = await getAllArticles()
        await Promise.all((data || []).map((article) => preloadImage(article.thumbnailUrl)))
        if (!isMounted) return
        setArticles(data || [])
      } catch (error) {
        console.error('Error loading issues:', error)
        if (!isMounted) return
        setArticles([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [searchOpen])

  const q = searchQuery.trim().toLowerCase()
  const filtered = q
    ? articles.filter((article) => article.title.toLowerCase().includes(q))
    : articles
  
  // Filter out template article (id 0)
  const filteredWithoutTemplate = filtered.filter(article => article.id !== 0)

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  const renderIssueCard = (article) => (
    <Link
      key={article.id}
      to={`/issues/${article.id}`}
      className="issue-card"
    >
      <div className="issue-image">
        <img src={article.thumbnailUrl} alt={article.title} />
      </div>
      <div className="issue-card-content">
        <h2 className="issue-title">{article.title}</h2>
        <p className="issue-description">{truncateDescription(article.description) || '\u00A0'}</p>
      </div>
    </Link>
  )
  
    const latest = [...filteredWithoutTemplate]
    .sort((a, b) => new Date(b.article_date) - new Date(a.article_date))
    .slice(0, 3)
    const latestIds = new Set(latest.map(article => article.id))
    const archive = filteredWithoutTemplate.filter(article => !latestIds.has(article.id))

  if (loading) {
    return <LoadingScreen label="Issues" />
  }

  return (
    <div className="issues-page">
      <div className="issues-header">
        <h1 className="issues-title">Issues</h1>
        <div className="issues-search-wrapper">
          {searchOpen ? (
            <>
              <input
                ref={searchInputRef}
                type="text"
                className="issues-search-input"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search issues by title"
              />
              <button
                type="button"
                className="issues-search-close"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="issues-search-icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          )}
        </div>
      </div>

      <div className="issues-section">
        <div className="issues-section-divider">
          <span className="issues-section-title">Latest</span>
        </div>
        <div className="issues-grid issues-grid-latest">
          {latest.length > 0 ? (
            latest.length === 3 ? (
              <>
                {renderIssueCard(latest[0])}
                <div className="issues-grid-latest-stack">
                  {renderIssueCard(latest[1])}
                  {renderIssueCard(latest[2])}
                </div>
              </>
            ) : (
              latest.map(renderIssueCard)
            )
          ) : (
            <p className="issues-empty">No latest issues</p>
          )}
        </div>
      </div>

      <div className="issues-section">
        <div className="issues-section-divider">
          <span className="issues-section-title">Archive</span>
        </div>
        <div className="issues-grid issues-grid-archive">
          {archive.length > 0 ? (
            archive.map(renderIssueCard)
          ) : (
            <p className="issues-empty">No archived issues</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default IssuesPage