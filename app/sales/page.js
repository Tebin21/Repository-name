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
    
    // Convert to numbers for validation
    const quantity = parseFloat(formData.quantity)
    const price = parseFloat(formData.price)
    
    if (!formData.quantity || formData.quantity.trim() === '' || isNaN(quantity) || quantity <= 0) {
      newErrors.quantity = 'ژمارەی دانە پێویستە و دەبێت ژمارەیەکی دروست بێت کە زیاتر لە سفر بێت'
    }
    
    if (!formData.price || formData.price.trim() === '' || isNaN(price) || price <= 0) {
      newErrors.price = 'نرخ پێویستە و دەبێت ژمارەیەکی دروست بێت کە زیاتر لە سفر بێت'
    }
    
    if (!formData.date) {
      newErrors.date = 'بەروار پێویستە'
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
    <>
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

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  ناردن
                </button>
                <button type="button" onClick={goBack} className="btn-secondary">
                  گەڕانەوە
                </button>
              </div>
            </form>
          </div>

          <div className="info-note">
            <h3 className="note-title">تێبینی:</h3>
            <p className="note-text">
              ئەم فۆرمە بۆ تۆمارکردنی فرۆشتنەکانە. تکایە زانیاریەکان بە وردی پڕ بکەرەوە.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        body {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .sales-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .page-title {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 2rem;
          text-align: center;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .form-card {
          background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 25px 50px rgba(220, 38, 38, 0.15), 0 0 0 1px rgba(220, 38, 38, 0.1);
          width: 100%;
          max-width: 600px;
          margin-bottom: 1rem;
          border: 2px solid rgba(220, 38, 38, 0.1);
        }

        .sales-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #ffffff;
          box-sizing: border-box;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #dc2626;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
          transform: translateY(-1px);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
        }

        .input-error {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .error-message {
          color: #dc2626;
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          justify-content: center;
        }

        .btn-primary, .btn-secondary {
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 140px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
          background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
        }

        .btn-secondary {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
        }

        .btn-secondary:hover {
          background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(107, 114, 128, 0.4);
        }

        .info-note {
          background: linear-gradient(145deg, #f9fafb 0%, #f3f4f6 100%);
          border: 2px solid rgba(220, 38, 38, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          margin-top: 2rem;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .note-title {
          color: #dc2626;
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 0.75rem 0;
        }

        .note-text {
          color: #4b5563;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 768px) {
          .sales-container {
            padding: 1rem;
          }
          
          .page-title {
            font-size: 2rem;
          }
          
          .form-card {
            padding: 1.5rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </>
  )
}