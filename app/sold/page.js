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
      const response = await fetch('/api/sales')
      if (response.ok) {
        const data = await response.json()
        setSales(data.sales)
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
        setEditingId(null)
        setEditData({})
        fetchSales()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('هەڵەیەک ڕوویدا لە نوێکردنەوەدا')
      }
    } catch (error) {
      setMessage('هەڵەیەک ڕوویدا لە نوێکردنەوەدا')
    }
  }

  const deleteSale = async (id) => {
    if (confirm('دڵنیایت لە سڕینەوەی ئەم کاڵایە؟')) {
      try {
        const response = await fetch('/api/sales', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        })

        if (response.ok) {
          setMessage('کاڵاکە بە سەرکەوتوویی سڕایەوە!')
          fetchSales()
          setTimeout(() => setMessage(''), 3000)
        } else {
          setMessage('هەڵەیەک ڕوویدا لە سڕینەوەدا')
        }
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
    <div className="container">
      <div style={{ minHeight: '100vh', paddingTop: '1rem' }}>
        <h1 className="title">لیستی کاڵا فرۆشراوەکان</h1>
        
        {message && (
          <div className={message.includes('سەرکەوتوویی') ? 'success' : 'error'}>
            {message}
          </div>
        )}

        <div className="card">
          <div className="grid">
            <button onClick={exportToWord} className="btn">
              دەرهێنان بە Word
            </button>
            <button onClick={goBack} className="btn btn-secondary">
              گەڕانەوە
            </button>
          </div>
        </div>

        {sales.length === 0 ? (
          <div className="card">
            <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
              هێشتا هیچ کاڵایەک زیاد نەکراوە
            </p>
          </div>
        ) : (
          Object.entries(groupedSales).map(([date, dateSales]) => (
            <div key={date} className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#ff6b6b', marginBottom: '1rem', borderBottom: '2px solid #ff6b6b', paddingBottom: '0.5rem' }}>
                {date === 'بێ بەروار' ? date : formatDate(date)}
              </h3>
              
              {dateSales.map((sale) => (
                <div key={sale._id} className="item-card">
                  {editingId === sale._id ? (
                    <div>
                      <div style={{ marginBottom: '1rem' }}>
                        <label className="label">ناو</label>
                        <input
                          type="text"
                          className="input"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <label className="label">رەقەم</label>
                        <input
                          type="text"
                          className="input"
                          value={editData.number}
                          onChange={(e) => setEditData({...editData, number: e.target.value})}
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <label className="label">ناونیشان</label>
                        <input
                          type="text"
                          className="input"
                          value={editData.address}
                          onChange={(e) => setEditData({...editData, address: e.target.value})}
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <label className="label">بەروار</label>
                        <input
                          type="date"
                          className="input"
                          value={editData.date}
                          onChange={(e) => setEditData({...editData, date: e.target.value})}
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <label className="label">وەسف</label>
                        <textarea
                          className="input"
                          value={editData.description}
                          onChange={(e) => setEditData({...editData, description: e.target.value})}
                          rows="3"
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <label className="label">چەند دانە</label>
                        <input
                          type="number"
                          className="input"
                          value={editData.quantity}
                          onChange={(e) => setEditData({...editData, quantity: e.target.value})}
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <label className="label">نرخ</label>
                        <input
                          type="number"
                          className="input"
                          value={editData.price}
                          onChange={(e) => setEditData({...editData, price: e.target.value})}
                          step="0.01"
                        />
                      </div>
                      <div className="grid">
                        <button onClick={saveEdit} className="btn">
                          پاشەکەوتکردن
                        </button>
                        <button onClick={cancelEdit} className="btn btn-secondary">
                          پاشگەزبوونەوە
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3>{sale.name || 'بێ ناو'}</h3>
                      {sale.number && <p><strong>رەقەم:</strong> {sale.number}</p>}
                      {sale.address && <p><strong>ناونیشان:</strong> {sale.address}</p>}
                      {sale.date && <p><strong>بەروار:</strong> {formatDate(sale.date)}</p>}
                      {sale.description && <p><strong>وەسف:</strong> {sale.description}</p>}
                      {sale.quantity && <p><strong>چەند دانە:</strong> {sale.quantity}</p>}
                      {sale.price && <p><strong>نرخ:</strong> {sale.price}</p>}
                      
                      <div className="grid" style={{ marginTop: '1rem' }}>
                        <button 
                          onClick={() => startEdit(sale)} 
                          className="btn"
                          style={{ background: 'linear-gradient(45deg, #27ae60, #2ecc71)' }}
                        >
                          دەستکاری
                        </button>
                        <button 
                          onClick={() => deleteSale(sale._id)} 
                          className="btn"
                          style={{ background: 'linear-gradient(45deg, #e74c3c, #c0392b)' }}
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