import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/?error=auth_failed')
          return
        }

        if (data.session) {
          // Successfully authenticated
          navigate('/')
        } else {
          navigate('/?error=no_session')
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        navigate('/?error=unexpected')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <p>Completing sign in...</p>
    </div>
  )
}

export default AuthCallback