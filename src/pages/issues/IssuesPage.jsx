import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getAllIssues } from '../../utils/issuesUtils'
import './IssuesPage.css'

function IssuesPage() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef(null)

  useEffect(() => {
    getAllIssues().then((data) => {
      setIssues(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [searchOpen])

  const now = new Date()
  const q = searchQuery.trim().toLowerCase()
  const filtered = q
    ? issues.filter((i) => i.title.toLowerCase().includes(q))
    : issues
  const latest = filtered.filter((i) => new Date(i.issue_date) >= now)
  const archive = filtered.filter((i) => new Date(i.issue_date) < now)

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

      {/* Latest Issues Section */}
      <div className="issues-section">
        <div className="issues-section-divider">
          <span className="issues-section-title">Latest</span>
        </div>
        <div className="issues-grid">
          {latest.length > 0 ? (
            latest.map(issue => (
              <Link 
                key={issue.id} 
                to={`/issues/${issue.id}`}
                className="issue-card"
              >
                <div className="issue-image">
                  <img src={issue.thumbnailUrl} alt={issue.title} />
                </div>
                <h2 className="issue-title">{issue.title}</h2>
                {issue.description && (
                  <p className="issue-description">{issue.description}</p>
                )}
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
            archive.map(issue => (
              <Link 
                key={issue.id} 
                to={`/issues/${issue.id}`}
                className="issue-card"
              >
                <div className="issue-image">
                  <img src={issue.thumbnailUrl} alt={issue.title} />
                </div>
                <h2 className="issue-title">{issue.title}</h2>
                {issue.description && (
                  <p className="issue-description">{issue.description}</p>
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