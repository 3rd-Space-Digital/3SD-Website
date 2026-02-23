import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getArchiveFolders, getArchiveFolderImages, getArchiveByFolderName } from '../utils/archiveUtils'
import './ArchivePage.css'

function ArchivePage() {
  const { folderName: urlFolderName } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [selectedArchiveMetadata, setSelectedArchiveMetadata] = useState(null)
  const [folderImages, setFolderImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalImageIndex, setModalImageIndex] = useState(null)
  const fromEventId = searchParams.get('fromEvent')

  // Categorize folders into Event Photos and Photoshoots based on category field
  // Each category is sorted independently by date
  const categorizeFolders = (folders) => {
    const eventPhotos = []
    const photoshoots = []
    
    folders.forEach(folder => {
      // Use category field from database instead of folder name
      if (folder.category === 'event') {
        eventPhotos.push(folder)
      } else {
        photoshoots.push(folder)
      }
    })
    
    // Sort each category by date (newest first), then by name if no date
    const sortByDate = (a, b) => {
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date)
      }
      if (a.date) return -1
      if (b.date) return 1
      return a.folderName.localeCompare(b.folderName)
    }
    
    eventPhotos.sort(sortByDate)
    photoshoots.sort(sortByDate)
    
    return { eventPhotos, photoshoots }
  }

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const archiveFolders = await getArchiveFolders()
        setFolders(archiveFolders)
        
        // If URL parameter exists, automatically select that folder
        if (urlFolderName) {
          const decodedFolderName = decodeURIComponent(urlFolderName)
          const folderExists = archiveFolders.some(f => f.folderName === decodedFolderName)
          if (folderExists) {
            setSelectedFolder(decodedFolderName)
            // Fetch metadata for the selected archive
            const metadata = await getArchiveByFolderName(decodedFolderName)
            setSelectedArchiveMetadata(metadata)
            try {
              const images = await getArchiveFolderImages(decodedFolderName)
              setFolderImages(images)
            } catch (error) {
              console.error('Error fetching folder images:', error)
              setFolderImages([])
            }
          }
        }
      } catch (error) {
        console.error('Error fetching archive folders:', error)
        setFolders([])
      } finally {
        setLoading(false)
      }
    }
    fetchFolders()
  }, [urlFolderName])

  const handleFolderClick = async (folderName) => {
    navigate(`/archive/${encodeURIComponent(folderName)}`)
    setSelectedFolder(folderName)
    // Fetch metadata for the selected archive
    const metadata = await getArchiveByFolderName(folderName)
    setSelectedArchiveMetadata(metadata)
    try {
      const images = await getArchiveFolderImages(folderName)
      setFolderImages(images)
    } catch (error) {
      console.error('Error fetching folder images:', error)
      setFolderImages([])
    }
  }

  const handleBackClick = () => {
    if (fromEventId) {
      // If navigated from an event, go back to that event
      navigate(`/events/${fromEventId}`)
    } else {
      // Otherwise, go back to archive list
      navigate('/archive')
    }
    setSelectedFolder(null)
    setSelectedArchiveMetadata(null)
    setFolderImages([])
  }

  const handleImageClick = (index) => {
    setModalImageIndex(index)
  }

  const handleCloseModal = () => {
    setModalImageIndex(null)
  }

  const handleNextImage = () => {
    if (modalImageIndex !== null && modalImageIndex < folderImages.length - 1) {
      setModalImageIndex(modalImageIndex + 1)
    }
  }

  const handlePrevImage = () => {
    if (modalImageIndex !== null && modalImageIndex > 0) {
      setModalImageIndex(modalImageIndex - 1)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    if (modalImageIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setModalImageIndex(null)
      } else if (e.key === 'ArrowRight' && modalImageIndex < folderImages.length - 1) {
        setModalImageIndex(modalImageIndex + 1)
      } else if (e.key === 'ArrowLeft' && modalImageIndex > 0) {
        setModalImageIndex(modalImageIndex - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalImageIndex, folderImages.length])

  if (loading) {
    return (
      <main className="archive-page">
        <div className="archive-header">
          <div className="archive-loading">Loading archives...</div>
        </div>
      </main>
    )
  }

  if (selectedFolder) {
    return (
      <main className="archive-page">
        <div className="archive-view-header">
          <button className="archive-back-button" onClick={handleBackClick}>
            ← Back
          </button>
          <h1 className="archive-folder-title">{selectedFolder}</h1>
        </div>
        <div className="archive-images-grid">
          {folderImages.map((image, index) => {
            const shouldLoadEagerly = index < 9
            return (
              <div 
                key={index} 
                className="archive-image-item"
                onClick={() => handleImageClick(index)}
              >
                <img 
                  src={image.url} 
                  alt={image.name}
                  loading={shouldLoadEagerly ? "eager" : "lazy"}
                />
              </div>
            )
          })}
        </div>
        {selectedArchiveMetadata && selectedArchiveMetadata.photographers && (
          <div className="archive-credits">
            Photo Credits:{' '}
            {selectedArchiveMetadata.photographers.map((photographer, index) => (
              <span key={index}>
                {index > 0 && ', '}
                <a 
                  href={photographer.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="archive-credits-link"
                >
                  {photographer.name}
                </a>
              </span>
            ))}
          </div>
        )}
        
        {/* Modal */}
        {modalImageIndex !== null && (
          <div className="archive-modal" onClick={handleCloseModal}>
            <button 
              className="archive-modal-close"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              ×
            </button>
            {modalImageIndex > 0 && (
              <button 
                className="archive-modal-prev"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevImage()
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}
            <div className="archive-modal-content" onClick={(e) => e.stopPropagation()}>
              <img 
                src={folderImages[modalImageIndex].url} 
                alt={folderImages[modalImageIndex].name}
              />
            </div>
            {modalImageIndex < folderImages.length - 1 && (
              <button 
                className="archive-modal-next"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNextImage()
                }}
                aria-label="Next image"
              >
                ›
              </button>
            )}
          </div>
        )}
      </main>
    )
  }

  const { eventPhotos, photoshoots } = categorizeFolders(folders)

  return (
    <main className="archive-page">
      <div className="archive-header">
        <h1 className="archive-title">Select an Archive</h1>
      </div>

      {/* Event Photos Section */}
      <div className="archive-section">
        <div className="archive-section-divider">
          <span className="archive-section-title">Event Photos</span>
        </div>
        <div className="archive-folders-grid">
          {eventPhotos.length > 0 ? (
            eventPhotos.map((folder) => (
              <div
                key={folder.folderName}
                className="archive-folder-card"
                onClick={() => handleFolderClick(folder.folderName)}
              >
                <div className="archive-folder-thumbnail">
                  <img src={folder.thumbnailUrl} alt={folder.folderName} />
                </div>
                <div className="archive-folder-name">{folder.folderName}</div>
                <div className="archive-folder-count">{folder.imageCount} images</div>
              </div>
            ))
          ) : (
            <div className="archive-empty" style={{ gridColumn: '1 / -1' }}>No event photos found</div>
          )}
        </div>
      </div>

      {/* Photoshoots Section */}
      <div className="archive-section">
        <div className="archive-section-divider">
          <span className="archive-section-title">Photoshoots</span>
        </div>
        <div className="archive-folders-grid">
          {photoshoots.length > 0 ? (
            photoshoots.map((folder) => (
              <div
                key={folder.folderName}
                className="archive-folder-card"
                onClick={() => handleFolderClick(folder.folderName)}
              >
                <div className="archive-folder-thumbnail">
                  <img src={folder.thumbnailUrl} alt={folder.folderName} />
                </div>
                <div className="archive-folder-name">{folder.folderName}</div>
                <div className="archive-folder-count">{folder.imageCount} images</div>
              </div>
            ))
          ) : (
            <div className="archive-empty" style={{ gridColumn: '1 / -1' }}>No photoshoots found</div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ArchivePage