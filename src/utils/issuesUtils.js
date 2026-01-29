import { supabase } from '../config/supabase'
import { getImageUrl } from './supabaseImageRetrieval'

export const getArticleThumbnailUrl = async (articleId) => {
  try {
    const { data: files, error } = await supabase.storage
      .from('images')
      .list(`issue/article${articleId}`, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      })
    if (error || !files?.length) return ''
    const img = files.find((f) => f.id != null && /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name))
    return img ? getImageUrl(`article/article${articleId}/${img.name}`) : ''
  } catch (e) {
    return ''
  }
}

export const getArticleImages = async (articleId) => {
  try {
    const { data: files, error } = await supabase.storage
      .from('images')
      .list(`issue/article${articleId}`, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) {
      console.error('Error listing article images:', error)
      return []
    }

    if (!files || files.length === 0) return []

    return files
      .filter((f) => f.id != null && /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name))
      .map((f) => ({
        name: f.name,
        url: getImageUrl(`issue/article${articleId}/${f.name}`)
      }))
  } catch (e) {
    console.error('Error fetching article images:', e)
    return []
  }
}

export const getAllArticles = async () => {
  try {
    const { data, error } = await supabase
      .from('article')
      .select('*')
      .order('article_date', { ascending: false })

    if (error) {
      console.error('Error fetching articles:', error)
      return []
    }

    const withThumbs = await Promise.all(
      (data || []).map(async (article) => ({
        ...article,
        thumbnailUrl: await getArticleThumbnailUrl(article.id)
      }))
    )
    return withThumbs
  } catch (e) {
    console.error('Error fetching all articles:', e)
    return []
  }
}

export const getArticleById = async (id) => {
  try {
    const numId = parseInt(id, 10)
    if (Number.isNaN(numId)) return null

    const { data, error } = await supabase
      .from('article')
      .select('*')
      .eq('id', numId)
      .single()

    if (error || !data) return null

    const thumbnailUrl = await getArticleThumbnailUrl(data.id)
    return { ...data, thumbnailUrl }
  } catch (e) {
    console.error('Error fetching article by id:', e)
    return null
  }
}