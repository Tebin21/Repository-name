import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const salesFile = path.join(dataDir, 'sales.json')

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Ensure sales file exists
if (!fs.existsSync(salesFile)) {
  fs.writeFileSync(salesFile, JSON.stringify([]))
}

// Simple file-based database operations
const fileDB = {
  async insertOne(data) {
    const sales = JSON.parse(fs.readFileSync(salesFile, 'utf8'))
    const newSale = {
      ...data,
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    sales.push(newSale)
    fs.writeFileSync(salesFile, JSON.stringify(sales, null, 2))
    return { insertedId: newSale._id }
  },

  async find() {
    const sales = JSON.parse(fs.readFileSync(salesFile, 'utf8'))
    return {
      sort() {
        return {
          toArray() {
            return sales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          }
        }
      }
    }
  },

  async updateOne(filter, update) {
    const sales = JSON.parse(fs.readFileSync(salesFile, 'utf8'))
    const index = sales.findIndex(sale => sale._id === filter._id)
    if (index !== -1) {
      sales[index] = { ...sales[index], ...update.$set, updatedAt: new Date() }
      fs.writeFileSync(salesFile, JSON.stringify(sales, null, 2))
      return { modifiedCount: 1 }
    }
    return { modifiedCount: 0 }
  },

  async deleteOne(filter) {
    const sales = JSON.parse(fs.readFileSync(salesFile, 'utf8'))
    const index = sales.findIndex(sale => sale._id === filter._id)
    if (index !== -1) {
      sales.splice(index, 1)
      fs.writeFileSync(salesFile, JSON.stringify(sales, null, 2))
      return { deletedCount: 1 }
    }
    return { deletedCount: 0 }
  }
}

// Mock client and database structure
const mockClient = {
  db() {
    return {
      collection() {
        return fileDB
      }
    }
  }
}

const clientPromise = Promise.resolve(mockClient)

export default clientPromise