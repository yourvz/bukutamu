import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createConnection } from 'mysql2/promise'

// Load environment variables
dotenv.config()

const app = express()
const PORT = parseInt(process.env.APP_PORT || '3000', 10)

// Middleware
app.use(cors({
  origin: ['http://localhost:5174', 'http://127.0.0.1:5174'], // Frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'buku_tamu_app',
  password: process.env.DB_PASSWORD || 'secure_password_here',
  database: process.env.DB_NAME || 'buku_tamu_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

// Database connection
let pool: any

async function connectToDatabase() {
  try {
    pool = await createConnection(dbConfig)
    console.log('Connected to MySQL database successfully')
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

// Validation middleware
const validateTamuEntry = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  const { nama, telepon, dari, keperluan } = req.body
  
  if (!nama || nama.trim().length < 2) {
    res.status(400).json({ error: 'Nama harus diisi minimal 2 karakter' })
    return
  }

  if (!telepon || telepon.trim().length < 8) {
    res.status(400).json({ error: 'Nomor telepon harus diisi minimal 8 karakter' })
    return
  }

  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
  if (!phoneRegex.test(telepon)) {
    res.status(400).json({ error: 'Format nomor telepon tidak valid' })
    return
  }

  if (!dari || !['umum', 'instansi', 'organisasi'].includes(dari)) {
    res.status(400).json({ error: 'Pilih kategori yang valid' })
    return
  }

  if (!keperluan || keperluan.trim().length < 5) {
    res.status(400).json({ error: 'Keperluan harus diisi minimal 5 karakter' })
    return
  }

  if (dari !== 'umum' && (!req.body.nama_instansi || req.body.nama_instansi.trim().length < 2)) {
    res.status(400).json({ error: 'Nama Instansi/Organisasi harus diisi' })
    return
  }

  next()
}

// Buku Tamu Routes
app.post('/api/tamu', validateTamuEntry, async (req, res) => {
  try {
    const { nama, telepon, dari, nama_instansi, keperluan } = req.body
    
    // Prepare SQL query
    const query = `
      INSERT INTO tamu 
      (nama, telepon, dari, nama_instansi, keperluan, ip_address, user_agent) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    // Get client IP and user agent
    const ip_address = req.ip || req.socket.remoteAddress || '127.0.0.1'
    const user_agent = req.get('User-Agent') || ''

    // Execute query
    const [result] = await pool.execute(query, [
      nama,
      telepon, 
      dari, 
      dari !== 'umum' ? nama_instansi : null, 
      keperluan,
      ip_address,
      user_agent
    ])

    res.status(201).json({ 
      message: 'Buku Tamu entry added successfully', 
      id: (result as any).insertId 
    })
  } catch (error) {
    console.error('Error adding Buku Tamu entry:', error)
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message })
  }
})

// Get Buku Tamu entries
app.get('/api/tamu', async (_req, res) => {
  try {
    const query = 'SELECT * FROM laporan_kunjungan LIMIT 100'
    const [rows] = await pool.execute(query)
    res.json(rows)
  } catch (error) {
    console.error('Error fetching Buku Tamu entries:', error)
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message })
  }
})

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  })
})

// Start server
async function startServer() {
  try {
    await connectToDatabase()
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()