<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Options for "Dari" dropdown
const dariOptions = [
  { value: 'umum', label: 'Umum' },
  { value: 'instansi', label: 'Instansi' },
  { value: 'organisasi', label: 'Organisasi' }
]

// Current time state
const currentTime = ref('')
const currentDate = ref('')

// Form data state
const nama = ref('')
const telepon = ref('')
const dari = ref('umum')
const instansiNama = ref('')
const keperluan = ref('')
const isSubmitting = ref(false)
const submitError = ref('')

// Update current time function
const updateTime = () => {
  const now = new Date()
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const timeString = `${hours}.${minutes}`
  const dateString = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
  
  currentTime.value = timeString
  currentDate.value = dateString
}

// Start time update interval
onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})

// Submit form handler
const submitForm = async () => {
  submitError.value = ''
  
  if (!nama.value.trim()) {
    submitError.value = 'Nama harus diisi minimal 2 karakter'
    return
  }

  if (!telepon.value.trim()) {
    submitError.value = 'Nomor telepon harus diisi'
    return
  }

  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
  if (!phoneRegex.test(telepon.value)) {
    submitError.value = 'Format nomor telepon tidak valid'
    return
  }
  
  if (!keperluan.value.trim()) {
    submitError.value = 'Keperluan harus diisi minimal 5 karakter'
    return
  }

  if (dari.value !== 'umum' && !instansiNama.value.trim()) {
    submitError.value = 'Nama Instansi/Organisasi harus diisi'
    return
  }

  if (isSubmitting.value) return
  
  isSubmitting.value = true

  try {
    const response = await axios.post('http://localhost:3000/api/tamu', {
      nama: nama.value.trim(),
      telepon: telepon.value.trim(),
      dari: dari.value,
      nama_instansi: dari.value === 'umum' ? null : instansiNama.value.trim(),
      keperluan: keperluan.value.trim()
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    })

    alert('Formulir Buku Tamu berhasil dikirim!')
    
    nama.value = ''
    telepon.value = ''
    dari.value = 'umum'
    instansiNama.value = ''
    keperluan.value = ''
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        submitError.value = error.response.data.error || 'Gagal mengirim formulir. Silakan coba lagi.'
      } else if (error.request) {
        submitError.value = 'Tidak ada respon dari server. Periksa koneksi internet.'
      } else {
        submitError.value = 'Kesalahan dalam mengirim formulir.'
      }
    } else {
      submitError.value = 'Terjadi kesalahan yang tidak diketahui.'
    }
    console.error('Submit error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="app-container">
    <!-- LEFT SIDE - HERO SECTION -->
    <div class="hero-section" :style="{ backgroundImage: 'url(https://videshiiya.com/app/uploads/2019/05/BCC-018.jpg)' }">

      <div class="hero-header">
        <p class="current-time">{{ currentTime }}</p>
        <p class="current-date">{{ currentDate }}</p>
      </div>

      <div class="hero-footer">
        <div class="time-section">
          
        </div>
        <div class="security-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Data Anda aman & terenkripsi</span>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDE - FORM SECTION -->
    <div class="form-section">
      <div class="form-header">
        <p class="form-label">Buku Tamu</p>
        <p class="form-description">Mohon isi formulir di bawah ini. Proses hanya membutuhkan kurang dari satu menit.</p>
      </div>

      <form @submit.prevent="submitForm" class="form-wrapper">
        <div class="form-group">
          <label for="nama">Nama Lengkap</label>
          <input 
            id="nama" 
            v-model="nama" 
            type="text" 
            placeholder="Mis. Budi Santoso" 
            required
          >
        </div>

        <div class="form-group">
          <label for="telepon">Nomor Telepon</label>
          <input 
            id="telepon" 
            v-model="telepon" 
            type="tel" 
            placeholder="08XX-XXXX-XXXX atau +62XX" 
            required
          >
        </div>

        <div class="form-group">
          <label for="dari">Asal / Dari</label>
          <select 
            id="dari" 
            v-model="dari"
          >
            <option value="umum">Umum</option>
            <option value="instansi">Instansi</option>
            <option value="organisasi">Organisasi</option>
          </select>
        </div>

        <div 
          v-if="dari !== 'umum'" 
          class="form-group"
        >
          <label for="instansiNama">
            Nama {{ dari === 'instansi' ? 'Instansi' : 'Organisasi' }}
          </label>
          <input 
            id="instansiNama" 
            v-model="instansiNama" 
            type="text" 
            :placeholder="`Masukkan nama ${dari === 'instansi' ? 'instansi' : 'organisasi'}`" 
            :required="dari !== 'umum'"
          >
        </div>

        <div class="form-group">
          <label for="keperluan">Keperluan Kunjungan</label>
          <textarea 
            id="keperluan" 
            v-model="keperluan" 
            placeholder="Cth. Meeting dengan Tim Marketing, pengiriman dokumen, dsb." 
            required
          ></textarea>
        </div>

        <button type="submit" :disabled="isSubmitting" class="submit-btn">
          <span>{{ isSubmitting ? 'Mengirim...' : 'Kirim' }}</span>
          <svg v-if="!isSubmitting" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

        <p class="form-disclaimer">UPTD Pengelolaan Parkir @2026</p>

        <div v-if="submitError" class="error-message">
          {{ submitError }}
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   BUKU TAMU - PROFESSIONAL TWO COLUMN DESIGN
   ============================================ */

:root {
  --primary-dark: #1a1a2e;
  --primary-darker: #0f0f1e;
  --accent: #6b5b95;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border: #e5e7eb;
  --light-bg: #ffffff;
  --light-gray: #f9fafb;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: white;
  color: var(--text-primary);
}

.app-container {
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: white;
  overflow: hidden;
  
}

/* ============ LEFT SIDE - HERO SECTION ============ */
.hero-section {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: white;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  background-position-x: -200px;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.35) 50%, rgba(0, 0, 0, 0.25) 100%);
  pointer-events: none;
}

