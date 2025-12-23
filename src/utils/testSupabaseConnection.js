import { supabase } from '../config/supabase'

/**
 * Tests the Supabase connection on application startup
 * Logs results to the console
 */
export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...')

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase connection failed: Missing environment variables')
    console.error('   Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env')
    return false
  }
  
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      // Check if it's a connection error vs auth error
      if (sessionError.message.includes('fetch') || 
          sessionError.message.includes('network') ||
          sessionError.message.includes('Failed to fetch')) {
        throw new Error('Network/connection error: ' + sessionError.message)
      }
    }
    
    console.log('✅ Supabase connection successful!')
    console.log('   URL:', supabaseUrl.substring(0, 30) + '...')
    return true
    
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
    
    // Provide helpful debugging info
    if (error.message.includes('fetch') || error.message.includes('network')) {
      console.error('   This might be a CORS issue or network problem.')
      console.error('   Check your Supabase URL:', supabaseUrl)
    }
    
    return false
  }
}