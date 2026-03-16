# 📚 TitikKoma; — Student Productivity Toolbox

**TitikKoma;** adalah ekosistem *micro-tools* berbasis web yang dirancang khusus untuk mempermudah rutinitas akademik mahasiswa. Dibangun dengan fokus pada kecepatan, privasi (tanpa database), dan pengalaman pengguna yang modern.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

---

## ✨ Fitur Utama

Aplikasi ini mengintegrasikan 6 alat produktivitas dalam satu platform **Single Page Application (SPA)**:

1. **⚖️ AdilKelompok**: Pengacak daftar nama mahasiswa ke dalam kelompok secara adil menggunakan algoritma *Fisher-Yates Shuffle*.
2. **💬 HaloDosen**: Generator pesan WhatsApp otomatis dengan format bahasa Indonesia yang sopan dan baku untuk menghubungi dosen.
3. **🔍 Parafrase**: Alat pembanding teks berdampingan untuk mengecek tingkat kemiripan tulisan menggunakan algoritma *Levenshtein Distance*.
4. **📊 HitungKata**: Analisis statistik penulisan esai (jumlah kata/karakter) serta estimasi waktu baca (*reading time*).
5. **📖 SitasiCepat**: Pembuat daftar pustaka instan dengan dukungan format internasional **APA 7th Edition** dan **MLA**.
6. **⏳ H-Berapa?**: Widget hitung mundur deadline tugas yang tersimpan aman secara lokal di browser Anda.

---

## 🛠️ Tech Stack

- **Core:** React 19+
- **Routing:** React Router 7+
- **Styling:** Tailwind CSS (dengan dukungan penuh Dark Mode & Glassmorphism)
- **Icons:** Lucide React
- **Persistence:** LocalStorage API (Data tetap aman tanpa perlu login/server)
- **Build Tool:** Vite

---

## 📸 Fitur UI/UX Premium

- **Mobile-First Navigation:** Navigasi bawah melayang (*Floating Bottom Nav*) yang ergonomis.
- **Dynamic Routing:** Setiap tool memiliki URL unik untuk memudahkan *bookmarking*.
- **Haptic-Like Interactions:** Animasi transisi yang halus dan respon tombol yang interaktif.
- **Privacy-Centric:** Semua pemrosesan data dilakukan di sisi klien (browser), tidak ada data yang dikirim ke server luar.

---

## 🚀 Instalasi Lokal

Ingin mencoba atau mengembangkan TitikKoma di komputer sendiri?

1. **Clone Repositori**
```bash
git clone [https://github.com/adisr21/titikkoma.git](https://github.com/adisr21/titikkoma.git)
cd titikkoma
```
2.  **Install Dependensi**
```bash
npm install
```
3. **Jalankan Development Server**
```bash
npm run dev
```

---

# 📁 Arsitektur Proyek
```plain
src/
├── components/       # Komponen UI global (Navbar, Buttons)
├── pages/            # Halaman fitur (GroupPicker, HaloDosen, dll)
├── styles/           # Konfigurasi Tailwind & Global CSS
├── App.jsx           # Entry point Routing & Layout Utama
└── main.jsx          # Render engine
```
# 📜 Lisensi
> Proyek ini berada di bawah lisensi MIT. Anda bebas untuk menggunakan, memodifikasi, dan mendistribusikannya kembali.
Dibuat dengan semangat "Selesaikan tugasmu, lanjutkan langkahmu."
---

### Tips untuk GitHub Kamu:
1. **Live Demo:** Begitu kamu selesai deploy ke Vercel/Netlify, pastikan linknya dipasang di bagian *About* di sisi kanan repositori GitHub agar orang bisa langsung mencoba tanpa install.
2. **Issues:** Tambahkan beberapa "Issues" di GitHub sebagai rencana fitur masa depan (misal: "Fitur Export PDF untuk Sitasi"). Ini menunjukkan bahwa kamu aktif merencanakan pengembangan proyek.