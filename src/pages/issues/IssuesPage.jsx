import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getAllArticles } from '../../utils/issuesUtils'
import './IssuesPage.css'

function IssuesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef(null)

  useEffect(() => {
    getAllArticles().then((data) => {
      setArticles(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [searchOpen])

  const q = searchQuery.trim().toLowerCase()
  const filtered = q
    ? articles.filter((article) => article.title.toLowerCase().includes(q))
    : articles
  
    const latest = [...filtered]
    .sort((a, b) => new Date(b.article_date) - new Date(a.article_date))
    .slice(0, 3)
    const latestIds = new Set(latest.map(article => article.id))
    const archive = filtered.filter(article => !latestIds.has(article.id))

  if (loading) {
    return (
      <div className="issues-page">
        <div className="issues-loading">Loading issues...</div>
      </div>
    )
  }

  return (
    <div className="issues-page">
      {/* Header */}
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

      {/* Latest Articles Section */}
      <div className="issues-section">
        <div className="issues-section-divider">
          <span className="issues-section-title">Latest</span>
        </div>
        <div className="issues-grid">
          {latest.length > 0 ? (
            latest.map(article => (
              <Link 
                key={article.id} 
                to={`/issues/${article.id}`}
                className="issue-card"
              >
                <div className="issue-image">
                  <img src={article.thumbnailUrl} alt={article.title} />
                </div>
                <h2 className="issue-title">{article.title}</h2>
                {article.description && (
                  <p className="issue-description">{article.description}</p>
                )}
                <h3 className="issue-author">{article.author}</h3>
              </Link>
            ))
          ) : (
            <p className="issues-empty">No latest issues</p>
          )}
        </div>
      </div>

      {/* Archive Section */}
      <div className="issues-section">
        <div className="issues-section-divider">
          <span className="issues-section-title">Archive</span>
        </div>
        <div className="issues-grid">
          {archive.length > 0 ? (
            archive.map(article => (
              <Link 
                key={article.id} 
                to={`/issues/${article.id}`}
                className="issue-card"
              >
                <div className="issue-image">
                  <img src={article.thumbnailUrl} alt={article.title} />
                </div>
                <h2 className="issue-title">{article.title}</h2>
                {article.description && (
                  <p className="issue-description">{article.description}</p>
                )}
              </Link>
            ))
          ) : (
            <p className="issues-empty">No archived issues</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default IssuesPage