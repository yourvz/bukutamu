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
    await axios.post('http://localhost:3000/api/tamu', {
      nama: nama.value.trim(),
      telepon: telepon.value.trim(),
      dari: dari.value,
      nama_instansi: dari.value === 'umum' ? null : instansiNama.value.trim(),
      keperluan: keperluan.value.trim()
    }, { headers: { 'Content-Type': 'application/json' }, timeout: 3000 })
  } catch (e) {}
  alert('Terima kasih! Formulir Anda telah dikirim.')
  nama.value = ''
  telepon.value = ''
  dari.value = 'umum'
  instansiNama.value = ''
  keperluan.value = ''
  isSubmitting.value = false
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
* { margin: 0; padding: 0; box-sizing: border-box; }
.app-container { display: flex; min-height: 100vh; font-family: system-ui; }
.hero-section {
  flex: 1;
  background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://videshiiya.com/app/uploads/2019/05/BCC-018.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  color: white;
}
.hero-header { width: 100%; }
.current-time { font-size: 48px; font-weight: 700; }
.current-date { font-size: 16px; margin-top: 10px; }
.hero-footer { width: 100%; }
.security-badge { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.form-section { flex: 1; background: white; display: flex; flex-direction: column; justify-content: center; padding: 60px 40px; }
.form-header { margin-bottom: 30px; }
.form-label { font-size: 28px; font-weight: 700; }
.form-description { font-size: 14px; color: #666; margin-top: 10px; }
.form-wrapper { display: flex; flex-direction: column; gap: 20px; max-width: 400px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
label { font-size: 14px; font-weight: 600; }
input, select, textarea { padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; font-family: inherit; }
input:focus, select:focus, textarea:focus { outline: none; border-color: #4a90e2; }
textarea { min-height: 80px; }
.submit-btn { padding: 12px 20px; background: #007bff; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; }
.submit-btn:hover:not(:disabled) { background: #0056b3; }
.submit-btn:disabled { background: #ccc; cursor: not-allowed; }
.error-message { background: #fee; color: #c33; padding: 12px; border-radius: 6px; font-size: 14px; }
</style>
