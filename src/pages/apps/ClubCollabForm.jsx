import { useState } from 'react'
import emailjs from '@emailjs/browser'
import './ClubCollabForm.css'

function ClubCollabForm({ onSubmitStatus }) {
  const [formData, setFormData] = useState({
    clubName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    eventIdea: '',
    proposedDate: '',
    expectedAttendance: '',
    collaborationType: '',
    resourcesNeeded: '',
    additionalNotes: ''
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // collaboration types
  const collaborationTypes = [
    'Co-host Event',
    'Sponsorship',
    'Workshop Collaboration',
    'Social Event',
    'Other'
  ]

  // emailJS configuration
  const EMAILJS_PUBLIC_KEY = 'jWy-mESeSJ-aei3xe'
  const EMAILJS_SERVICE_ID = 'service_ktyizqw'
  const EMAILJS_TEMPLATE_ID = 'template_0ae8jlh'

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.clubName.trim()) errors.clubName = 'Club name is required'
    if (!formData.contactName.trim()) errors.contactName = 'Contact name is required'
    if (!formData.contactEmail.trim()) errors.contactEmail = 'Contact email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) errors.contactEmail = 'Email is invalid'
    if (!formData.eventIdea.trim()) errors.eventIdea = 'Please describe your event idea'
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
      // email template parameters for club collaboration
      const templateParams = {
        to_email: '3rddspacedigital@gmail.com',
        club_name: formData.clubName,
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone || 'Not provided',
        event_idea: formData.eventIdea,
        proposed_date: formData.proposedDate || 'Not specified',
        expected_attendance: formData.expectedAttendance || 'Not specified',
        collaboration_type: formData.collaborationType || 'Not specified',
        resources_needed: formData.resourcesNeeded || 'Not provided',
        additional_notes: formData.additionalNotes || 'Not provided',
        submission_date: new Date().toLocaleString()
      }

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )

      onSubmitStatus('success')
      // reset form
      setFormData({
        clubName: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        eventIdea: '',
        proposedDate: '',
        expectedAttendance: '',
        collaborationType: '',
        resourcesNeeded: '',
        additionalNotes: ''
      })
    } catch (error) {
      console.error('Error submitting collaboration request:', error)
      console.error('Error details:', error.text)
      onSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="clubcollab-form-container">
      <div className="clubcollab-section">
        <div className="clubcollab-section-divider">
          <span className="clubcollab-section-title">Club Collaboration Application</span>
        </div>
        <p className="clubcollab-description">
          Interested in collaborating with 3SD? Fill out this form and we'll reach out to discuss 
          potential event partnerships, workshops, and other collaboration opportunities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="clubcollab-form">
        <div className="form-group">
          <label htmlFor="clubName">Club/Organization Name *</label>
          <input
            type="text"
            id="clubName"
            name="clubName"
            value={formData.clubName}
            onChange={handleInputChange}
            className={formErrors.clubName ? 'error' : ''}
          />
          {formErrors.clubName && <span className="error-message">{formErrors.clubName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contactName">Contact Person Name *</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              className={formErrors.contactName ? 'error' : ''}
            />
            {formErrors.contactName && <span className="error-message">{formErrors.contactName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contactEmail">Contact Email *</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              className={formErrors.contactEmail ? 'error' : ''}
            />
            {formErrors.contactEmail && <span className="error-message">{formErrors.contactEmail}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contactPhone">Contact Phone</label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="collaborationType">Collaboration Type</label>
            <select
              id="collaborationType"
              name="collaborationType"
              value={formData.collaborationType}
              onChange={handleInputChange}
            >
              <option value="">Select type</option>
              {collaborationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="eventIdea">Event Idea / Collaboration Proposal *</label>
          <textarea
            id="eventIdea"
            name="eventIdea"
            rows="4"
            value={formData.eventIdea}
            onChange={handleInputChange}
            className={formErrors.eventIdea ? 'error' : ''}
            placeholder="Describe your event idea, goals, and how you envision collaborating with 3SD..."
          />
          {formErrors.eventIdea && <span className="error-message">{formErrors.eventIdea}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="proposedDate">Proposed Date</label>
            <input
              type="date"
              id="proposedDate"
              name="proposedDate"
              value={formData.proposedDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expectedAttendance">Expected Attendance</label>
            <input
              type="text"
              id="expectedAttendance"
              name="expectedAttendance"
              value={formData.expectedAttendance}
              onChange={handleInputChange}
              placeholder="e.g., 50-100 people"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="resourcesNeeded">Resources Needed</label>
          <textarea
            id="resourcesNeeded"
            name="resourcesNeeded"
            rows="3"
            value={formData.resourcesNeeded}
            onChange={handleInputChange}
            placeholder="List any resources, equipment, or support you'd need from 3SD..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalNotes">Additional Notes</label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            rows="3"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            placeholder="Any other information you'd like to share..."
          />
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Collaboration Request'}
        </button>
      </form>
    </div>
  )
}

export default ClubCollabForm