'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simple authentication check - password only
    if (password === '1212') {
      // Store login status in localStorage
      localStorage.setItem('isLoggedIn', 'true')
      setError('')
      // Show success message briefly before redirect
      setError('سەرکەوتوو بویت!')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else {
      setError('پاسسۆردەکە خەلەتە')
    }
    
    setLoading(false)
  }

  return (
    <div className="container">
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
          <h1 className="title" style={{ color: '#333', textShadow: 'none' }}>سیستەمی فرۆشتن</h1>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="label">پاسسۆرد</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="پاسسۆردەکە بنووسە"
                required
                style={{ fontSize: '18px', padding: '15px' }}
              />
            </div>

            {error && (
              <div className={error === 'سەرکەوتوو بویت!' ? 'success' : 'error'}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn"
              disabled={loading}
            >
              {loading ? 'چوونە ژوورەوە...' : 'چوونە ژوورەوە'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#e8f5e8', borderRadius: '10px', border: '2px solid #4CAF50' }}>
            <p style={{ fontSize: '16px', color: '#2e7d32', textAlign: 'center', fontWeight: 'bold' }}>
              پاسسۆرد: 1212
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}