<script setup>
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

const currentTime = ref('')
const currentDate = ref('')
const years = ref('')
const nama = ref('')
const telepon = ref('')
const dari = ref('umum')
const instansiNama = ref('')
const keperluan = ref('')
const isSubmitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)

const updateTime = () => {
  const now = new Date()
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${hours}.${minutes}`
  currentDate.value = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
  years.value = `${now.getFullYear()}`
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})

const initSupabase = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials missing')
    return null
  }
  return createClient(supabaseUrl, supabaseKey)
}

const submitForm = async () => {
  submitError.value = ''
  submitSuccess.value = false
  
  // Validasi
  if (!nama.value.trim()) {
    submitError.value = 'Silakan isi nama lengkap'
    return
  }
  
  if (!telepon.value.trim()) {
    submitError.value = 'Silakan isi nomor telepon'
    return
  }
  
  // Validasi format telepon
  const phoneRegex = /^[0-9+\-\s()]{8,}$/
  if (!phoneRegex.test(telepon.value)) {
    submitError.value = 'Format nomor telepon tidak valid'
    return
  }
  
  // Validasi instansi/organisasi jika dipilih
  if (dari.value !== 'umum' && !instansiNama.value.trim()) {
    submitError.value = `Silakan isi nama ${dari.value === 'instansi' ? 'Instansi' : 'Organisasi'}`
    return
  }
  
  if (!keperluan.value.trim()) {
    submitError.value = 'Silakan isi keperluan kunjungan'
    return
  }
  
  isSubmitting.value = true
  try {
    const supabase = initSupabase()
    if (!supabase) {
      submitError.value = 'Konfigurasi Supabase tidak valid'
      return
    }
    
    const { data, error } = await supabase
      .from('tamu')
      .insert([
        {
          nama: nama.value.trim(),
          telepon: telepon.value.trim(),
          dari: dari.value,
          nama_instansi: dari.value !== 'umum' ? instansiNama.value.trim() : null,
          keperluan: keperluan.value.trim(),
          created_at: new Date().toISOString()
        }
      ])
    
    if (error) {
      submitError.value = 'Error: ' + (error.message || 'Gagal mengirim data')
      console.error('Supabase error:', error)
      return
    }
    
    submitSuccess.value = true
    nama.value = ''
    telepon.value = ''
    dari.value = 'umum'
    instansiNama.value = ''
    keperluan.value = ''
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      submitSuccess.value = false
    }, 5000)
  } catch (error) {
    submitError.value = 'Error: ' + error.message
    console.error('Submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
<template>
  <div class="app-container">
    <!-- Hero Section - Left Side -->
    <div class="hero-section">
      <!-- Header with Logo -->
      <div class="hero-header">
        <div class="time-display">
          <p class="current-time">{{ currentTime }}</p>
          <p class="current-date">{{ currentDate }}</p>
        </div>
      </div>

      <!-- Footer with Time -->
      <div class="hero-footer">
        
        <div class="security-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Data Anda aman & terenkripsi</span>
        </div>
      </div>
    </div>

    <!-- Form Section - Right Side -->
    <div class="form-section">
      <div class="form-container">
        <div class="form-header">
          <span class="form-badge">BUKU TAMU</span>
          <p class="form-description">Mohon isi formulir di bawah ini. Proses hanya membutuhkan kurang dari satu menit.</p>
        </div>

        <form @submit.prevent="submitForm" class="form-wrapper">
          <div class="form-group">
            <label>NAMA PENGUNJUNG</label>
            <input v-model="nama" type="text" placeholder="Silahkan Isi Nama Anda" required />
          </div>
          
          <div class="form-group">
            <label>NO. TELEPON</label>
            <input v-model="telepon" type="tel" placeholder="08XX XXXX XXXX" maxlength="15" required />
          </div>
          
          <div class="form-group">
            <label>DARI</label>
            <select v-model="dari" required>
              <option value="umum">Umum</option>
              <option value="instansi">Instansi</option>
              <option value="organisasi">Organisasi</option>
            </select>
          </div>
          
          <div v-if="dari !== 'umum'" class="form-group">
            <label>NAMA {{ dari === 'instansi' ? 'INSTANSI' : 'ORGANISASI' }}</label>
            <input v-model="instansiNama" type="text" :placeholder="`Nama ${dari === 'instansi' ? 'Instansi' : 'Organisasi'} Anda`" required />
          </div>
          
          <div class="form-group">
            <label>KEPERLUAN KUNJUNGAN</label>
            <textarea v-model="keperluan" placeholder="Cth. Meeting, pengiriman dokumen, dsb." required></textarea>
          </div>

          <button type="submit" :disabled="isSubmitting" class="submit-btn">
            <span>{{ isSubmitting ? 'Mengirim...' : 'Kirim' }}</span>
            <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <p v-if="submitError" class="error-message">{{ submitError }}</p>
          <p v-if="submitSuccess" class="success-message">✓ Kunjungan berhasil didaftarkan! Terima kasih.</p>
          
          <p class="form-disclaimer">
            UPTD Pengelolaan Parkir @{{years}}
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  min-height: 100vh;
  height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #ffffff;
  overflow: hidden;
}

/* ============================================
   HERO SECTION - LEFT SIDE
   ============================================ */
.hero-section {
  flex: 1;
  background: 
    linear-gradient(135deg, rgba(15, 23, 42, 0.400) 0%, rgba(30, 41, 59, 0.75) 100%),
    url('https://videshiiya.com/app/uploads/2019/05/BCC-018.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 48px;
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.4) 100%);
  pointer-events: none;
}

/* Header with Logo */
.hero-header {
  position: relative;
  z-index: 2;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.logo-icon svg {
  width: 22px;
  height: 22px;
  color: white;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.logo-subtitle {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1.5px;
  opacity: 0.7;
  color: #f59e0b;
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 520px;
}

.welcome-badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2.5px;
  color: #f59e0b;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.hero-title em {
  font-style: italic;
  color: #fbbf24;
}

.hero-description {
  font-size: 15px;
  line-height: 1.7;
  opacity: 0.85;
  max-width: 400px;
  font-weight: 400;
}

/* Hero Footer */
.hero-footer {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.time-display {
  display: flex;
  flex-direction: column;
}

.time-display .current-time {
  font-size: 48px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -1px;
}

.time-display .current-date {
  font-size: 18px;
  opacity: 0.7;
  margin-top: 6px;
  font-weight: 400;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  opacity: 0.8;
}

.security-badge svg {
  opacity: 0.7;
}

/* ============================================
   FORM SECTION - RIGHT SIDE
   ============================================ */
.form-section {
  flex: 1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 420px;
}

.form-header {
  margin-bottom: 36px;
}

.form-badge {
  display: inline-block;
  font-size: 26px;
  font-weight: 1000;
  letter-spacing: 2px;
  color: #000000;
  margin-bottom: 10px;
}

.form-title {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.form-description {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #64748b;
  text-transform: uppercase;
}

input, select, textarea {
  padding: 16px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  background: #ffffff;
  transition: all 0.2s ease;
  color: #1e293b;
}

select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 18px;
  padding-right: 48px;
}

input::placeholder, textarea::placeholder {
  color: #94a3b8;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #1e293b;
  box-shadow: 0 0 0 3px rgba(30, 41, 59, 0.08);
}

textarea {
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 32px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.submit-btn svg {
  transition: transform 0.2s ease;
}

.submit-btn:hover:not(:disabled) svg {
  transform: translateX(4px);
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 14px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
}

.success-message {
  background: #f0fdf4;
  color: #16a34a;
  padding: 14px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
}

.form-disclaimer {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  line-height: 1.6;
  margin-top: 8px;
  font-style: italic;
}

/* ============================================
   RESPONSIVE - MOBILE
   ============================================ */
@media (max-width: 1024px) {
  .hero-section {
    padding: 32px 36px;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .form-section {
    padding: 36px;
  }
  
  .form-title {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow: auto;
  }

  .hero-section {
    min-height: auto;
    padding: 28px 24px;
    flex: none;
  }
  
  .hero-content {
    padding: 32px 0;
  }

  .welcome-badge {
    font-size: 10px;
    margin-bottom: 12px;
  }

  .hero-title {
    font-size: 28px;
    margin-bottom: 16px;
  }

  .hero-description {
    font-size: 14px;
  }
  
  .hero-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .time-display .current-time {
    font-size: 28px;
  }

  .time-display .current-date {
    font-size: 12px;
  }

  .form-section {
    padding: 32px 24px;
    flex: none;
  }
  
  .form-container {
    max-width: 100%;
  }

  .form-header {
    margin-bottom: 28px;
  }

  .form-title {
    font-size: 24px;
  }

  .form-description {
    font-size: 14px;
  }
  
  .form-wrapper {
    gap: 20px;
  }

  input, textarea {
    padding: 14px 16px;
    font-size: 16px; /* Prevent zoom on iOS */
  }
  
  .submit-btn {
    padding: 16px 24px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 24px 20px;
  }
  
  .logo-container {
    gap: 12px;
  }
  
  .logo-icon {
    width: 40px;
    height: 40px;
  }
  
  .logo-title {
    font-size: 14px;
  }
  
  .hero-title {
    font-size: 24px;
  }
  
  .form-section {
    padding: 28px 20px;
  }
  
  .form-title {
    font-size: 22px;
  }
}
</style>
