'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const loginStatus = localStorage.getItem('isLoggedIn')
    if (loginStatus === 'true') {
      setIsLoggedIn(true)
    } else {
      router.push('/')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    router.push('/')
  }

  const goToSales = () => {
    router.push('/sales')
  }

  const goToSold = () => {
    router.push('/sold')
  }

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="loading">چاوەڕوان بە...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ minHeight: '100vh', paddingTop: '2rem' }}>
        <h1 className="title">سیستەمی فرۆشتن</h1>
        
        <div className="card">
          <h2 className="subtitle">بەخێربێیت!</h2>
          <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
            ئەم سیستەمە بۆ بەڕێوەبردنی فرۆشتن و کڕینەکانتانە
          </p>

          <div className="grid">
            <div className="card" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', color: 'white', cursor: 'pointer' }} onClick={goToSales}>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>فرۆشتن</h3>
                <p>زیادکردنی کاڵای نوێ بۆ فرۆشتن</p>
              </div>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #27ae60, #2ecc71)', color: 'white', cursor: 'pointer' }} onClick={goToSold}>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>فرۆشراوە</h3>
                <p>بینینی لیستی کاڵا فرۆشراوەکان</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ maxWidth: '200px' }}
            >
              دەرچوون
            </button>
          </div>
        </div>

        <div className="card" style={{ marginTop: '2rem', background: '#f8f9fa' }}>
          <h3 style={{ color: '#333', marginBottom: '1rem' }}>ڕێنمایی بەکارهێنان</h3>
          <ul style={{ color: '#666', lineHeight: '1.8' }}>
            <li>• لە بەشی "فرۆشتن" کاڵای نوێ زیاد بکە</li>
            <li>• لە بەشی "فرۆشراوە" لیستی هەموو کاڵاکان ببینە</li>
            <li>• دەتوانیت داتاکان دەستکاری بکەیت و PDF دەرهێنیت</li>
            <li>• هەموو زانیارییەکان بە شێوەی خۆکار پاشەکەوت دەکرێن</li>
          </ul>
        </div>
      </div>
    </div>
  )
}