import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { sales } = await request.json()
    
    if (!sales || !Array.isArray(sales)) {
      return NextResponse.json(
        { success: false, error: 'داتای فرۆشتن پێویستە' },
        { status: 400 }
      )
    }

    // Create a simple HTML content for the Word document
    let htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ku">
      <head>
        <meta charset="UTF-8">
        <title>ڕاپۆرتی فرۆشتن</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            direction: rtl;
            text-align: right;
            margin: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          .sale-item {
            border: 1px solid #ddd;
            margin: 10px 0;
            padding: 15px;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          .sale-title {
            font-weight: bold;
            font-size: 18px;
            color: #333;
            margin-bottom: 10px;
          }
          .sale-detail {
            margin: 5px 0;
            padding: 2px 0;
          }
          .label {
            font-weight: bold;
            color: #555;
          }
          .date-group {
            margin: 20px 0;
            border-top: 2px solid #333;
            padding-top: 15px;
          }
          .date-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
            text-align: center;
            background-color: #e9e9e9;
            padding: 10px;
            border-radius: 5px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            border-top: 1px solid #ddd;
            padding-top: 15px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ڕاپۆرتی فرۆشتن</h1>
          <p>بەرواری دروستکردن: ${new Date().toLocaleDateString('ku-IQ')}</p>
          <p>کۆی گشتی: ${sales.length} کاڵا</p>
        </div>
    `

    // Group sales by date
    const groupedSales = {}
    sales.forEach(sale => {
      const date = sale.date || sale.createdAt?.split('T')[0] || 'بێ بەروار'
      if (!groupedSales[date]) {
        groupedSales[date] = []
      }
      groupedSales[date].push(sale)
    })

    // Add sales data to HTML
    Object.entries(groupedSales).forEach(([date, dateSales]) => {
      htmlContent += `
        <div class="date-group">
          <div class="date-title">${date === 'بێ بەروار' ? date : new Date(date).toLocaleDateString('ku-IQ')}</div>
      `
      
      dateSales.forEach(sale => {
        htmlContent += `
          <div class="sale-item">
            <div class="sale-title">${sale.name || 'بێ ناو'}</div>
            ${sale.number ? `<div class="sale-detail"><span class="label">رەقەم:</span> ${sale.number}</div>` : ''}
            ${sale.address ? `<div class="sale-detail"><span class="label">ناونیشان:</span> ${sale.address}</div>` : ''}
            ${sale.date ? `<div class="sale-detail"><span class="label">بەروار:</span> ${new Date(sale.date).toLocaleDateString('ku-IQ')}</div>` : ''}
            ${sale.description ? `<div class="sale-detail"><span class="label">وەسف:</span> ${sale.description}</div>` : ''}
            ${sale.quantity ? `<div class="sale-detail"><span class="label">چەند دانە:</span> ${sale.quantity}</div>` : ''}
            ${sale.price ? `<div class="sale-detail"><span class="label">نرخ:</span> ${sale.price}</div>` : ''}
          </div>
        `
      })
      
      htmlContent += '</div>'
    })

    htmlContent += `
        <div class="footer">
          <p>ئەم ڕاپۆرتە لە سیستەمی فرۆشتن دروستکراوە</p>
          <p>${new Date().toLocaleString('ku-IQ')}</p>
        </div>
      </body>
      </html>
    `

    // Create a simple Word document structure
    const wordContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:w="urn:schemas-microsoft-com:office:word" 
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>ڕاپۆرتی فرۆشتن</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>90</w:Zoom>
            <w:DoNotPromptForConvert/>
            <w:DoNotShowInsertionsAndDeletions/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            margin: 1in;
          }
          body {
            font-family: Arial, sans-serif;
            direction: rtl;
            text-align: right;
          }
        </style>
      </head>
      ${htmlContent.replace('<body>', '<body>').replace('</body>', '</body>')}
      </html>
    `

    // Convert to buffer
    const buffer = Buffer.from(wordContent, 'utf8')

    // Return the Word document
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="sales-report-${new Date().toISOString().split('T')[0]}.docx"`,
        'Content-Length': buffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('Error in POST /api/export-pdf:', error)
    return NextResponse.json(
      { success: false, error: 'هەڵەیەک ڕوویدا لە دروستکردنی فایلی Word' },
      { status: 500 }
    )
  }
}