'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SalesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
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

  const validateForm = () => {
    const newErrors = {}
    
    // Check required fields
    if (!formData.name.trim()) {
      newErrors.name = 'ناو پێویستە'
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'ژمارەی دانە پێویستە و دەبێت زیاتر لە سفر بێت'
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'نرخ پێویستە و دەبێت زیاتر لە سفر بێت'
    }
    
    if (!formData.date) {
      newErrors.date = 'بەروار پێویستە'
    }
    
    // Validate number format for quantity and price
    if (formData.quantity && isNaN(formData.quantity)) {
      newErrors.quantity = 'ژمارەی دانە دەبێت ژمارە بێت'
    }
    
    if (formData.price && isNaN(formData.price)) {
      newErrors.price = 'نرخ دەبێت ژمارە بێت'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setErrors({})

    // Validate form before submission
    if (!validateForm()) {
      setMessage('تکایە هەموو خانە پێویستەکان پڕ بکەوە')
      return
    }

    setLoading(true)

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

      const result = await response.json()

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
        setErrors({})
      } else {
        setMessage(result.error || 'هەڵەیەک ڕوویدا، تکایە دووبارە هەوڵ بدەوە')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('هەڵەیەک ڕوویدا لە پەیوەندی کردن. تکایە ئینتەرنێتەکەت بپشکنە و دووبارە هەوڵ بدەوە')
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
    <div className="sales-container">
      <div className="sales-content">
        <h1 className="page-title">زیادکردنی کاڵای نوێ</h1>
        
        <div className="form-card">
          <form onSubmit={handleSubmit} className="sales-form">
            <div className="form-group">
              <label className="form-label">ناو *</label>
              <input
                type="text"
                name="name"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                value={formData.name}
                onChange={handleInputChange}
                placeholder="ناوی کاڵاکە"
                required
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">رەقەم</label>
              <input
                type="text"
                name="number"
                className="form-input"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="رەقەمی کاڵاکە"
              />
            </div>

            <div className="form-group">
              <label className="form-label">ناونیشان</label>
              <input
                type="text"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="ناونیشانی کڕیار"
              />
            </div>

            <div className="form-group">
              <label className="form-label">بەروار *</label>
              <input
                type="date"
                name="date"
                className={`form-input ${errors.date ? 'input-error' : ''}`}
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              {errors.date && <div className="error-message">{errors.date}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">وەسف</label>
              <textarea
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="وەسفی کاڵاکە"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">چەند دانە *</label>
              <input
                type="number"
                name="quantity"
                className={`form-input ${errors.quantity ? 'input-error' : ''}`}
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="ژمارەی دانە"
                min="1"
                required
              />
              {errors.quantity && <div className="error-message">{errors.quantity}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">نرخ *</label>
              <input
                type="number"
                name="price"
                className={`form-input ${errors.price ? 'input-error' : ''}`}
                value={formData.price}
                onChange={handleInputChange}
                placeholder="نرخی کاڵاکە"
                min="0.01"
                step="0.01"
                required
              />
              {errors.price && <div className="error-message">{errors.price}</div>}
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
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span className="spinner"></span>
                    زیادکردن...
                  </span>
                ) : 'زیادکردن'}
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