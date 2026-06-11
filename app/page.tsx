'use client';

import { useState } from 'react';
import '../styles/modern.css';

interface Visitor {
  name: string;
  phone: string;
  email: string;
  purpose: string;
  company: string;
  createdAt: string;
}

export default function Home() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    purpose: '',
    company: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Add visitor to local state
      const newVisitor: Visitor = {
        ...formData,
        createdAt: new Date().toLocaleString('id-ID'),
      };
      
      setVisitors([newVisitor, ...visitors]);

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        purpose: '',
        company: '',
      });

      alert('Data pengunjung berhasil ditambahkan!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat menambahkan data');
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
          {visitors.length > 0 ? (
            <div className="visitors-list">
              {visitors.map((visitor, idx) => (
                <div key={idx} className="visitor-card">
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
                      📅 {visitor.createdAt}
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
