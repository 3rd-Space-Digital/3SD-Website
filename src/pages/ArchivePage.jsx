import { useState, useEffect } from 'react'
import { getArchiveFolders, getArchiveFolderImages } from '../utils/archiveUtils'
import './ArchivePage.css'

function ArchivePage() {
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [folderImages, setFolderImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const archiveFolders = await getArchiveFolders()
        setFolders(archiveFolders)
      } catch (error) {
        console.error('Error fetching archive folders:', error)
        setFolders([])
      } finally {
        setLoading(false)
      }
    }
    fetchFolders()
  }, [])

  const handleFolderClick = async (folderName) => {
    setSelectedFolder(folderName)
    try {
      const images = await getArchiveFolderImages(folderName)
      setFolderImages(images)
    } catch (error) {
      console.error('Error fetching folder images:', error)
      setFolderImages([])
    }
  }

  const handleBackClick = () => {
    setSelectedFolder(null)
    setFolderImages([])
  }

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
              <div key={index} className="archive-image-item">
                <img 
                  src={image.url} 
                  alt={image.name}
                  loading={shouldLoadEagerly ? "eager" : "lazy"}
                />
              </div>
            )
          })}
        </div>
      </main>
    )
  }

  return (
    <main className="archive-page">
      <div className="archive-header">
        <h1 className="archive-title">Select an archive</h1>
      </div>
      <div className="archive-folders-grid">
        {folders.length === 0 ? (
          <div className="archive-empty" style={{ gridColumn: '1 / -1' }}>No archives found</div>
        ) : (
          folders.map((folder) => (
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
        )}
      </div>
    </main>
  )
}

export default ArchivePage