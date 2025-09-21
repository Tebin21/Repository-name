import './globals.css'

export const metadata = {
  title: 'سیستەمی فرۆشتن',
  description: 'سیستەمێکی سادە بۆ بەڕێوەبردنی فرۆشتن',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ku" dir="rtl">
      <body>{children}</body>
    </html>
  )
}