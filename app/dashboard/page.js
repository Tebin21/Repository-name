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
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="main-title">سیستەمی فرۆشتن</h1>
        
        <div className="welcome-card">
          <h2 className="welcome-title">بەخێربێیت!</h2>
          <p className="welcome-text">
            ئەم سیستەمە بۆ بەڕێوەبردنی فرۆشتن و کڕینەکانتانە
          </p>

          <div className="cards-grid">
            <div className="action-card sales-card" onClick={goToSales}>
              <div className="card-content">
                <div className="card-icon">🛒</div>
                <h3 className="card-title">فرۆشتن</h3>
                <p className="card-description">زیادکردنی کاڵای نوێ بۆ فرۆشتن</p>
              </div>
            </div>

            <div className="action-card sold-card" onClick={goToSold}>
              <div className="card-content">
                <div className="card-icon">📋</div>
                <h3 className="card-title">فرۆشراوە</h3>
                <p className="card-description">بینینی لیستی کاڵا فرۆشراوەکان</p>
              </div>
            </div>
          </div>

          <div className="logout-section">
            <button 
              onClick={handleLogout}
              className="logout-btn"
            >
              دەرچوون
            </button>
          </div>
        </div>

        <div className="guide-card">
          <h3 className="guide-title">ڕێنمایی بەکارهێنان</h3>
          <ul className="guide-list">
            <li>• لە بەشی "فرۆشتن" کاڵای نوێ زیاد بکە</li>
            <li>• لە بەشی "فرۆشراوە" لیستی هەموو کاڵاکان ببینە</li>
            <li>• دەتوانیت داتاکان دەستکاری بکەیت و PDF دەرهێنیت</li>
            <li>• هەموو زانیارییەکان بە شێوەی خۆکار پاشەکەوت دەکرێن</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d1b1b 50%, #1a1a1a 100%);
          position: relative;
          overflow-x: hidden;
        }

        .dashboard-container::before {
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

        .dashboard-content {
          padding: 3rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .main-title {
          font-size: 4rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 3rem;
          background: linear-gradient(135deg, #dc2626 0%, #ffffff 50%, #dc2626 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
        }

        .welcome-card {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(220, 38, 38, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          border: 2px solid rgba(220, 38, 38, 0.1);
          margin-bottom: 2rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .welcome-card:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 35px 70px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(220, 38, 38, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .welcome-title {
          font-size: 2.5rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #dc2626 0%, #1f2937 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-text {
          text-align: center;
          margin-bottom: 3rem;
          color: #374151;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .action-card {
          border-radius: 20px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        .sales-card {
          background: linear-gradient(135deg, #dc2626 0%, #1f2937 100%);
          color: white;
        }

        .sold-card {
          background: linear-gradient(135deg, #1f2937 0%, #dc2626 100%);
          color: white;
        }

        .action-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .action-card:hover::before {
          left: 100%;
        }

        .action-card:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        .card-content {
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .card-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .card-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .card-description {
          font-size: 1.1rem;
          font-weight: 500;
          opacity: 0.9;
        }

        .logout-section {
          text-align: center;
        }

        .logout-btn {
          padding: 16px 40px;
          background: linear-gradient(135deg, #dc2626 0%, #1f2937 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 10px 25px rgba(220, 38, 38, 0.3);
          position: relative;
          overflow: hidden;
        }

        .logout-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .logout-btn:hover::before {
          left: 100%;
        }

        .logout-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 35px rgba(220, 38, 38, 0.4);
        }

        .guide-card {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.1);
          transition: all 0.3s ease;
        }

        .guide-card:hover {
          transform: translateY(-3px);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(220, 38, 38, 0.15);
        }

        .guide-title {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #dc2626 0%, #1f2937 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .guide-list {
          color: #374151;
          line-height: 2;
          font-size: 1.1rem;
          font-weight: 500;
          list-style: none;
          padding: 0;
        }

        .guide-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(220, 38, 38, 0.1);
          transition: all 0.3s ease;
        }

        .guide-list li:hover {
          color: #dc2626;
          transform: translateX(10px);
        }

        .guide-list li:last-child {
          border-bottom: none;
        }

        @media (max-width: 768px) {
          .dashboard-content {
            padding: 2rem 1rem;
          }

          .main-title {
            font-size: 2.5rem;
          }

          .welcome-card {
            padding: 2rem;
          }

          .cards-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}