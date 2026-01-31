import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../config/supabase'

function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams.get('code')
      const errorParam = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (errorParam) {
        console.error('OAuth error:', errorParam, errorDescription || '')
        navigate(`/?error=oauth&message=${encodeURIComponent(errorDescription || errorParam)}`)
        return
      }

      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            console.error('Exchange code error:', error)
            navigate(`/?error=exchange&message=${encodeURIComponent(error.message)}`)
            return
          }
          if (data.session) {
            navigate('/')
            return
          }
        } catch (err) {
          console.error('Unexpected error exchanging code:', err)
          navigate('/?error=unexpected')
          return
        }
      }

      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/?error=auth_failed')
          return
        }
        if (data.session) {
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
  }, [navigate, searchParams])

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