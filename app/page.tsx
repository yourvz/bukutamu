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
      <header className="header">
        <h1>📋 Buku Tamu Digital</h1>
        <p>Aplikasi Pencatatan Pengunjung Modern</p>
      </header>

      <main className="main-content">
        <section className="form-section">
          <h2>📝 Daftarkan Kunjungan Anda</h2>
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
                  onChange={(e) =>
                    setFormData({ ...formData, dari: e.target.value as 'umum' | 'instansi' | 'organisasi' })
                  }
                >
                  <option value="umum">Umum</option>
                  <option value="instansi">Instansi</option>
                  <option value="organisasi">Organisasi</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="nama_instansi">Instansi/Perusahaan/Organisasi</label>
              <input
                type="text"
                id="nama_instansi"
                value={formData.nama_instansi}
                onChange={(e) =>
                  setFormData({ ...formData, nama_instansi: e.target.value })
                }
                placeholder="Masukkan nama instansi atau organisasi (jika ada)"
              />
            </div>

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
        </section>

        <section className="visitors-section">
          <h2>📋 Daftar Pengunjung Terbaru</h2>
          
          {error && (
            <div className="error-banner">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <p className="loading-text">⏳ Memuat data pengunjung...</p>
          ) : tamuList.length > 0 ? (
            <div className="visitors-list">
              {tamuList.map((tamu, idx) => (
                <div key={tamu.id || idx} className="visitor-card">
                  <div className="visitor-info">
                    <h3>👤 {tamu.nama}</h3>
                    <p>
                      <strong>📞 Telepon:</strong> {tamu.telepon}
                    </p>
                    <p>
                      <strong>🏢 Dari:</strong> 
                      <span className={`category-badge ${tamu.dari}`}>
                        {tamu.dari === 'umum' ? 'Umum' : tamu.dari === 'instansi' ? 'Instansi' : 'Organisasi'}
                      </span>
                    </p>
                    {tamu.nama_instansi && (
                      <p>
                        <strong>🏛️ Instansi:</strong> {tamu.nama_instansi}
                      </p>
                    )}
                    <p>
                      <strong>📌 Keperluan:</strong>
                      <span className="keperluan-text">{tamu.keperluan}</span>
                    </p>
                    <p className="visit-time">
                      🕐 {new Date(tamu.waktu_kunjungan || tamu.created_at || Date.now()).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">📭 Belum ada data pengunjung</p>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Buku Tamu Digital. All rights reserved.</p>
      </footer>
    </div>
  );
}
