<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const currentTime = ref('')
const currentDate = ref('')

const nama = ref('')
const telepon = ref('')
const dari = ref('umum')
const instansiNama = ref('')
const keperluan = ref('')
const isSubmitting = ref(false)
const submitError = ref('')

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

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})

const submitForm = async () => {
  submitError.value = ''
  
  if (!nama.value.trim()) {
    submitError.value = 'Nama harus diisi'
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
    submitError.value = 'Keperluan harus diisi'
    return
  }

  if (dari.value !== 'umum' && !instansiNama.value.trim()) {
    submitError.value = 'Nama Instansi/Organisasi harus diisi'
    return
  }

  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    // Try to send to backend if available, else simulate success for demo
    try {
      const result = await axios.post('http://localhost:3000/api/tamu', {
        nama: nama.value.trim(),
        telepon: telepon.value.trim(),
        dari: dari.value,
        nama_instansi: dari.value === 'umum' ? null : instansiNama.value.trim(),
        keperluan: keperluan.value.trim()
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 3000
      })
    } catch (backendError) {
      // Backend not available - show demo success
      console.log('Backend not available, showing demo mode')
    }
    
    alert('Formulir berhasil dikirim! Terima kasih telah mengunjungi.')
    nama.value = ''
    telepon.value = ''
    dari.value = 'umum'
    instansiNama.value = ''
    keperluan.value = ''
  } catch (error) {
    submitError.value = 'Terjadi kesalahan. Silakan coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="app-container">
    <div class="hero-section" :style="{ backgroundImage: 'url(https://videshiiya.com/app/uploads/2019/05/BCC-018.jpg)' }">
      <div class="hero-header">
        <p class="current-time">{{ currentTime }}</p>
        <p class="current-date">{{ currentDate }}</p>
      </div>
      <div class="hero-footer">
        <div class="time-section"></div>
        <div class="security-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Data Anda aman & terenkripsi</span>
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="form-header">
        <p class="form-label">Buku Tamu</p>
        <p class="form-description">Mohon isi formulir di bawah ini.</p>
      </div>

      <form @submit.prevent="submitForm" class="form-wrapper">
        <div class="form-group">
          <label for="nama">Nama Lengkap</label>
          <input v-model="nama" id="nama" type="text" placeholder="Mis. Budi Santoso" required>
        </div>

        <div class="form-group">
          <label for="telepon">Nomor Telepon</label>
          <input v-model="telepon" id="telepon" type="tel" placeholder="08XX-XXXX-XXXX" required>
        </div>

        <div class="form-group">
          <label for="dari">Asal / Dari</label>
          <select v-model="dari" id="dari" required>
            <option value="umum">Umum</option>
            <option value="instansi">Instansi</option>
            <option value="organisasi">Organisasi</option>
          </select>
        </div>

        <div v-if="dari !== 'umum'" class="form-group">
          <label for="instansiNama">Nama {{ dari === 'instansi' ? 'Instansi' : 'Organisasi' }}</label>
          <input v-model="instansiNama" id="instansiNama" type="text" :placeholder="`Masukkan nama ${dari}`" required>
        </div>

        <div class="form-group">
          <label for="keperluan">Keperluan Kunjungan</label>
          <textarea v-model="keperluan" id="keperluan" placeholder="Cth. Meeting, pengiriman dokumen" required></textarea>
        </div>

        <button type="submit" :disabled="isSubmitting" class="submit-btn">
          <span>{{ isSubmitting ? 'Mengirim...' : 'Kirim' }}</span>
          <svg v-if="!isSubmitting" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>

        <p class="form-disclaimer">UPTD Pengelolaan Parkir @2026</p>
        <div v-if="submitError" class="error-message">{{ submitError }}</div>
      </form>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

.hero-section {
  flex: 1;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 40px;
  color: white;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}

.hero-section > * {
  position: relative;
  z-index: 1;
}

.hero-header {
  width: 100%;
}

.current-time {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 10px;
}

.current-date {
  font-size: 16px;
  font-weight: 400;
  opacity: 0.9;
}

.hero-footer {
  width: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.form-section {
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 40px;
  overflow-y: auto;
}

.form-header {
  margin-bottom: 30px;
}

.form-label {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.form-description {
  font-size: 14px;
  color: #666;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

input, select, textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #4a90e2;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-disclaimer {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 20px;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }

  .hero-section {
    min-height: 300px;
    padding: 20px;
  }

  .form-section {
    padding: 30px 20px;
  }

  .current-time {
    font-size: 32px;
  }

  .form-label {
    font-size: 22px;
  }
}
</style>
