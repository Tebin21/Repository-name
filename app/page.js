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
          <h1 className="title" style={{ color: '#333', textShadow: 'none' }}>سیستەمی فرۆشتن - Auto Deploy ✨</h1>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">پاسسۆرد</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="پاسسۆردەکە بنووسە"
                required
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'چوونە ژوورەوە...' : 'چوونە ژوورەوە'}
            </button>
          </form>

          <style jsx>{`
            body {
              margin: 0;
              padding: 0;
              font-family: 'Arial', sans-serif;
              background: linear-gradient(135deg, #1a1a1a 0%, #2d1b1b 50%, #1a1a1a 100%);
              min-height: 100vh;
              position: relative;
              overflow-x: hidden;
            }
            
            body::before {
              content: '';
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: 
                radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(220, 38, 38, 0.05) 0%, transparent 50%);
              pointer-events: none;
              z-index: -1;
            }
            
            .card {
              background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
              backdrop-filter: blur(20px);
              border-radius: 24px;
              padding: 50px;
              box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(220, 38, 38, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.6);
              border: 2px solid rgba(220, 38, 38, 0.1);
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              position: relative;
              overflow: hidden;
            }
            
            .card::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.05), transparent);
              transition: left 0.6s ease;
            }
            
            .card:hover::before {
              left: 100%;
            }
            
            .card:hover {
              transform: translateY(-8px) scale(1.02);
              box-shadow: 
                0 35px 70px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(220, 38, 38, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.8);
              border-color: rgba(220, 38, 38, 0.2);
            }
            
            .title {
              font-size: 3rem;
              font-weight: 900;
              text-align: center;
              margin-bottom: 2.5rem;
              background: linear-gradient(135deg, #dc2626 0%, #1f2937 50%, #dc2626 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-shadow: 0 4px 8px rgba(220, 38, 38, 0.2);
              position: relative;
              z-index: 1;
            }
            
            .form-group {
              margin-bottom: 2rem;
              position: relative;
            }
            
            .form-label {
              display: block;
              margin-bottom: 0.75rem;
              font-weight: 700;
              color: #1f2937;
              font-size: 1.1rem;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .form-input {
              width: 100%;
              padding: 16px 20px;
              border: 3px solid #e5e7eb;
              border-radius: 16px;
              font-size: 1.1rem;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              background: linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
              box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
              font-weight: 600;
            }
            
            .form-input:focus {
              outline: none;
              border-color: #dc2626;
              box-shadow: 
                0 0 0 4px rgba(220, 38, 38, 0.15),
                inset 0 2px 4px rgba(0, 0, 0, 0.05);
              background: rgba(255, 255, 255, 1);
              transform: translateY(-2px);
            }
            
            .btn-primary {
              width: 100%;
              padding: 18px;
              background: linear-gradient(135deg, #dc2626 0%, #1f2937 50%, #dc2626 100%);
              color: white;
              border: none;
              border-radius: 16px;
              font-size: 1.2rem;
              font-weight: 800;
              cursor: pointer;
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              margin-top: 1.5rem;
              text-transform: uppercase;
              letter-spacing: 1px;
              box-shadow: 
                0 10px 25px rgba(220, 38, 38, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
              position: relative;
              overflow: hidden;
            }
            
            .btn-primary::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
              transition: left 0.6s ease;
            }
            
            .btn-primary:hover::before {
              left: 100%;
            }
            
            .btn-primary:hover {
              transform: translateY(-4px) scale(1.05);
              box-shadow: 
                0 20px 40px rgba(220, 38, 38, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }
            
            .btn-primary:active {
              transform: translateY(-2px) scale(1.02);
            }
            
            .error-message {
              background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
              color: #dc2626;
              padding: 16px 20px;
              border-radius: 12px;
              margin-bottom: 1.5rem;
              border-left: 6px solid #dc2626;
              font-weight: 600;
              box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
              backdrop-filter: blur(10px);
            }
          `}</style>

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