# WIP Tracker & Penjana Laporan (v2.4)

[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-ffca28.svg?style=flat&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Lesen: Apache-2.0](https://img.shields.io/badge/Lesen-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Aplikasi web produktiviti berprestasi tinggi yang direka khas untuk profesional solo, pereka grafik kanan (*Senior Graphic Designer*), ketua teknikal, dan pengurus projek. **WIP Tracker** memudahkan penjejakan tugasan mingguan, eskalasi halangan (*blockers*), arkib retrospektif sprint, dan penjanaan laporan mesyuarat Work-In-Progress (WIP) serta sesi *standup* secara berformat dalam 1-klik, kini disokong oleh pangkalan data awan **Firebase Firestore & Pengesahan Google**.

---

## 📸 Paparan Utama Ruang Kerja (*Workspace Views*)

| Paparan | Tujuan & Keupayaan Utama |
| :--- | :--- |
| **Tugasan Mingguan (*Weekly Deliverables*)** | Papan pemuka sprint aktif dengan matrik KPI masa nyata, penapisan carian pantas, kitaran status tugasan (`Sedang Berjalan` ⇄ `Selesai` ⇄ `Pending`), dan borang kemasukan/pengeditan segera. |
| **Penjana Laporan (*Report Generator*)** | Kompiler laporan Markdown masa nyata dengan pratetap (*Format Standard WIP*, *Poin Eksekutif*, *Format Slack/Discord*, *Ringkasan Pelanggan*), togol kandungan modular, dan salin ke papan klip dalam 1-klik. |
| **Arkib Sprint Mingguan (*Sprints Archive*)** | Lejar sprint bersejarah merentasi suku tahun (Q3 / Q4), carta mikro halaju 6 minggu lepas, nota retrospektif sprint, dan analitik sumbangan pemegang taruh (*stakeholders*). |
| **Penjejak Pending & Risiko (*Pending & Risks Tracker*)** | Pusat penyelesaian insiden untuk menjejak tugasan pending, punca masalah teknikal, pihak bertanggungjawab, SLA penyelesaian (beserta carta *sparkline*), dan buku panduan SOP eskalasi. |

---

## ✨ Ciri-Ciri Utama

- **⚡ Penjana Laporan Mesyuarat 1-Klik**:
  - Menyusun tugasan aktif secara automatik ke dalam teks berstruktur sedia bentang.
  - Pilihan nada penyampaian: *Eksekutif / Ringkas*, *Teknikal / Terperinci*, dan *Santai / Standup*.
  - Togol modular: *Paparkan Tugasan Pending Di Atas*, *Sertakan Nama Pemohon/Ketua*, *Sertakan Sasaran ETA & Langkah Seterusnya*, serta *Lencana Matrik Halaju*.
  - Eksport terus ke **Papan Klip (*Clipboard*)**, **Format Slack**, **Fail Markdown (`.md`)**, dan **Teks Biasa (`.txt`)**.
  - Sejarah sesi tempatan untuk menyalin semula laporan lepas dengan serta-merta.

- **📊 Metrik & KPI Sprint Menyeluruh**:
  - Pengiraan langsung untuk Jumlah Tugasan, Sedang Berjalan, Selesai, dan **Pending**.
  - Bar kemajuan beranimasi dan cincin peratusan halaju visual.

- **🚫 Pengurusan Insiden, Pending & Risiko**:
  - Pengkategorian keterukan (*Critical Pending*, *Berisiko / Menunggu Dependensi*, *Telah Selesai*).
  - Penjejakan SLA dengan purata tempoh penyelesaian dan visualisasi *sparkline*.
  - Panduan SOP (Prosedur Operasi Standard) eskalasi bertempoh masa (&lt;24j, &gt;24j, &gt;48j).

- **🔥 Integrasi Awan Firebase (Firestore & Pengesahan Google)**:
  - Menyokong log masuk akaun Google melalui Firebase Authentication dengan mod pop-up selamat.
  - Pengendalian ralat mesra pengguna bagi penutupan tetingkap log masuk (*graceful popup cancellation handling*).
  - Penyegerakan masa nyata (*real-time live synchronization*) ke Firebase Cloud Firestore.
  - Peraturan keselamatan Firestore (*firestore.rules*) yang teguh dengan pengesanan pemilikan pengguna (`isSignedIn()`, `isOwner()`, `isValidUserDoc()`).
  - Peralihan automatik: Berfungsi luar talian sepenuhnya melalui storan tempatan (*Offline-First*) apabila belum log masuk atau terputus sambungan, dan bersinkron segera apabila log masuk.

- **👤 Pengurusan Profil & Identiti Pengguna**:
  - Memaparkan nama pengguna (**Amri Faizal**), jawatan (*Senior Graphic Designer*), dan avatar aktif secara jelas di bahagian bar navigasi atas (*Header*) dan bar sisi (*Sidebar*).
  - Dialog interaktif **Kemaskini Nama & Profil** untuk menukar nama, emel, dan jawatan ruang kerja pada bila-bila masa.
  - Nama pengguna dipautkan secara automatik ke papan pemuka tugasan mingguan dan penjana laporan mesyuarat (*Report Generator*).

- **💾 Enjin Storan Tempatan Luar Talian (*Offline-First*)**:
  - Menyimpan data secara automatik dalam pelayar melalui `localStorage` / IndexedDB.
  - Pengurus Storan membolehkan sandaran penuh (*backup JSON*) dieksport atau data ditetapkan semula ke sampel asal.

- **🎨 Sistem Reka Bentuk Berbilang Tema**:
  - Suis pertukaran antara tema **Hijau Hutan Eksekutif** (`#218300`) dan **Indigo Moden** (`#4f46e5`).
  - Susun atur data padat, kemas, dan mudah dibaca berasaskan Tailwind CSS v4 serta tipografi Google Fonts (*Inter* & *JetBrains Mono*).

---

## 🛠️ Tindanan Teknologi & Arkitektur

- **Rangka Kerja (*Framework*)**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Pangkalan Data & Pengesahan**: [Firebase Firestore](https://firebase.google.com/docs/firestore) & [Firebase Auth](https://firebase.google.com/docs/auth)
- **Alat Bina (*Build Tool*)**: [Vite 8](https://vitejs.dev/) bersama `@tailwindcss/vite`
- **Gaya Visual (*Styling*)**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ikon**: [Lucide React](https://lucide.dev/) + Google Material Symbols
- **Pengurusan Keadaan & Storan**: *Client-side reactive state* diselaraskan bersama Firestore & *Web Storage* pelayar

```
wip-tracker/
├── firebase-blueprint.json     # Skema blueprint entiti Firestore
├── firestore.rules             # Peraturan keselamatan Firestore yang disahkan & dideploy
├── firebase-applet-config.json # Konfigurasi klien Firebase (ID projek, pangkalan data, kunci API)
├── index.html                  # Titik masuk HTML dengan font Inter & JetBrains Mono
├── metadata.json               # Deskriptor keupayaan aplikasi
├── package.json                # Dependensi projek dan skrip npm
├── vite.config.ts              # Konfigurasi Vite 8 dengan pemalam Tailwind v4
├── README.md                   # Dokumentasi penuh projek (Bahasa Melayu)
├── src/
│   ├── main.tsx                # Titik masuk React
│   ├── App.tsx                 # Rangka utama, penyegerakan Firebase, penukar paparan, dan modal
│   ├── firebase.ts             # Inisialisasi Firebase App, Auth, dan Firestore Client
│   ├── index.css               # Definisi global Tailwind CSS
│   ├── types/
│   │   └── index.ts            # Antaramuka TypeScript (TaskItem, SprintWeek, dsb.)
│   ├── services/
│   │   └── firestoreService.ts # Perkhidmatan CRUD & langganan masa nyata Firestore
│   ├── utils/
│   │   ├── storage.ts          # Enjin storan localStorage, data benih, dan metrik storan
│   │   └── reportFormatter.ts  # Enjin kompilasi Markdown & format Slack
│   └── components/
│       ├── Header.tsx                  # Bar navigasi atas, status log masuk Google & penyegerakan
│       ├── Sidebar.tsx                 # Bar sisi navigasi dengan status enjin storan awan/tempatan
│       ├── WeeklyDeliverablesView.tsx  # F01 & F02: Papan pemuka tugasan mingguan
│       ├── ReportGeneratorView.tsx     # F03: Penjana laporan langsung dan sejarah laporan
│       ├── WeeklySprintsArchiveView.tsx# F04: Arkib lejar sprint bersejarah & analitik
│       ├── BlockersAndRisksView.tsx    # Pusat penyelesaian insiden & metrik SLA
│       ├── Toast.tsx                   # Notifikasi maklum balas pantas
│       └── modals/
│           ├── TaskModal.tsx           # Dialog tambah / edit tugasan
│           ├── EditProfileModal.tsx    # Dialog kemaskini nama pengguna, jawatan & maklumat profil
│           ├── QuickReportModal.tsx    # Dialog laporan teks pantas 1-klik
│           ├── LogBlockerModal.tsx     # Dialog rekod halangan / risiko baharu
│           ├── ExportEscalationModal.tsx# Dialog eksport ringkasan eskalasi Markdown
│           ├── PlaybookModal.tsx       # Buku panduan SOP penyelesaian halangan
│           └── StorageModal.tsx        # Pengurus sandaran data JSON & penetapan semula
```

---

## 🚀 Panduan Memulakan Projek

### Keperluan Awal

- [Node.js](https://nodejs.org/) (versi 18 ke atas disyorkan)
- Pengurus pakej: `npm` atau `bun`
- Akaun [GitHub](https://github.com/) dan Git dipasang pada komputer

### Pemasangan & Pelaksanaan

1. **Klon repositori ini:**
   ```bash
   git clone https://github.com/amrifaizal/wip-tracker.git
   cd wip-tracker
   ```

2. **Pasang pakej dependensi:**
   ```bash
   npm install
   ```

3. **Mulakan pelayan pembangunan tempatan (*Development Server*):**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) pada pelayar web anda.

4. **Bina projek untuk fasa produksi (*Production Build*):**
   ```bash
   npm run build
   ```

5. **Jalankan semakan ralat TypeScript (*Linter*):**
   ```bash
   npm run lint
   ```

---

## 📤 Arahan Lengkap Push ke GitHub

Ikuti panduan di bawah untuk memuat naik atau mengemas kini kod sumber serta fail `README.md` ini ke GitHub:

### Situasi A: Repositori Baru (Pertama Kali Sambung ke GitHub)
Sekiranya anda baru mencipta repositori kosong di GitHub (contohnya `wip-tracker`):

```bash
# 1. Pastikan cawangan utama dinamakan 'main'
git branch -M main

# 2. Sambungkan ke repositori GitHub anda (gantikan URL dengan repositori anda)
git remote add origin https://github.com/<username>/wip-tracker.git

# 3. Hantar kod dan fail README ke GitHub
git push -u origin main
```

### Situasi B: Mengemas kini Repositori Sedia Ada (Update README & Kod Terkini)
Sekiranya repositori telah bersambung dengan GitHub dan anda ingin menolak komit terbaharu:

```bash
# 1. Semak status perubahan fail
git status

# 2. Tambah semua fail kemas kini ke staging
git add .

# 3. Buat komit dengan nota perubahan
git commit -m "docs: kemas kini README.md dengan maklumat profil pengguna dan arahan GitHub lengkap"

# 4. Hantar perubahan ke GitHub
git push origin main
```

> 💡 **Nota Pengesahan GitHub**: Sekiranya terminal meminta kata laluan semasa arahan `git push`, gunakan **GitHub Personal Access Token (PAT)** dengan skop `repo` atau gunakan sambungan kunci **SSH** (`git@github.com:<username>/wip-tracker.git`).

---

## 📋 Senarai Semak Ujian & Penilaian (Berdasarkan PRD)

| Rujukan | Senario Ujian | Status |
| :--- | :--- | :--- |
| **TC01** | Cipta tugasan dengan semua medan sah dan pastikan ia dipaparkan pada papan pemuka | ✅ Lulus |
| **TC02** | Cuba simpan tugasan tanpa Nama Tugasan atau Pemohon; sahkan ralat pengesahan dipaparkan | ✅ Lulus |
| **TC03** | Jana laporan dengan tugasan aktif; sahkan pengelompokan (Selesai, Sedang Berjalan, Terhalang) | ✅ Lulus |
| **TC04** | Klik butang "Salin ke Papan Klip" dan sahkan kandungan teks sepadan dengan pratonton modal | ✅ Lulus |
| **TC05** | Muat semula pelayar (*refresh*); sahkan storan tempatan mengekalkan semua rekod data | ✅ Lulus |
| **TC06** | Tukar minggu sprint dan sahkan tugasan diasingkan mengikut minggu masing-masing | ✅ Lulus |
| **TC07** | Log masuk akaun Google melalui Firebase Auth dan sahkan penyegerakan langsung Firestore | ✅ Lulus |
| **TC08** | Tutup tetingkap popup log masuk; sahkan tiada ralat sistem terangkat (*graceful cancellation*) | ✅ Lulus |

---

## 📄 Lesen

Projek ini dilesenkan di bawah terma Lesen Apache 2.0. Sila rujuk fail LESEN untuk maklumat lanjut.
