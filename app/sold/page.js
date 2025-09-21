'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SoldPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [message, setMessage] = useState('')
  
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const loginStatus = localStorage.getItem('isLoggedIn')
    if (loginStatus === 'true') {
      setIsLoggedIn(true)
      fetchSales()
    } else {
      router.push('/')
    }
  }, [router])

  const fetchSales = async () => {
    try {
      const isProduction = process.env.NODE_ENV === 'production'
      
      if (isProduction) {
        // Use localStorage for GitHub Pages
        const salesData = JSON.parse(localStorage.getItem('sales') || '[]')
        setSales(salesData)
      } else {
        // Use API for development
        const response = await fetch('/api/sales')
        if (response.ok) {
          const data = await response.json()
          setSales(data.sales)
        }
      }
    } catch (error) {
      console.error('Error fetching sales:', error)
    }
    setLoading(false)
  }

  const startEdit = (sale) => {
    setEditingId(sale._id)
    setEditData({
      name: sale.name || '',
      number: sale.number || '',
      address: sale.address || '',
      date: sale.date || '',
      description: sale.description || '',
      quantity: sale.quantity || '',
      price: sale.price || ''
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const saveEdit = async () => {
    try {
      const isProduction = process.env.NODE_ENV === 'production'
      
      if (isProduction) {
        // Use localStorage for GitHub Pages
        const salesData = JSON.parse(localStorage.getItem('sales') || '[]')
        const updatedSales = salesData.map(sale => 
          sale._id === editingId 
            ? { ...sale, ...editData, updatedAt: new Date().toISOString() }
            : sale
        )
        localStorage.setItem('sales', JSON.stringify(updatedSales))
        setMessage('زانیارییەکان بە سەرکەوتوویی نوێکرانەوە!')
      } else {
        // Use API for development
        const response = await fetch('/api/sales', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingId,
            ...editData
          }),
        })

        if (response.ok) {
          setMessage('زانیارییەکان بە سەرکەوتوویی نوێکرانەوە!')
        } else {
          setMessage('هەڵەیەک ڕوویدا لە نوێکردنەوەدا')
        }
      }
      
      setEditingId(null)
      setEditData({})
      fetchSales()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('هەڵەیەک ڕوویدا لە نوێکردنەوەدا')
    }
  }

  const deleteSale = async (id) => {
    if (confirm('دڵنیایت لە سڕینەوەی ئەم کاڵایە؟')) {
      try {
        const isProduction = process.env.NODE_ENV === 'production'
        
        if (isProduction) {
          // Use localStorage for GitHub Pages
          const salesData = JSON.parse(localStorage.getItem('sales') || '[]')
          const filteredSales = salesData.filter(sale => sale._id !== id)
          localStorage.setItem('sales', JSON.stringify(filteredSales))
          setMessage('کاڵاکە بە سەرکەوتوویی سڕایەوە!')
        } else {
          // Use API for development
          const response = await fetch('/api/sales', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
          })

          if (response.ok) {
            setMessage('کاڵاکە بە سەرکەوتوویی سڕایەوە!')
          } else {
            setMessage('هەڵەیەک ڕوویدا لە سڕینەوەدا')
          }
        }
        
        fetchSales()
        setTimeout(() => setMessage(''), 3000)
      } catch (error) {
        setMessage('هەڵەیەک ڕوویدا لە سڕینەوەدا')
      }
    }
  }

  const exportToWord = async () => {
    try {
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sales }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `sales-report-${new Date().toISOString().split('T')[0]}.docx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        setMessage('فایلی Word بە سەرکەوتوویی دابەزێنرا!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('هەڵەیەک ڕوویدا لە دروستکردنی Word')
      }
    } catch (error) {
      setMessage('هەڵەیەک ڕوویدا لە دروستکردنی Word')
    }
  }

  const goBack = () => {
    router.push('/dashboard')
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ku-IQ')
  }

  const groupSalesByDate = (sales) => {
    const grouped = {}
    sales.forEach(sale => {
      const date = sale.date || sale.createdAt?.split('T')[0] || 'بێ بەروار'
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(sale)
    })
    return grouped
  }

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="loading">چاوەڕوان بە...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">بارکردنی داتاکان...</div>
      </div>
    )
  }

  const groupedSales = groupSalesByDate(sales)

  return (
    <div className="sold-container">
      <div className="sold-content">
        <h1 className="page-title">لیستی کاڵا فرۆشراوەکان</h1>
        
        {message && (
          <div className={message.includes('سەرکەوتوویی') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}

        <div className="action-card">
          <div className="action-buttons">
            <button onClick={exportToWord} className="btn-primary">
              دەرهێنان بە Word
            </button>
            <button onClick={goBack} className="btn-secondary">
              گەڕانەوە
            </button>
          </div>
        </div>

      <style jsx>{`
        .sold-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
          min-height: 100vh;
        }
        
        .sold-content {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(220, 20, 60, 0.3);
          border: 2px solid #dc143c;
        }
        
        .page-title {
          text-align: center;
          background: linear-gradient(45deg, #dc143c, #000000);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 2rem;
          font-size: 2.5rem;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .success-message {
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 10px;
          text-align: center;
          font-weight: bold;
          border: 2px solid #dc143c;
          background: linear-gradient(45deg, #dc143c, #ff1744);
          color: white;
        }
        
        .error-message {
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 10px;
          text-align: center;
          font-weight: bold;
          border: 2px solid #dc143c;
          background: linear-gradient(45deg, #000000, #333333);
          color: white;
        }
        
        .action-card {
          background: linear-gradient(135deg, #dc143c 0%, #000000 100%);
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 10px 20px rgba(220, 20, 60, 0.3);
          color: white;
          border: 2px solid #ffffff;
        }
        
        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        
        .btn-primary {
          padding: 0.75rem 1.5rem;
          border: 2px solid #dc143c;
          border-radius: 10px;
          background: linear-gradient(45deg, #dc143c, #ff1744);
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(220, 20, 60, 0.4);
          background: linear-gradient(45deg, #ff1744, #dc143c);
        }
        
        .btn-secondary {
          padding: 0.75rem 1.5rem;
          border: 2px solid #000000;
          border-radius: 10px;
          background: linear-gradient(45deg, #000000, #333333);
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        
        .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
          background: linear-gradient(45deg, #333333, #000000);
        }
        
        .empty-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 2px solid #dc143c;
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 10px 20px rgba(220, 20, 60, 0.1);
        }
        
        .empty-text {
          color: #dc143c;
          font-size: 1.2rem;
          font-weight: bold;
          margin: 0;
        }
        
        .date-group-card {
          margin-bottom: 2rem;
        }
        
        .date-title {
          background: linear-gradient(45deg, #000000, #dc143c);
          color: white;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          font-weight: bold;
          text-align: center;
          border: 2px solid #ffffff;
          box-shadow: 0 5px 15px rgba(220, 20, 60, 0.3);
        }
        
        .sale-item-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 10px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 5px 15px rgba(220, 20, 60, 0.2);
          border: 2px solid #dc143c;
          border-left: 5px solid #000000;
        }
        
        .sale-display {
          width: 100%;
        }
        
        .sale-title {
          color: #000000;
          margin-bottom: 1rem;
          font-weight: bold;
          font-size: 1.3rem;
        }
        
        .sale-detail {
          margin: 0.5rem 0;
          color: #333333;
        }
        
        .sale-detail strong {
          color: #dc143c;
        }
        
        .item-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .btn-edit {
          padding: 0.5rem 1rem;
          border: 2px solid #dc143c;
          border-radius: 8px;
          background: linear-gradient(45deg, #dc143c, #ff1744);
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-edit:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(220, 20, 60, 0.4);
        }
        
        .btn-delete {
          padding: 0.5rem 1rem;
          border: 2px solid #000000;
          border-radius: 8px;
          background: linear-gradient(45deg, #000000, #333333);
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-delete:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
        }
        
        .edit-form {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border: 2px solid #dc143c;
          border-radius: 10px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #000000;
          font-weight: bold;
        }
        
        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #dc143c;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }
        
        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #000000;
          box-shadow: 0 0 10px rgba(220, 20, 60, 0.3);
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .edit-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .loading {
          text-align: center;
          color: #dc143c;
          font-size: 1.2rem;
          font-weight: bold;
          padding: 2rem;
        }
        
        @media (max-width: 768px) {
          .sold-container {
            padding: 1rem;
          }
          
          .sold-content {
            padding: 1rem;
          }
          
          .page-title {
            font-size: 2rem;
          }
          
          .action-buttons {
            flex-direction: column;
          }
          
          .item-actions,
          .edit-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

        {sales.length === 0 ? (
          <div className="empty-card">
            <p className="empty-text">
              هێشتا هیچ کاڵایەک زیاد نەکراوە
            </p>
          </div>
        ) : (
          Object.entries(groupedSales).map(([date, dateSales]) => (
            <div key={date} className="date-group-card">
              <h3 className="date-title">
                {date === 'بێ بەروار' ? date : formatDate(date)}
              </h3>
              
              {dateSales.map((sale) => (
                <div key={sale._id} className="sale-item-card">
                  {editingId === sale._id ? (
                    <div className="edit-form">
                      <div className="form-group">
                        <label className="form-label">ناو</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">رەقەم</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editData.number}
                          onChange={(e) => setEditData({...editData, number: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">ناونیشان</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editData.address}
                          onChange={(e) => setEditData({...editData, address: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">بەروار</label>
                        <input
                          type="date"
                          className="form-input"
                          value={editData.date}
                          onChange={(e) => setEditData({...editData, date: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">وەسف</label>
                        <textarea
                          className="form-textarea"
                          value={editData.description}
                          onChange={(e) => setEditData({...editData, description: e.target.value})}
                          rows="3"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">چەند دانە</label>
                        <input
                          type="number"
                          className="form-input"
                          value={editData.quantity}
                          onChange={(e) => setEditData({...editData, quantity: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">نرخ</label>
                        <input
                          type="number"
                          className="form-input"
                          value={editData.price}
                          onChange={(e) => setEditData({...editData, price: e.target.value})}
                          step="0.01"
                        />
                      </div>
                      <div className="edit-actions">
                        <button onClick={saveEdit} className="btn-primary">
                          پاشەکەوتکردن
                        </button>
                        <button onClick={cancelEdit} className="btn-secondary">
                          پاشگەزبوونەوە
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="sale-display">
                      <h3 className="sale-title">{sale.name || 'بێ ناو'}</h3>
                      {sale.number && <p className="sale-detail"><strong>رەقەم:</strong> {sale.number}</p>}
                      {sale.address && <p className="sale-detail"><strong>ناونیشان:</strong> {sale.address}</p>}
                      {sale.date && <p className="sale-detail"><strong>بەروار:</strong> {formatDate(sale.date)}</p>}
                      {sale.description && <p className="sale-detail"><strong>وەسف:</strong> {sale.description}</p>}
                      {sale.quantity && <p className="sale-detail"><strong>چەند دانە:</strong> {sale.quantity}</p>}
                      {sale.price && <p className="sale-detail"><strong>نرخ:</strong> {sale.price}</p>}
                      
                      <div className="item-actions">
                        <button 
                          onClick={() => startEdit(sale)} 
                          className="btn-edit"
                        >
                          دەستکاری
                        </button>
                        <button 
                          onClick={() => deleteSale(sale._id)} 
                          className="btn-delete"
                        >
                          سڕینەوە
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}