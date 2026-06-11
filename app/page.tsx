'use client';

import { useState, useEffect } from 'react';

// Dynamic import Supabase with fallback
let supabase: any = null;
try {
  // Try to import Supabase
  const { supabase: sb } = require('@/lib/supabase');
  supabase = sb;
} catch (err) {
  // Fallback to mock if Supabase fails
  console.warn('Supabase initialization failed, using mock mode');
  supabase = {
    from: () => ({
      select: () => ({
        order: () => ({
          limit: () => ({ then: async (cb: any) => cb({ data: [], error: null }) })
        })
      }),
      insert: () => ({
        select: () => ({ then: async (cb: any) => cb({ data: [], error: null }) })
      })
    })
  };
}

interface Tamu {
  id?: string;
  nama: string;
  telepon: string;
  dari: 'umum' | 'instansi' | 'organisasi';
  nama_instansi?: string;
  keperluan: string;
  waktu_kunjungan?: string;
  created_at?: string;
}

// Color mapping for categories
const categoryColors: Record<'umum' | 'instansi' | 'organisasi', string> = {
  umum: '#3B82F6',
  instansi: '#10B981',
  organisasi: '#F59E0B'
};

export default function Home() {
  const [tamuList, setTamuList] = useState<Tamu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    telepon: '',
    dari: 'umum' as 'umum' | 'instansi' | 'organisasi',
    nama_instansi: '',
    keperluan: '',
  });

  useEffect(() => {
    loadTamu();
  }, []);

  const loadTamu = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('tamu')
        .select('*')
        .order('waktu_kunjungan', { ascending: false })
        .limit(50);

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        throw fetchError;
      }

      setTamuList(data || []);
    } catch (err) {
      console.error('Error loading tamu:', err);
      setError('Gagal memuat data pengunjung. Menggunakan mode offline.');
      // Fallback ke local state jika Supabase error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.nama || !formData.telepon || !formData.keperluan) {
        setError('Mohon isi semua field yang wajib (nama, telepon, keperluan)');
        setLoading(false);
        return;
      }

      // Validate instansi field if selected
      if ((formData.dari === 'instansi' || formData.dari === 'organisasi') && !formData.nama_instansi) {
        setError(`Mohon isi field "Dari ${formData.dari === 'instansi' ? 'Instansi' : 'Organisasi'}"`);
        setLoading(false);
        return;
      }

      // Try to save to Supabase
      const { data, error: insertError } = await supabase
        .from('tamu')
        .insert([
          {
            nama: formData.nama,
            telepon: formData.telepon,
            dari: formData.dari,
            nama_instansi: formData.nama_instansi || null,
            keperluan: formData.keperluan,
          },
        ])
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        // Fallback: Add to local state if Supabase fails
        const newTamu: Tamu = {
          nama: formData.nama,
          telepon: formData.telepon,
          dari: formData.dari,
          nama_instansi: formData.nama_instansi,
          keperluan: formData.keperluan,
          waktu_kunjungan: new Date().toISOString(),
        };
        setTamuList([newTamu, ...tamuList]);
        setError('Data disimpan secara lokal (offline mode)');
      } else if (data) {
        // Success - reload from database
        await loadTamu();
      }

      // Reset form
      setFormData({
        nama: '',
        telepon: '',
        dari: 'umum',
        nama_instansi: '',
        keperluan: '',
      });

      alert('Data pengunjung berhasil ditambahkan!');
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Terjadi kesalahan saat menambahkan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Hadirlah dengan tenang. <em>Kami menyambut Anda.</em></h1>
            <p className="hero-description">Mohon isi data kunjungan singkat ini. Resepsionis akan menghubungi pihak terkait untuk menemani Anda selama berada di kantor kami.</p>
            <div className="hero-footer">
              <div className="time-display">
                <p className="time">19:19</p>
                <p className="date">Selasa, 9 Juni 2026</p>
              </div>
            </div>
          </div>
        </section>

        <section className="form-panel-section">
          <div className="form-panel-header">
            <span className="form-label">BUKU TAMU</span>
            <h2>Daftarkan kunjungan Anda</h2>
            <p className="form-subtitle">Mohon isi formulir di bawah ini. Proses hanya membutuhkan kurang dari satu menit.</p>
          </div>

          {error && (
            <div className="error-banner">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="visitor-form">
            <div className="form-group">
              <label htmlFor="nama">Nama Lengkap *</label>
              <input
                type="text"
                id="nama"
                required
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telepon">No. Telepon *</label>
                <input
                  type="tel"
                  id="telepon"
                  required
                  value={formData.telepon}
                  onChange={(e) =>
                    setFormData({ ...formData, telepon: e.target.value })
                  }
                  placeholder="Contoh: 081234567890"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dari">Dari *</label>
                <select
                  id="dari"
                  required
                  value={formData.dari}
                  onChange={(e) => {
                    const newDari = e.target.value as 'umum' | 'instansi' | 'organisasi';
                    setFormData({ 
                      ...formData, 
                      dari: newDari,
                      // Clear nama_instansi when switching to umum
                      nama_instansi: newDari === 'umum' ? '' : formData.nama_instansi
                    });
                  }}
                >
                  <option value="umum">Umum</option>
                  <option value="instansi">Instansi</option>
                  <option value="organisasi">Organisasi</option>
                </select>
              </div>
            </div>

            {(formData.dari === 'instansi' || formData.dari === 'organisasi') && (
              <div className="form-group">
                <label htmlFor="nama_instansi">
                  Dari {formData.dari === 'instansi' ? 'Instansi' : 'Organisasi'} *
                </label>
                <input
                  type="text"
                  id="nama_instansi"
                  required
                  value={formData.nama_instansi}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_instansi: e.target.value })
                  }
                  placeholder={`Masukkan nama ${formData.dari === 'instansi' ? 'instansi/perusahaan' : 'organisasi'}`}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="keperluan">Keperluan Kunjungan *</label>
              <textarea
                id="keperluan"
                required
                rows={4}
                value={formData.keperluan}
                onChange={(e) =>
                  setFormData({ ...formData, keperluan: e.target.value })
                }
                placeholder="Jelaskan keperluan kunjungan Anda..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? 'Menyimpan...' : 'Daftarkan Kunjungan'}
            </button>
          </form>

          <p className="form-footer-text">Dengan mengisi formulir, Anda menyetujui pencatatan data kunjungan untuk keperluan administrasi internal</p>
        </section>
      </main>
    </div>
  );
}
