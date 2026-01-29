import { supabase } from '../config/supabase'
import { getImageUrl } from './supabaseImageRetrieval'

// used eventUtils as reference

export const getIssueThumbnailUrl = async (issueId) => {
  try {
    const { data: files, error } = await supabase.storage
      .from('images')
      .list(`issue/issue${issueId}`, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      })
    if (error || !files?.length) return ''
    const img = files.find((f) => f.id != null && /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name))
    return img ? getImageUrl(`issue/issue${issueId}/${img.name}`) : ''
  } catch (e) {
    return ''
  }
}

export const getIssueImages = async (issueId) => {
  try {
    const { data: files, error } = await supabase.storage
      .from('images')
      .list(`issue/issue${issueId}`, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) {
      console.error('Error listing issue images:', error)
      return []
    }

    if (!files || files.length === 0) return []

    return files
      .filter((f) => f.id != null && /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name))
      .map((f) => ({
        name: f.name,
        url: getImageUrl(`issue/issue${issueId}/${f.name}`)
      }))
  } catch (e) {
    console.error('Error fetching issue images:', e)
    return []
  }
}

export const getAllIssues = async () => {
  try {
    const { data, error } = await supabase
      .from('issue')
      .select('*')
      .order('issue_date', { ascending: false })

    if (error) {
      console.error('Error fetching issues:', error)
      return []
    }

    const withThumbs = await Promise.all(
      (data || []).map(async (i) => ({
        ...i,
        thumbnailUrl: await getIssueThumbnailUrl(i.id)
      }))
    )
    return withThumbs
  } catch (e) {
    console.error('Error fetching all issues:', e)
    return []
  }
}

export const getIssueById = async (id) => {
  try {
    const numId = parseInt(id, 10)
    if (Number.isNaN(numId)) return null

    const { data, error } = await supabase
      .from('issue')
      .select('*')
      .eq('id', numId)
      .single()

    if (error || !data) return null

    const thumbnailUrl = await getIssueThumbnailUrl(data.id)
    return { ...data, thumbnailUrl }
  } catch (e) {
    console.error('Error fetching issue by id:', e)
    return null
  }
}