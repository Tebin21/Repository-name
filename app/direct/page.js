'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DirectAccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Automatically log in and redirect to dashboard
    localStorage.setItem('isLoggedIn', 'true')
    
    // Show loading for a brief moment then redirect
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }, [router])

  return (
    <div className="container">
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <h1 className="title" style={{ color: '#333', textShadow: 'none' }}>سیستەمی فرۆشتن</h1>
          
          <div style={{ margin: '2rem 0' }}>
            <div className="spinner" style={{ 
              width: '40px', 
              height: '40px', 
              margin: '0 auto 1rem',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #ff6b6b'
            }}></div>
            <p style={{ color: '#666', fontSize: '18px' }}>
              چوونە ژوورەوە...
            </p>
          </div>

          <div style={{ padding: '1rem', background: '#e8f5e8', borderRadius: '10px', border: '1px solid #4caf50' }}>
            <p style={{ fontSize: '14px', color: '#2e7d32', margin: 0 }}>
              ✅ ئۆتۆماتیک چوویتە ژوورەوە
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}