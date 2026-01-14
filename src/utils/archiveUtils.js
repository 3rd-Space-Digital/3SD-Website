import { supabase } from '../config/supabase'
import { getImageUrl } from './supabaseImageRetrieval'

export const getArchiveFolders = async () => {
  try {
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

    const archives = []
    
    for (const item of allFiles) {
      const isFolder = item.id === null
      
      if (isFolder) {
        const folderName = item.name
        
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
          
          archives.push({
            folderName: folderName,
            thumbnailUrl: thumbnailUrl,
            imageCount: imageFiles.length
          })
        }
      }
    }

    return archives.sort((a, b) => a.folderName.localeCompare(b.folderName))
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

