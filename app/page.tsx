'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import '../styles/modern.css';

interface Visitor {
  id?: string;
  name: string;
  phone: string;
  email: string;
  purpose: string;
  company?: string;
  created_at?: string;
}

export default function Home() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    purpose: '',
    company: '',
  });

  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('visitors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        throw fetchError;
      }

      setVisitors(data || []);
    } catch (err) {
      console.error('Error loading visitors:', err);
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

      // Try to save to Supabase
      const { data, error: insertError } = await supabase
        .from('visitors')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            purpose: formData.purpose,
            company: formData.company || null,
          },
        ])
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        // Fallback: Add to local state if Supabase fails
        const newVisitor: Visitor = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          purpose: formData.purpose,
          company: formData.company,
          created_at: new Date().toISOString(),
        };
        setVisitors([newVisitor, ...visitors]);
        setError('Data disimpan secara lokal (offline mode)');
      } else if (data) {
        // Success - reload from database
        await loadVisitors();
      }

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        purpose: '',
        company: '',
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
          <h2>Daftarkan Kunjungan Anda</h2>
          <form onSubmit={handleSubmit} className="visitor-form">
            <div className="form-group">
              <label htmlFor="name">Nama Lengkap *</label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">No. Telepon *</label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Contoh: 081234567890"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="nama@contoh.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="company">Instansi/Perusahaan</label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="Masukkan nama instansi atau perusahaan"
              />
            </div>

            <div className="form-group">
              <label htmlFor="purpose">Keperluan Kunjungan *</label>
              <select
                id="purpose"
                required
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
              >
                <option value="">-- Pilih Keperluan --</option>
                <option value="meeting">Rapat/Meeting</option>
                <option value="service">Layanan</option>
                <option value="survey">Survey</option>
                <option value="other">Lainnya</option>
              </select>
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
          <h2>Daftar Pengunjung Terbaru</h2>
          
          {error && (
            <div className="error-banner">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <p className="loading-text">Memuat data pengunjung...</p>
          ) : visitors.length > 0 ? (
            <div className="visitors-list">
              {visitors.map((visitor) => (
                <div key={visitor.id || visitor.email} className="visitor-card">
                  <div className="visitor-info">
                    <h3>{visitor.name}</h3>
                    <p>
                      <strong>Telepon:</strong> {visitor.phone}
                    </p>
                    <p>
                      <strong>Email:</strong> {visitor.email}
                    </p>
                    {visitor.company && (
                      <p>
                        <strong>Instansi:</strong> {visitor.company}
                      </p>
                    )}
                    <p>
                      <strong>Keperluan:</strong> {visitor.purpose}
                    </p>
                    <p className="visit-time">
                      📅 {new Date(visitor.created_at || visitor.createdAt || Date.now()).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Belum ada data pengunjung</p>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Buku Tamu Digital. All rights reserved.</p>
      </footer>
    </div>
  );
}
