import { supabase } from '../config/supabase'

export const getImageUrl = (filePath) => {
    const { data } = supabase.storage.from('images').getPublicUrl(filePath)
    return data.publicUrl
  }