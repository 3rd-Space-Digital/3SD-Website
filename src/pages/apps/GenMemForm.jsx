import { useState } from 'react'
import emailjs from '@emailjs/browser'
import './GenMemForm.css'

function GenMemForm({ searchQuery, filteredRoles, onSubmitStatus }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    role: '',
    year: '',
    major: '',
    whyJoin: '',
    skills: '',
    availability: '',
    portfolioUrl: '',
    linkedinUrl: ''
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // year options
  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate Student']

  // initialize emailJS with your public key
  const EMAILJS_PUBLIC_KEY = 'jWy-mESeSJ-aei3xe'
  const EMAILJS_SERVICE_ID = 'service_ktyizqw'
  const EMAILJS_TEMPLATE_ID = 'template_3fke0u9' // Replace with your template ID

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid'
    if (!formData.role) errors.role = 'Please select a role'
    if (!formData.whyJoin.trim()) errors.whyJoin = 'Please tell us why you want to join'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      // email template parameters
      const templateParams = {
        to_email: '3rddspacedigital@gmail.com',
        from_name: formData.fullName,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        student_id: formData.studentId || 'Not provided',
        role: formData.role,
        year: formData.year || 'Not provided',
        major: formData.major || 'Not provided',
        why_join: formData.whyJoin,
        skills: formData.skills || 'Not provided',
        availability: formData.availability || 'Not provided',
        portfolio: formData.portfolioUrl || 'Not provided',
        linkedin: formData.linkedinUrl || 'Not provided',
        submission_date: new Date().toLocaleString()
      }

      // send email using EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )

      onSubmitStatus('success')
      // reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        studentId: '',
        role: '',
        year: '',
        major: '',
        whyJoin: '',
        skills: '',
        availability: '',
        portfolioUrl: '',
        linkedinUrl: ''
      })
    } catch (error) {
      console.error('Error submitting application:', error)
      onSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="genmem-form-container">
      <div className="genmem-section">
        <div className="genmem-section-divider">
          <span className="genmem-section-title">General Membership Application</span>
        </div>
        <p className="genmem-description">
          Join our community! We have rolling admissions for all teams. 
          Select the role that best fits your interests and skills.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="genmem-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={formErrors.fullName ? 'error' : ''}
          />
          {formErrors.fullName && <span className="error-message">{formErrors.fullName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={formErrors.email ? 'error' : ''}
            />
            {formErrors.email && <span className="error-message">{formErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Year</label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
            >
              <option value="">Select year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="major">Major</label>
          <input
            type="text"
            id="major"
            name="major"
            value={formData.major}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role/Team *</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className={formErrors.role ? 'error' : ''}
          >
            <option value="">Select a role</option>
            {filteredRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {formErrors.role && <span className="error-message">{formErrors.role}</span>}
          {searchQuery && filteredRoles.length === 0 && (
            <span className="info-message">No roles match "{searchQuery}"</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="whyJoin">Why do you want to join 3SD? *</label>
          <textarea
            id="whyJoin"
            name="whyJoin"
            rows="4"
            value={formData.whyJoin}
            onChange={handleInputChange}
            className={formErrors.whyJoin ? 'error' : ''}
            placeholder="Tell us about your interest in our club and what you hope to contribute..."
          />
          {formErrors.whyJoin && <span className="error-message">{formErrors.whyJoin}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="skills">Relevant Skills & Experience</label>
          <textarea
            id="skills"
            name="skills"
            rows="3"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="List any relevant skills, projects, or experience..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="availability">Weekly Availability</label>
          <textarea
            id="availability"
            name="availability"
            rows="2"
            value={formData.availability}
            onChange={handleInputChange}
            placeholder="e.g., Available Monday/Wednesday after 2pm, weekends..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="portfolioUrl">Portfolio/Website URL</label>
            <input
              type="url"
              id="portfolioUrl"
              name="portfolioUrl"
              value={formData.portfolioUrl}
              onChange={handleInputChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="linkedinUrl">LinkedIn URL</label>
            <input
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  )
}

export default GenMemForm