import { useState, useEffect, useRef } from 'react'
import GenMemForm from './GenMemForm'
import ClubCollabForm from './ClubCollabForm'
import './AppsPage.css'

function AppsPage() {
  const [activeForm, setActiveForm] = useState('general') // 'general' or 'club'
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', null

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  // roles for searching
  const roles = [
    'Web Dev',
    'Marketing',
    'Graphics',
    'Ambassadors',
    'Photographers',
    'Models'
  ]

  // filter roles based on search query
  const filteredRoles = searchQuery
    ? roles.filter(role => 
        role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : roles

  const handleFormSubmit = (status) => {
    setSubmitStatus(status)
    // clear status after 5sec
    setTimeout(() => setSubmitStatus(null), 5000)
  }

  return (
    <div className="apps-page">
      <div className="apps-header">
        <h1 className="apps-title">Applications</h1>
        <div className="apps-search-wrapper">
          {searchOpen ? (
            <>
              <input
                ref={searchInputRef}
                type="text"
                className="apps-search-input"
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search roles"
              />
              <button
                type="button"
                className="apps-search-close"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="apps-search-icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          )}
        </div>
      </div>

      {/* diff application tabs */}
      <div className="apps-section">
        <div className="apps-section-divider"></div>
        <div className="apps-tabs">
          <button
            className={`apps-tab ${activeForm === 'general' ? 'active' : ''}`}
            onClick={() => setActiveForm('general')}
          >
            General Membership
          </button>
          <button
            className={`apps-tab ${activeForm === 'club' ? 'active' : ''}`}
            onClick={() => setActiveForm('club')}
          >
            Club Collaboration
          </button>
        </div>
      </div>

      {submitStatus === 'success' && (
        <div className="apps-success-message">
          <i className="fa-solid fa-check-circle"></i>
          <p>Application submitted successfully! We'll get back to you soon.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="apps-error-message">
          <i className="fa-solid fa-exclamation-circle"></i>
          <p>There was an error submitting your application. Please try again.</p>
        </div>
      )}

      {activeForm === 'general' && (
        <GenMemForm 
          searchQuery={searchQuery}
          filteredRoles={filteredRoles}
          onSubmitStatus={handleFormSubmit}
        />
      )}

      {activeForm === 'club' && (
        <ClubCollabForm onSubmitStatus={handleFormSubmit} />
      )}
    </div>
  )
}

export default AppsPage