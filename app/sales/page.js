'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SalesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    address: '',
    date: '',
    description: '',
    quantity: '',
    price: ''
  })
  
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const loginStatus = localStorage.getItem('isLoggedIn')
    if (loginStatus === 'true') {
      setIsLoggedIn(true)
    } else {
      router.push('/')
    }

    // Set current date as default
    const today = new Date().toISOString().split('T')[0]
    setFormData(prev => ({ ...prev, date: today }))
  }, [router])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString()
        }),
      })

      if (response.ok) {
        setMessage('کاڵاکە بە سەرکەوتوویی زیادکرا!')
        // Reset form
        setFormData({
          name: '',
          number: '',
          address: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
          quantity: '',
          price: ''
        })
      } else {
        setMessage('هەڵەیەک ڕوویدا، تکایە دووبارە هەوڵ بدەوە')
      }
    } catch (error) {
      setMessage('هەڵەیەک ڕوویدا، تکایە دووبارە هەوڵ بدەوە')
    }

    setLoading(false)
  }

  const goBack = () => {
    router.push('/dashboard')
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
      <div style={{ minHeight: '100vh', paddingTop: '1rem' }}>
        <h1 className="title">زیادکردنی کاڵای نوێ</h1>
        
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="label">ناو</label>
              <input
                type="text"
                name="name"
                className="input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="ناوی کاڵاکە"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="label">رەقەم</label>
              <input
                type="text"
                name="number"
                className="input"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="رەقەمی کاڵاکە"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="label">ناونیشان</label>
              <input
                type="text"
                name="address"
                className="input"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="ناونیشانی کڕیار"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="label">بەروار</label>
              <input
                type="date"
                name="date"
                className="input"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="label">وەسف</label>
              <textarea
                name="description"
                className="input"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="وەسفی کاڵاکە"
                rows="3"
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="label">چەند دانە</label>
              <input
                type="number"
                name="quantity"
                className="input"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="ژمارەی دانە"
                min="0"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="label">نرخ</label>
              <input
                type="number"
                name="price"
                className="input"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="نرخی کاڵاکە"
                min="0"
                step="0.01"
              />
            </div>

            {message && (
              <div className={message.includes('سەرکەوتوویی') ? 'success' : 'error'}>
                {message}
              </div>
            )}

            <div className="grid">
              <button 
                type="submit" 
                className="btn"
                disabled={loading}
              >
                {loading ? 'زیادکردن...' : 'زیادکردن'}
              </button>
              
              <button 
                type="button" 
                onClick={goBack}
                className="btn btn-secondary"
              >
                گەڕانەوە
              </button>
            </div>
          </form>
        </div>

        <div className="card" style={{ background: '#f8f9fa', marginTop: '1rem' }}>
          <h3 style={{ color: '#333', marginBottom: '1rem' }}>تێبینی</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            هەموو خانەکان ئیختیاری بن. تەنها ئەو زانیارییانە پڕ بکەوە کە پێویستن.
            دوای زیادکردنی کاڵاکە، دەتوانیت لە بەشی "فرۆشراوە" ببینیتەوە.
          </p>
        </div>
      </div>
    </div>
  )
}