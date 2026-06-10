import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') })

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

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create Supabase client with service role key for backend operations
let supabase: SupabaseClient

function connectToDatabase() {
  try {
    supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    console.log('✅ Connected to Supabase successfully')
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
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

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: 'supabase', timestamp: new Date().toISOString() })
})

// Buku Tamu Routes - CREATE
app.post('/api/tamu', validateTamuEntry, async (req, res) => {
  try {
    const { nama, telepon, dari, nama_instansi, keperluan } = req.body
    
    // Get client IP and user agent
    const ip_address = req.ip || req.socket.remoteAddress || '127.0.0.1'
    const user_agent = req.get('User-Agent') || ''

    // Insert into Supabase
    const { data, error } = await supabase
      .from('tamu')
      .insert([
        {
          nama: nama.trim(),
          telepon: telepon.trim(),
          dari: dari,
          nama_instansi: dari !== 'umum' ? nama_instansi?.trim() : null,
          keperluan: keperluan.trim(),
          ip_address,
          user_agent
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      res.status(500).json({ error: 'Gagal menyimpan data', details: error.message })
      return
    }

    res.status(201).json({ 
      message: 'Buku Tamu entry added successfully', 
      id: data.id,
      data
    })
  } catch (error) {
    console.error('Error adding Buku Tamu entry:', error)
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message })
  }
})

// Get Buku Tamu entries - READ
app.get('/api/tamu', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('tamu')
      .select('*')
      .order('waktu_kunjungan', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Supabase fetch error:', error)
      res.status(500).json({ error: 'Gagal mengambil data', details: error.message })
      return
    }

    res.json(data)
  } catch (error) {
    console.error('Error fetching Buku Tamu entries:', error)
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message })
  }
})

// Get Statistics
app.get('/api/tamu/statistics', async (_req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_tamu_statistics')

    if (error) {
      console.error('Statistics error:', error)
      res.status(500).json({ error: 'Gagal mengambil statistik', details: error.message })
      return
    }

    res.json(data?.[0] || {
      total_kunjungan: 0,
      kunjungan_hari_ini: 0,
      kunjungan_minggu_ini: 0,
      kunjungan_bulan_ini: 0
    })
  } catch (error) {
    console.error('Error fetching statistics:', error)
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
function startServer() {
  try {
    connectToDatabase()
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
      console.log(`📦 Environment: ${process.env.NODE_ENV}`)
      console.log(`🔗 Supabase URL: ${supabaseUrl}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()