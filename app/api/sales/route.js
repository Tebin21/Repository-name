import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'sales.json')

// Helper function to read sales data
function readSalesData() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      // Create the directory if it doesn't exist
      const dataDir = path.dirname(dataFilePath)
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
      // Create empty sales file
      fs.writeFileSync(dataFilePath, JSON.stringify([]))
      return []
    }
    
    const data = fs.readFileSync(dataFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading sales data:', error)
    return []
  }
}

// Helper function to write sales data
function writeSalesData(data) {
  try {
    const dataDir = path.dirname(dataFilePath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing sales data:', error)
    return false
  }
}

// GET - Fetch all sales
export async function GET() {
  try {
    const sales = readSalesData()
    // Sort sales by creation date (newest first)
    const sortedSales = sales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return NextResponse.json({ 
      success: true, 
      sales: sortedSales
    })
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch sales' 
    }, { status: 500 })
  }
}

// POST - Add new sale
export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Received POST data:', body)
    
    // Validate required fields
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'ناو پێویستە' },
        { status: 400 }
      )
    }

    // Read existing sales
    const sales = readSalesData()
    console.log('Current sales count:', sales.length)
    
    // Create new sale object
    const newSale = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: body.name.trim(),
      number: body.number?.trim() || '',
      address: body.address?.trim() || '',
      date: body.date || new Date().toISOString().split('T')[0],
      description: body.description?.trim() || '',
      quantity: body.quantity?.trim() || '',
      price: body.price?.trim() || '',
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Add to sales array
    sales.push(newSale)
    
    // Write back to file
    if (writeSalesData(sales)) {
      return NextResponse.json({ 
        success: true, 
        message: 'کاڵاکە بە سەرکەوتوویی زیادکرا',
        sale: newSale
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'هەڵەیەک ڕوویدا لە پاشەکەوتکردنی داتاکان' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in POST /api/sales:', error)
    return NextResponse.json(
      { success: false, error: 'هەڵەیەک ڕوویدا لە زیادکردنی کاڵاکە' },
      { status: 500 }
    )
  }
}

// PUT - Update existing sale
export async function PUT(request) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'ID پێویستە بۆ نوێکردنەوە' },
        { status: 400 }
      )
    }

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'ناو پێویستە' },
        { status: 400 }
      )
    }

    // Read existing sales
    const sales = readSalesData()
    
    // Find the sale to update
    const saleIndex = sales.findIndex(sale => sale._id === body.id)
    
    if (saleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'کاڵاکە نەدۆزرایەوە' },
        { status: 404 }
      )
    }
    
    // Update the sale
    sales[saleIndex] = {
      ...sales[saleIndex],
      name: body.name.trim(),
      number: body.number?.trim() || '',
      address: body.address?.trim() || '',
      date: body.date || sales[saleIndex].date,
      description: body.description?.trim() || '',
      quantity: body.quantity?.trim() || '',
      price: body.price?.trim() || '',
      updatedAt: new Date().toISOString()
    }
    
    // Write back to file
    if (writeSalesData(sales)) {
      return NextResponse.json({ 
        success: true, 
        message: 'کاڵاکە بە سەرکەوتوویی نوێکرایەوە',
        sale: sales[saleIndex]
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'هەڵەیەک ڕوویدا لە پاشەکەوتکردنی داتاکان' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in PUT /api/sales:', error)
    return NextResponse.json(
      { success: false, error: 'هەڵەیەک ڕوویدا لە نوێکردنەوەی کاڵاکە' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a sale
export async function DELETE(request) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'ID پێویستە بۆ سڕینەوە' },
        { status: 400 }
      )
    }

    // Read existing sales
    const sales = readSalesData()
    
    // Find the sale to delete
    const saleIndex = sales.findIndex(sale => sale._id === body.id)
    
    if (saleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'کاڵاکە نەدۆزرایەوە' },
        { status: 404 }
      )
    }
    
    // Remove the sale
    const deletedSale = sales.splice(saleIndex, 1)[0]
    
    // Write back to file
    if (writeSalesData(sales)) {
      return NextResponse.json({ 
        success: true, 
        message: 'کاڵاکە بە سەرکەوتوویی سڕایەوە',
        sale: deletedSale
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'هەڵەیەک ڕوویدا لە پاشەکەوتکردنی داتاکان' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in DELETE /api/sales:', error)
    return NextResponse.json(
      { success: false, error: 'هەڵەیەک ڕوویدا لە سڕینەوەی کاڵاکە' },
      { status: 500 }
    )
  }
}