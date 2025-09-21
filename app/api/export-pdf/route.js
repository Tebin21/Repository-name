import { NextResponse } from 'next/server'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

export async function POST(request) {
  try {
    const { sales } = await request.json()
    
    // Create Word document
    const doc = await generateWordDocument(sales)
    
    // Convert to buffer
    const buffer = await Packer.toBuffer(doc)
    
    // Return the Word document
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="sales-report.docx"'
      }
    })
  } catch (error) {
    console.error('Error generating Word document:', error)
    return NextResponse.json({ error: 'Failed to generate Word document' }, { status: 500 })
  }
}

async function generateWordDocument(sales) {
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

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'بێ بەروار') return dateString
    const date = new Date(dateString)
    return date.toLocaleDateString('ku-IQ')
  }

  const groupedSales = groupSalesByDate(sales)
  const currentDate = new Date().toLocaleDateString('ku-IQ')

  const children = []
  
  // Header
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "ڕاپۆرتی فرۆشتن",
          bold: true,
          size: 32
        })
      ],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER
    })
  )
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `بەرواری ئامادەکردن: ${currentDate}`,
          size: 24
        })
      ],
      alignment: AlignmentType.CENTER
    })
  )
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `کۆی گشتی کاڵاکان: ${sales.length}`,
          size: 24
        })
      ],
      alignment: AlignmentType.CENTER
    })
  )
  
  children.push(new Paragraph({ text: "" })) // Empty line
  
  // Sales data
  Object.entries(groupedSales).forEach(([date, dateSales]) => {
    // Date header
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `بەروار: ${formatDate(date)}`,
            bold: true,
            size: 28
          })
        ],
        heading: HeadingLevel.HEADING_2
      })
    )
    
    dateSales.forEach((sale, index) => {
      // Sale name
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${index + 1}. ${sale.name || 'بێ ناو'}`,
              bold: true,
              size: 24
            })
          ]
        })
      )
      
      // Sale details
      if (sale.number) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `رەقەم: ${sale.number}`,
                size: 22
              })
            ]
          })
        )
      }
      
      if (sale.address) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `ناونیشان: ${sale.address}`,
                size: 22
              })
            ]
          })
        )
      }
      
      if (sale.description) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `وەسف: ${sale.description}`,
                size: 22
              })
            ]
          })
        )
      }
      
      if (sale.quantity) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `چەند دانە: ${sale.quantity}`,
                size: 22
              })
            ]
          })
        )
      }
      
      if (sale.price) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `نرخ: ${sale.price}`,
                size: 22
              })
            ]
          })
        )
      }
      
      children.push(new Paragraph({ text: "" })) // Empty line after each sale
    })
  })
  
  // Calculate totals
  let totalPrice = 0
  let totalQuantity = 0
  
  sales.forEach(sale => {
    const price = parseFloat(sale.price) || 0
    const quantity = parseInt(sale.quantity) || 0
    totalPrice += price
    totalQuantity += quantity
  })
  
  // Add totals section
  children.push(new Paragraph({ text: "" })) // Empty line
  children.push(new Paragraph({ text: "" })) // Empty line
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "کۆی گشتی:",
          bold: true,
          size: 28
        })
      ],
      alignment: AlignmentType.CENTER
    })
  )
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `کۆی گشتی دانە: ${totalQuantity}`,
          bold: true,
          size: 24
        })
      ],
      alignment: AlignmentType.CENTER
    })
  )
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `کۆی گشتی نرخ: ${totalPrice.toLocaleString()} دینار`,
          bold: true,
          size: 24
        })
      ],
      alignment: AlignmentType.CENTER
    })
  )
  
  // Footer
  children.push(new Paragraph({ text: "" })) // Empty line
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "سیستەمی فرۆشتن",
          bold: true,
          size: 24
        })
      ],
      alignment: AlignmentType.CENTER
    })
  )
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `ئامادەکراوە لە ${currentDate}`,
          size: 22
        })
      ],
      alignment: AlignmentType.CENTER
    })
  )

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children
      }
    ]
  })

  return doc
}