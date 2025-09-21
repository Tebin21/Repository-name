'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simple authentication check
    if (username === 'admin' && password === 'admin123') {
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
            <div style={{ marginBottom: '1rem' }}>
              <label className="label">ناوی بەکارهێنەر</label>
              <input
                type="text"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ناوی بەکارهێنەر"
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="label">پاسسۆرد</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="پاسسۆرد"
                required
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

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '10px' }}>
            <p style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
              ناوی بەکارهێنەر: admin<br />
              پاسسۆرد: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}