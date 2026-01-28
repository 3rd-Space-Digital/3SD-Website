import { supabase } from '../config/supabase'
import { getImageUrl } from './supabaseImageRetrieval'

export const getEventThumbnailUrl = (eventId) => {
  return getImageUrl(`events/event${eventId}/thumbnail.jpg`)
}

export const getEventImages = async (eventId) => {
  try {
    const { data: files, error } = await supabase.storage
      .from('images')
      .list(`events/event${eventId}`, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) {
      console.error('Error listing event images:', error)
      return []
    }

    if (!files || files.length === 0) return []

    return files
      .filter((f) => f.id != null && /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name))
      .map((f) => ({
        name: f.name,
        url: getImageUrl(`events/event${eventId}/${f.name}`)
      }))
  } catch (e) {
    console.error('Error fetching event images:', e)
    return []
  }
}

export const getAllEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('event')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching events:', error)
      return []
    }

    return (data || []).map((e) => ({
      ...e,
      thumbnailUrl: getEventThumbnailUrl(e.id)
    }))
  } catch (e) {
    console.error('Error fetching all events:', e)
    return []
  }
}

export const getEventById = async (id) => {
  try {
    const numId = parseInt(id, 10)
    if (Number.isNaN(numId)) return null

    const { data, error } = await supabase
      .from('event')
      .select('*')
      .eq('id', numId)
      .single()

    if (error || !data) return null

    return {
      ...data,
      thumbnailUrl: getEventThumbnailUrl(data.id)
    }
  } catch (e) {
    console.error('Error fetching event by id:', e)
    return null
  }
}
