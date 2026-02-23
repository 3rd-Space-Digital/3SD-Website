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
          navigate('/?error=auth_failed', { replace: true })
          return
        }

        if (data.session) {
          if (window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname)
          }
          navigate('/', { replace: true })
        } else {
          navigate('/?error=no_session', { replace: true })
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        navigate('/?error=unexpected', { replace: true })
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