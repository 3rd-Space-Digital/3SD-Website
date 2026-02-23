import { supabase } from '../config/supabase'
import { getImageUrl } from './supabaseImageRetrieval'

export const getArchiveThumbnailUrl = async (folderName) => {
  try {
    const { data: folderFiles, error: folderError } = await supabase.storage
      .from('images')
      .list(`archive/${folderName}`, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })
    
    if (folderError || !folderFiles) {
      return ''
    }
    
    const imageFiles = folderFiles.filter(f => 
      f.id !== null &&
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name)
    )
    
    if (imageFiles.length > 0) {
      const firstImage = imageFiles[0].name
      return getImageUrl(`archive/${folderName}/${firstImage}`)
    }
    
    return ''
  } catch (error) {
    console.error(`Error fetching thumbnail for ${folderName}:`, error)
    return ''
  }
}

export const getArchiveFolders = async () => {
  try {
    // First, get all folders from storage
    const { data: allFiles, error: listError } = await supabase.storage
      .from('images')
      .list('archive', {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (listError) {
      console.error('Error listing files:', listError)
      return []
    }

    if (!allFiles || allFiles.length === 0) {
      return []
    }

    // Get all folders (items with id === null)
    const storageFolders = allFiles
      .filter(item => item.id === null)
      .map(item => item.name)

    // Fetch archive records from database table
    const { data: archiveRecords, error: dbError } = await supabase
      .from('archive')
      .select('*')

    // Create a map of name -> record for quick lookup
    const archiveMap = new Map()
    if (archiveRecords && !dbError) {
      archiveRecords.forEach(record => {
        archiveMap.set(record.name, record)
      })
    }

    // Process all folders from storage
    const archives = []
    
    for (const folderName of storageFolders) {
      const record = archiveMap.get(folderName)
      
      // Check if folder has images
      const { data: folderFiles, error: folderError } = await supabase.storage
        .from('images')
        .list(`archive/${folderName}`, {
          limit: 1000,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        })
      
      if (folderError) {
        console.error(`Error listing folder ${folderName}:`, folderError)
        continue
      }
      
      const imageFiles = folderFiles?.filter(f => 
        f.id !== null &&
        /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name)
      ) || []
      
      if (imageFiles.length > 0) {
        const firstImage = imageFiles[0].name
        const thumbnailUrl = getImageUrl(`archive/${folderName}/${firstImage}`)
        
        // Parse photographer data - support both single and multiple photographers
        let photographers = []
        if (record?.photographer_name && record?.photographer_instagram) {
          // Check if it's JSON array format for multiple photographers
          try {
            const names = JSON.parse(record.photographer_name)
            const links = JSON.parse(record.photographer_instagram)
            if (Array.isArray(names) && Array.isArray(links) && names.length === links.length) {
              photographers = names.map((name, index) => ({
                name: name,
                instagram: links[index] || ''
              }))
            } else {
              // Single photographer
              photographers = [{
                name: record.photographer_name,
                instagram: record.photographer_instagram
              }]
            }
          } catch (e) {
            // Not JSON, treat as single photographer
            photographers = [{
              name: record.photographer_name,
              instagram: record.photographer_instagram
            }]
          }
        } else {
          // Default photographer
          photographers = [{
            name: 'Andrew John',
            instagram: 'https://www.instagram.com/_iso.media_/'
          }]
        }
        
        // Use database record if exists, otherwise use defaults
        const archive = {
          id: record?.id || null,
          folderName: folderName,
          thumbnailUrl: thumbnailUrl,
          imageCount: imageFiles.length,
          photographers: photographers,
          date: record?.date || null,
          category: record?.category || (folderName.toLowerCase().includes('event') ? 'event' : 'photoshoot')
        }
        
        archives.push(archive)
      }
    }

    // Sort by date (records with dates first, then by name)
    return archives.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date)
      }
      if (a.date) return -1
      if (b.date) return 1
      return a.folderName.localeCompare(b.folderName)
    })
  } catch (error) {
    console.error('Error fetching archive folders:', error)
    return []
  }
}

export const getArchiveFolderImages = async (folderName) => {
  try {
    const { data: files, error } = await supabase.storage
      .from('images')
      .list(`archive/${folderName}`, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) {
      console.error('Error listing folder images:', error)
      return []
    }

    if (!files || files.length === 0) {
      return []
    }

    const images = files
      .filter(file => 
        !file.name.endsWith('/') &&
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
      )
      .map(file => {
        const imagePath = `archive/${folderName}/${file.name}`
        return {
          name: file.name,
          url: getImageUrl(imagePath)
        }
      })

    return images
  } catch (error) {
    console.error('Error fetching folder images:', error)
    return []
  }
}

/**
 * Gets archive metadata by folder name
 * @param {string} folderName - The name of the archive folder
 * @returns {Promise<object|null>} - Archive record with metadata or null if not found
 */
export const getArchiveByFolderName = async (folderName) => {
  if (!folderName) return null
  
  try {
    // Try to get from database first
    const { data, error } = await supabase
      .from('archive')
      .select('*')
      .eq('name', folderName)
      .single()

    if (data && !error) {
      // Parse photographer data - support both single and multiple photographers
      let photographers = []
      if (data.photographer_name && data.photographer_instagram) {
        try {
          const names = JSON.parse(data.photographer_name)
          const links = JSON.parse(data.photographer_instagram)
          if (Array.isArray(names) && Array.isArray(links) && names.length === links.length) {
            photographers = names.map((name, index) => ({
              name: name,
              instagram: links[index] || ''
            }))
          } else {
            photographers = [{
              name: data.photographer_name,
              instagram: data.photographer_instagram
            }]
          }
        } catch (e) {
          photographers = [{
            name: data.photographer_name,
            instagram: data.photographer_instagram
          }]
        }
      } else {
        photographers = [{
          name: 'Andrew John',
          instagram: 'https://www.instagram.com/_iso.media_/'
        }]
      }
      
      return {
        id: data.id,
        folderName: data.name,
        photographers: photographers,
        date: data.date,
        category: data.category || 'photoshoot'
      }
    }

    // If no database record, return defaults based on folder name
    return {
      id: null,
      folderName: folderName,
      photographers: [{
        name: 'Andrew John',
        instagram: 'https://www.instagram.com/_iso.media_/'
      }],
      date: null,
      category: folderName.toLowerCase().includes('event') ? 'event' : 'photoshoot'
    }
  } catch (error) {
    console.error('Error fetching archive by folder name:', error)
    // Return defaults if error
    return {
      id: null,
      folderName: folderName,
      photographers: [{
        name: 'Andrew John',
        instagram: 'https://www.instagram.com/_iso.media_/'
      }],
      date: null,
      category: folderName.toLowerCase().includes('event') ? 'event' : 'photoshoot'
    }
  }
}

/**
 * Checks if an archive folder exists for a given folder name
 * @param {string} folderName - The name of the archive folder to check
 * @returns {Promise<boolean>} - True if the folder exists and has images, false otherwise
 */
export const archiveFolderExists = async (folderName) => {
  if (!folderName) return false
  
  try {
    // Check if images exist in storage (primary check)
    const { data: files } = await supabase.storage
      .from('images')
      .list(`archive/${folderName}`, {
        limit: 1,
        offset: 0
      })

    if (!files || files.length === 0) {
      return false
    }

    // Check if there's at least one image file
    const hasImages = files.some(file => 
      file.id !== null &&
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
    )

    return hasImages
  } catch (error) {
    console.error('Error checking archive folder:', error)
    return false
  }
}