.hero-header {
  z-index: 2;
  margin-top: 150px;
}

.hero-footer {
  position: relative;
  z-index: 2;
  margin-top: auto;
}

.time-section {
  margin-bottom: 2rem;
}

.current-time {
  font-size: 5rem;
  font-weight: 700;
  margin: 0;
}

.current-date {
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* ============ RIGHT SIDE - FORM SECTION ============ */
.form-section {
  background: var(--light-gray);
  padding: 4rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
}

.form-header {
  margin-bottom: 2.5rem;
}

.form-label {
  font-size: 2.5rem;
  font-weight: 1000;
  letter-spacing: 2px;
  color: var(--accent);
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  text-align: left;
}

.form-description {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1;
  text-align: left;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: left;
}

/* ============ FORM GROUPS ============ */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

label {
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 1px;
  color: #8b8f96;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.75rem;
}

input, select, textarea {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid #e0e4e8;
  border-radius: 6px;
  background: #ffffff;
  font-size: 1rem;
  font-family: inherit;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #d0d7de;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(107, 91, 149, 0.1);
}

input::placeholder, textarea::placeholder {
  color: #999;
  font-weight: 400;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

/* ============ BUTTON ============ */
.submit-btn {
  padding: 1.5rem 2.5rem;
  background: #0f0f1e;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
  width: 100%;
}

.submit-btn:hover:not(:disabled) {
  background: #1a1a2e;
  transform: translateX(2px);
}

.submit-btn:active:not(:disabled) {
  transform: translateX(2px);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.form-disclaimer {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  text-align: center;
}

/* ============ ERROR MESSAGE ============ */
.error-message {
  background: #fee2e2;
  color: #dc2626;
  border-left: 4px solid #dc2626;
  padding: 1rem;
  border-radius: 4px;
  font-weight: 500;
  margin-top: 1rem;
}

/* ============================================
   TABLET RESPONSIVE (768px - 1024px)
   ============================================ */
@media (max-width: 1024px) {
  .app-container {
    grid-template-columns: 1fr;
  }

  .hero-section {
    padding: 3rem 2rem;
    min-height: 50vh;
  }

  .hero-heading {
    font-size: 2.5rem;
  }

  .form-section {
    padding: 3rem 2rem;
    min-height: 50vh;
  }

  .form-title {
    font-size: 2rem;
  }
}

/* ============================================
   MOBILE RESPONSIVE (< 768px)
   ============================================ */
@media (max-width: 768px) {
  .app-container {
    grid-template-columns: 1fr;
  }

  .hero-section {
    padding: 2rem 1.5rem;
    min-height: 40vh;
  }

  .hero-heading {
    font-size: 1.75rem;
  }

  .hero-description {
    font-size: 0.95rem;
  }

  .current-time {
    font-size: 2rem;
  }

  .current-date {
    font-size: 0.85rem;
  }

  .form-section {
    padding: 2rem 1.5rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .form-description {
    font-size: 0.9rem;
  }

  input, select, textarea {
    padding: 1rem;
    font-size: 16px;
  }

  .submit-btn {
    padding: 1rem;
    font-size: 0.95rem;
  }
}

/* ============================================
   SMALL MOBILE (< 480px)
   ============================================ */
@media (max-width: 480px) {
  .hero-section {
    padding: 1.5rem 1rem;
  }

  .hero-heading {
    font-size: 1.5rem;
  }

  .form-section {
    padding: 1.5rem 1rem;
  }

  .form-title {
    font-size: 1.25rem;
  }

  .form-description {
    font-size: 0.85rem;
  }
}
</style>