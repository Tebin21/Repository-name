import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'

export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db('sales-system')
    const collection = db.collection('sales')

    const data = await request.json()
    
    // Server-side validation
    const errors = []
    
    if (!data.name || !data.name.trim()) {
      errors.push('ناو پێویستە')
    }
    
    if (!data.quantity || data.quantity <= 0) {
      errors.push('ژمارەی دانە پێویستە و دەبێت زیاتر لە سفر بێت')
    }
    
    if (!data.price || data.price <= 0) {
      errors.push('نرخ پێویستە و دەبێت زیاتر لە سفر بێت')
    }
    
    if (!data.date) {
      errors.push('بەروار پێویستە')
    }
    
    if (errors.length > 0) {
      return NextResponse.json({ 
        error: errors.join(', '),
        validation_errors: errors 
      }, { status: 400 })
    }
    
    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error('Error saving sale:', error)
    return NextResponse.json({ 
      error: 'هەڵەیەک ڕوویدا لە هەڵگرتنی زانیارییەکان. تکایە دووبارە هەوڵ بدەوە' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('sales-system')
    const collection = db.collection('sales')

    const result = await collection.find()
    const sales = await result.sort().toArray()
    
    return NextResponse.json({ sales })
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const client = await clientPromise
    const db = client.db('sales-system')
    const collection = db.collection('sales')

    const { id, ...updateData } = await request.json()
    
    const result = await collection.updateOne(
      { _id: id },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    console.error('Error updating sale:', error)
    return NextResponse.json({ error: 'Failed to update sale' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const client = await clientPromise
    const db = client.db('sales-system')
    const collection = db.collection('sales')

    const { id } = await request.json()
    
    const result = await collection.deleteOne({ _id: id })

    return NextResponse.json({ success: true, deletedCount: result.deletedCount })
  } catch (error) {
    console.error('Error deleting sale:', error)
    return NextResponse.json({ error: 'Failed to delete sale' }, { status: 500 })
  }
}