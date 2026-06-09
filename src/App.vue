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
  currentTime.value = `${hours}.${minutes}`
  currentDate.value = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})

const submitForm = async () => {
  submitError.value = ''
  if (!nama.value.trim() || !telepon.value.trim() || !keperluan.value.trim()) {
    submitError.value = 'Silakan isi semua field'
    return
  }
  isSubmitting.value = true
  try {
    const response = await axios.post('http://localhost:3000/api/tamu', {
      nama: nama.value.trim(),
      telepon: telepon.value.trim(),
      dari: dari.value,
      nama_instansi: dari.value === 'umum' ? null : instansiNama.value.trim(),
      keperluan: keperluan.value.trim()
    }, { headers: { 'Content-Type': 'application/json' }, timeout: 5000 })
    alert('✓ Formulir berhasil dikirim! Terima kasih telah mengunjungi.')
    nama.value = ''
    telepon.value = ''
    dari.value = 'umum'
    instansiNama.value = ''
    keperluan.value = ''
  } catch (error) {
    if (error.response) {
      submitError.value = 'Error: ' + (error.response.data.error || 'Gagal mengirim data')
    } else if (error.request) {
      submitError.value = '⚠️ Server tidak merespons. Pastikan backend running di localhost:3000'
    } else {
      submitError.value = 'Error: ' + error.message
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
<template>
  <div class="app-container">
    <div class="hero-section">
      <div class="hero-header">
        <p class="current-time">{{ currentTime }}</p>
        <p class="current-date">{{ currentDate }}</p>
      </div>
      <div class="hero-footer">
        <div class="security-badge">
          <span>Data Anda aman</span>
        </div>
      </div>
    </div>
    <div class="form-section">
      <div class="form-header">
        <p class="form-label">Buku Tamu</p>
        <p class="form-description">Mohon isi formulir</p>
      </div>
      <form @submit.prevent="submitForm" class="form-wrapper">
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input v-model="nama" type="text" placeholder="Nama Anda" required />
        </div>
        <div class="form-group">
          <label>Nomor Telepon</label>
          <input v-model="telepon" type="tel" placeholder="08XX" required />
        </div>
        <div class="form-group">
          <label>Asal</label>
          <select v-model="dari" required>
            <option value="umum">Umum</option>
            <option value="instansi">Instansi</option>
            <option value="organisasi">Organisasi</option>
          </select>
        </div>
        <div v-if="dari !== 'umum'" class="form-group">
          <label>Nama {{ dari === 'instansi' ? 'Instansi' : 'Organisasi' }}</label>
          <input v-model="instansiNama" type="text" required />
        </div>
        <div class="form-group">
          <label>Keperluan</label>
          <textarea v-model="keperluan" placeholder="Jelaskan keperluan" required></textarea>
        </div>
        <button type="submit" :disabled="isSubmitting" class="submit-btn">
          {{ isSubmitting ? 'Mengirim...' : 'Kirim' }}
        </button>
        <p v-if="submitError" class="error-message">{{ submitError }}</p>
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  background: #f5f5f5;
}

.hero-section {
  flex: 1;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), 
              url('https://videshiiya.com/app/uploads/2019/05/BCC-018.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 50px 40px;
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
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.3));
  pointer-events: none;
}

.hero-header {
  width: 100%;
  position: relative;
  z-index: 1;
}

.current-time {
  font-size: 56px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 16px;
  letter-spacing: -1px;
}

.current-date {
  font-size: 16px;
  font-weight: 400;
  opacity: 0.95;
  line-height: 1.5;
}

.hero-footer {
  width: 100%;
  position: relative;
  z-index: 1;
  display: flex;
  gap: 20px;
  flex-direction: column;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 16px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: fit-content;
}

.form-section {
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 40px;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.08);
}

.form-header {
  margin-bottom: 35px;
  text-align: left;
  width: 100%;
  max-width: 420px;
}

.form-label {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.form-description {
  font-size: 15px;
  color: #666;
  font-weight: 400;
  line-height: 1.6;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 100%;
  max-width: 420px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #2a2a2a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

input, select, textarea {
  padding: 13px 14px;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  background: white;
  transition: all 0.25s ease;
  color: #333;
}

input::placeholder, textarea::placeholder {
  color: #999;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #2e7d32;
  background: #fafafa;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}

textarea {
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.25);
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1b5e20 0%, #003300 100%);
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.35);
  transform: translateY(-2px);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.65;
  box-shadow: none;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border-left: 4px solid #c62828;
  margin-top: 12px;
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }

  .hero-section {
    min-height: 280px;
    padding: 30px 20px;
    justify-content: flex-start;
  }

  .hero-header {
    margin-bottom: 40px;
  }

  .current-time {
    font-size: 40px;
  }

  .current-date {
    font-size: 14px;
  }

  .form-section {
    padding: 30px 20px;
  }

  .form-label {
    font-size: 24px;
  }

  .form-wrapper {
    max-width: 100%;
  }
}
</style>
