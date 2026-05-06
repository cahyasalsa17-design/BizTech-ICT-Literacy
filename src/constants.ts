import { ModuleContent } from './types';

export const MODULES: ModuleContent[] = [
  {
    id: 'm1',
    title: 'Transformasi Bisnis di Era Digital',
    description: 'Memahami bagaimana bisnis berubah dari tradisional ke digital dan cara beradaptasi dengan teknologi terbaru.',
    duration: '60 Menit',
    content: 'Transformasi digital bukan hanya soal punya aplikasi atau website. Ini adalah perubahan besar dalam cara sebuah bisnis bekerja untuk memberikan layanan terbaik bagi pelanggan menggunakan teknologi. Bagi siswa SMK, memahami ini sangat penting karena dunia kerja yang akan kamu masuki nanti pasti sudah serba digital (Industri 4.0).',
    subTopics: [
      {
        title: 'Dari Toko Fisik ke Layar HP',
        text: 'Dulu, kalau mau belanja kita harus datang ke toko (Brick and Mortar). Sekarang, cukup "klik" dari HP. Perubahan ini membuat bisnis harus lebih lincah (Agility). Bisnis yang sukses adalah yang bisa merespons keinginan pembeli dengan cepat menggunakan data, bukan cuma sekadar nebak-nebak.'
      },
      {
        title: 'Mengenal Model Bisnis Masa Kini',
        text: 'Ada banyak jenis bisnis digital yang harus kamu tahu: \n1. Marketplace: Tempat bertemunya penjual dan pembeli (contoh: Shopee, Tokopedia).\n2. SaaS (Software as a Service): Aplikasi yang tinggal pakai dengan sistem langganan (contoh: Canva untuk desain).\n3. On-Demand: Layanan yang dipesan saat butuh saja (contoh: Gojek atau Grab).'
      },
      {
        title: 'Kenapa Harus Digital?',
        text: 'Bisnis digital punya "kekuatan super" dibandingkan bisnis biasa. Pertama, pasarnya luas banget (bisa sampai luar negeri). Kedua, kerjanya otomatis jadi lebih hemat biaya. Ketiga, kita bisa tahu apa yang disukai pelanggan lewat data riwayat belanja mereka.'
      }
    ],
    quiz: [
      {
        question: 'Apa yang dimaksud dengan model bisnis SaaS?',
        options: ['Sistem jual beli barang fisik', 'Layanan perangkat lunak berbasis langganan melalui cloud', 'Model bisnis jasa angkutan', 'Sistem pembayaran digital'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Manakah yang merupakan pendorong utama transformasi digital?',
        options: ['Keinginan pemilik modal saja', 'Perkembangan internet dan kebutuhan efisiensi', 'Penurunan jumlah penduduk', 'Kenaikan harga barang fisik'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Apa keunggulan utama bisnis digital dibandingkan bisnis konvensional?',
        options: ['Biaya sewa toko fisik yang tinggi', 'Jangkauan pasar yang terbatas', 'Skalabilitas dan efisiensi operasional', 'Ketergantungan pada paperwork'],
        correctAnswer: 2,
        timeLimit: 20
      },
      {
        question: 'Model bisnis "Freemium" adalah...',
        options: ['Semua fitur berbayar sejak awal', 'Layanan gratis selamanya tanpa batasan', 'Gratis untuk fitur dasar, bayar untuk fitur premium', 'Iklan saja tanpa fitur produk'],
        correctAnswer: 2,
        timeLimit: 20
      },
      {
        question: 'Istilah "Disrupsi Digital" merujuk pada...',
        options: ['Gangguan sinyal internet', 'Inovasi yang menggantikan teknologi lama dan merusak pasar lama', 'Kerusakan perangkat keras komputer', 'Penurunan jumlah pengguna smartphone'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Contoh perusahaan On-Demand Services di Indonesia adalah...',
        options: ['Gojek/Grab', 'Tokopedia', 'Microsoft', 'BCA'],
        correctAnswer: 0,
        timeLimit: 15
      },
      {
        question: 'Apa peran Big Data dalam transformasi bisnis?',
        options: ['Memperberat kinerja server', 'Memberikan wawasan (insight) berdasarkan pola data besar', 'Hanya untuk menyimpan foto produk', 'Menghambat komunikasi antar karyawan'],
        correctAnswer: 1,
        timeLimit: 25
      },
      {
        question: 'Transformasi digital paling sukses berfokus pada...',
        options: ['Membeli hardware paling mahal', 'Pengalaman pelanggan (Customer Experience)', 'Mengurangi seluruh karyawan', 'Menghilangkan semua manual'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Apa yang dimaksud dengan Agility dalam bisnis digital?',
        options: ['Kemampuan untuk diam di tempat', 'Kemampuan beradaptasi dengan cepat terhadap perubahan pasar', 'Kecepatan mengetik karyawan', 'Kemampuan membayar utang'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Industri 4.0 sangat bergantung pada integrasi antara...',
        options: ['Hutan dan gedung', 'Dunia fisik dan dunia digital (Cyber-Physical)', 'Kertas dan pena', 'Toko offline dan gudang jauh'],
        correctAnswer: 1,
        timeLimit: 20
      }
    ]
  },
  {
    id: 'm2',
    title: 'Ekosistem Infrastruktur IT Bisnis',
    description: 'Mengenal "jeroan" teknologi yang membuat bisnis online tetap berjalan lancar 24 jam sehari.',
    duration: '75 Menit',
    content: 'Coba bayangkan sebuah minimarket. Ada mesin kasir, komputer di gudang, dan server pusat. Nah, gabungan dari semua perangkat keras (hardware), aplikasi (software), dan internet itulah yang disebut Infrastruktur IT. Tanpa ini, bisnis digital akan lumpuh.',
    subTopics: [
      {
        title: 'Kasir Pintar (Cloud POS)',
        text: 'Dulu kasir cuma buat hitung uang. Sekarang, mesin kasir (Point of Sale) sudah canggih karena terhubung ke internet (Cloud). Begitu ada barang laku di kasir, stok di gudang otomatis berkurang dan laporan keuangan langsung terupdate di HP pemilik toko.'
      },
      {
        title: 'Otak Bisnis: ERP dan CRM',
        text: '1. ERP (Enterprise Resource Planning): Aplikasi besar yang mengatur semuanya, dari uang, stok barang, sampai gaji karyawan agar teratur.\n2. CRM (Customer Relationship Management): Aplikasi khusus buat "ingat" pelanggan. Contoh: kirim chat promo ke pelanggan yang sudah lama nggak belanja.'
      },
      {
        title: 'Mengenal Cloud Computing',
        text: 'Cloud itu seperti menyewa server di internet. Kamu nggak perlu beli komputer besar yang mahal. Kamu cukup bayar apa yang kamu pakai (Pay-as-you-go). Ini sangat membantu pengusaha pemula biar modalnya nggak habis cuma buat beli peralatan komputer.'
      }
    ],
    quiz: [
      {
        question: 'Sistem yang digunakan untuk mengelola hubungan dan interaksi dengan pelanggan disebut...',
        options: ['ERP', 'POS', 'CRM', 'CMS'],
        correctAnswer: 2,
        timeLimit: 20
      },
      {
        question: 'Point of Sale (POS) berfungsi untuk...',
        options: ['Mendesain poster', 'Memproses transaksi penjualan', 'Mencari Lowongan Kerja', 'Mengedit video produk'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Apa kepanjangan dari ERP?',
        options: ['Enterprise Resource Planning', 'Electronic Resource Program', 'Enterprise Real Power', 'Easy Resource Process'],
        correctAnswer: 0,
        timeLimit: 15
      },
      {
        question: 'Manakah contoh layanan IaaS?',
        options: ['Microsoft Office 365', 'Amazon Web Services (AWS)', 'Google Search', 'Instagram'],
        correctAnswer: 1,
        timeLimit: 25
      },
      {
        question: 'Hardware utama yang berfungsi sebagai pusat penyimpanan data dalam jaringan adalah...',
        options: ['Monitor', 'Server', 'Keyboard', 'Printer'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Apa keuntungan utama Cloud Computing bagi UKM?',
        options: ['Tidak butuh internet sama sekali', 'Hemat biaya investasi hardware server awal', 'Data tidak bisa dihapus', 'Membuat komputer lebih berat'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'ERP mengintegrasikan modul berikut, kecuali...',
        options: ['Keuangan', 'Logistik', 'Game Online', 'Sumber Daya Manusia'],
        correctAnswer: 2,
        timeLimit: 20
      },
      {
        question: 'Software CRM membantu bisnis dalam hal...',
        options: ['Membuat website', 'Menganalisis perilaku belanja pelanggan', 'Menghitung pajak tahunan saja', 'Mengatur kecepatan internet'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Apa itu Hybrid Cloud?',
        options: ['Cloud yang berwarna abu-abu', 'Kombinasi antara private cloud dan public cloud', 'Cloud yang hanya bisa diakses via HP', 'Layanan yang lambat'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Keamanan pada infrastruktur cloud biasanya menggunakan metode...',
        options: ['Kunci fisik gudang', 'Enkripsi data', 'Menghapus data tiap jam', 'Menyembunyikan server'],
        correctAnswer: 1,
        timeLimit: 20
      }
    ]
  },
  {
    id: 'm3',
    title: 'Strategi Pemasaran Digital Modern',
    description: 'Belajar cara membuat produkmu viral dan laris manis di internet melalui SEO, Iklan, dan Media Sosial.',
    duration: '90 Menit',
    content: 'Produk sebagus apa pun kalau nggak ada yang tahu, ya nggak akan laku. Di sini kita akan belajar cara "pamer" yang cerdas di dunia digital. Kita akan bedah rahasia kenapa sebuah postingan bisa viral dan kenapa website tertentu selalu muncul di nomor satu Google.',
    subTopics: [
      {
        title: 'SEO vs SEM (Perang di Google)',
        text: '1. SEO (Search Engine Optimization): Cara "gratis" tapi sabar agar website kita disukai Google lewat konten berkualitas.\n2. SEM (Search Engine Marketing): Cara "bayar" biar website kita langsung muncul di paling atas lewat iklan (Google Ads).'
      },
      {
        title: 'Seni Menarik Hati (Content & Copywriting)',
        text: 'Gunakan teknik AIDA (Attention, Interest, Desire, Action). \n- Pancing perhatian pembeli (Attention)\n- Buat mereka tertarik (Interest)\n- Bangkitkan keinginan memiliki (Desire)\n- Ajak mereka klik tombol beli (Action)!'
      },
      {
        title: 'Membaca Data Media Sosial',
        text: 'Jangan cuma posting, tapi lihat "Insight"-nya. Di jam berapa audiensmu paling banyak buka HP? Konten apa yang paling banyak di-share? Dengan analitik, kita bisa tahu strategi mana yang berhasil dan mana yang buang-buang waktu.'
      }
    ],
    quiz: [
      {
        question: 'Teknik optimasi mesin pencari agar website muncul secara organik disebut...',
        options: ['SEM', 'SEO', 'SMM', 'Email Marketing'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Dalam formula AIDA, huruf D kepanjangan dari...',
        options: ['Data', 'Desire', 'Digital', 'Direct'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Apa perbedaan utama SEO dan SEM?',
        options: ['SEO berbayar, SEM gratis', 'SEO gratis pelan, SEM berbayar cepat', 'Tidak ada perbedaan', 'SEO untuk video, SEM untuk teks'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Apa tujuan utama dari Content Marketing?',
        options: ['Hanya untuk pamer foto', 'Membangun kepercayaan dan menarik audiens melalui konten berharga', 'Memaksa orang membeli sekarang juga', 'Mendapatkan follower palsu'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Metrik "Engagement Rate" di sosial media menghitung...',
        options: ['Jumlah follower saja', 'Total interaksi dibandingkan jumlah jangkauan/follower', 'Jumlah postingan per hari', 'Harga iklan per klik'],
        correctAnswer: 1,
        timeLimit: 25
      },
      {
        question: 'Apa itu Keyword Research?',
        options: ['Mencari kata kunci yang sering dicari audiens di mesin pencari', 'Mencari kata sandi orang lain', 'Menulis kata-kata di buku', 'Menghitung jumlah kata dalam artikel'],
        correctAnswer: 0,
        timeLimit: 20
      },
      {
        question: 'Platform iklan milik Google disebut...',
        options: ['Facebook Ads', 'Google Ads', 'Google Search Bar', 'AdBlock'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Copywriting adalah teknik menulis untuk...',
        options: ['Mengerjakan tugas sekolah', 'Mempengaruhi pembaca agar melakukan tindakan (konversi)', 'Menyalin tulisan orang lain', 'Menulis novel'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Fungsi Hashtag (#) di media sosial adalah...',
        options: ['Memperindah teks', 'Mengkategorikan konten agar mudah dicari', 'Meningkatkan batasan kata', 'Hanya untuk gaya'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Influencer Marketing bekerja dengan cara...',
        options: ['Beriklan di TV', 'Bekerjasama dengan orang yang punya pengaruh luas di internet', 'Menaruh banner di jalan', 'Telepon pelanggan satu-satu'],
        correctAnswer: 1,
        timeLimit: 20
      }
    ]
  },
  {
    id: 'm4',
    title: 'Fintech dan Keamanan Transaksi',
    description: 'Eksplorasi mendalam mengenai QRIS, Dompet Digital, dan cara aman bertransaksi di internet.',
    duration: '60 Menit',
    content: 'Pernah bayar pakai scan QR? Itu adalah bagian dari Fintech (Financial Technology). Di modul ini, kita akan belajar bagaimana uang digital dikelola dan cara memastikan setiap rupiah yang kamu pindahkan lewat aplikasi itu aman dari pencurian siber.',
    subTopics: [
      {
        title: 'QRIS: Satu untuk Semua',
        text: 'QRIS (Quick Response Code Indonesian Standard) adalah standar sakti dari Bank Indonesia. Cukup satu kode QR di meja kasir, pelanggan bisa bayar pakai aplikasi apa saja (Gopay, OVO, ShopeePay, atau Bank). Ini memudahkan pedagang memantau uang masuk tanpa harus punya banyak mesin.'
      },
      {
        title: 'Gerbang Pembayaran (Payment Gateway)',
        text: 'Payment Gateway adalah perantara antara tokomu dan bank. Tugasnya melakukan pengecekan saldo pembeli dan memindahkan uangnya ke rekeningmu secara otomatis. Contohnya seperti Midtrans atau Xendit yang sering dipakai di toko online Indonesia.'
      },
      {
        title: 'Rahasia Keamanan: OTP dan Enkripsi',
        text: 'Jangan pernah kasih kode OTP (One-Time Password) ke siapa pun! OTP adalah kunci sementara untuk memastikan itu benar-benar kamu. Selain itu, website yang aman harus pakai protokol HTTPS (lambang gembok) agar data kartu atau saldomu nggak bisa diintip orang lain.'
      }
    ],
    quiz: [
      {
        question: 'Satu standar kode QR nasional yang dikembangkan oleh Bank Indonesia disebut...',
        options: ['E-Wallet', 'QRIS', 'Payment Gateway', 'Virtual Account'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Kepanjangan dari OTP adalah...',
        options: ['Only Time Pass', 'One Time Password', 'Over The Phone', 'One Task Policy'],
        correctAnswer: 1,
        timeLimit: 10
      },
      {
        question: 'Payment Gateway bertindak sebagai perantara antara...',
        options: ['Pembeli dan Penjual di aplikasi chatting', 'Website e-commerce dan institusi keuangan/bank', 'Router dan Komputer', 'Google dan Facebook'],
        correctAnswer: 1,
        timeLimit: 25
      },
      {
        question: 'Indikator keamanan sebuah website transaksi biasanya ditandai dengan...',
        options: ['Logo warna-warni', 'Warna background gelap', 'Ikon gembok dan protokol HTTPS di URL', 'Tulisan "Sangat Aman"'],
        correctAnswer: 2,
        timeLimit: 20
      },
      {
        question: 'Jenis E-wallet yang populer di Indonesia adalah...',
        options: ['Lazada', 'Dana/OVO/GoPay', 'Netflix', 'Spotify'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Apa itu 2-Factor Authentication (2FA)?',
        options: ['Menulis password dua kali', 'Metode keamanan menggunakan dua lapis identifikasi', 'Menggunakan dua password berbeda', 'Login dengan dua orang sekaligus'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'QRIS mendukung model pembayaran MPM, apa itu?',
        options: ['Merchant Presented Mode', 'Mobile Payment Market', 'Money Pay Machine', 'Manual Pay Mode'],
        correctAnswer: 0,
        timeLimit: 25
      },
      {
        question: 'Kartu Kredit digital biasanya terlindungi oleh fitur...',
        options: ['Foto profil', 'PIN dan CVV', 'Tanda tangan kertas', 'Stiker'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Fintech adalah singkatan dari...',
        options: ['Final Technology', 'Financial Technology', 'Finished Technician', 'Firm Technical'],
        correctAnswer: 1,
        timeLimit: 10
      },
      {
        question: 'Apa risiko utama dari menyimpan saldo besar di e-wallet?',
        options: ['Uang bisa dimakan rayap', 'Risiko keamanan jika akun/perangkat diretas (phishing)', 'Saldo bisa basi', 'Uang tidak bisa diambil selamanya'],
        correctAnswer: 1,
        timeLimit: 25
      }
    ]
  },
  {
    id: 'm5',
    title: 'Etika, Hukum, dan Keamanan Data',
    description: 'Pahami aturan main di internet lewat UU ITE dan cara melindungi data pribadimu agar tidak bocor.',
    duration: '75 Menit',
    content: 'Internet bukan "hutan rimba" tanpa aturan. Ada hukum yang mengatur apa yang boleh dan tidak boleh kita lakukan. Sebagai siswa SMK, kamu harus tahu batasan agar tidak terjerat masalah hukum di masa depan saat mengelola bisnis digital.',
    subTopics: [
      {
        title: 'Hukum Internet: UU ITE',
        text: 'UU ITE (Informasi dan Transaksi Elektronik) adalah polisi di dunia digital. Mengatur tentang transaksi elektronik, tanda tangan digital, sampai larangan menyebarkan hoaks atau hinaan di media sosial yang bisa merugikan bisnis orang lain.'
      },
      {
        title: 'Waspada Kejahatan Siber (Phishing)',
        text: 'Hati-hati dengan link palsu! Phishing adalah teknik penipuan di mana penjahat pura-pura jadi admin bank atau toko untuk mencuri password-mu. Selalu cek alamat website (URL) sebelum memasukkan data penting.'
      },
      {
        title: 'Sopan Santun Digital (Netiket)',
        text: 'Netiket adalah etika saat online. Gunakan bahasa yang sopan saat membalas komplain pelanggan. Ingat, jejak digital itu abadi dan bisa memengaruhi nama baik bisnismu di masa depan.'
      }
    ],
    quiz: [
      {
        question: 'Tindakan memanipulasi psikologis orang agar memberikan informasi rahasia disebut...',
        options: ['Phishing', 'Social Engineering', 'Hacking', 'Spamming'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Regulasi utama yang mengatur transaksi digital di Indonesia adalah...',
        options: ['Undang-Undang Ketenagakerjaan', 'Undang-Undang ITE', 'Undang-Undang Pendidikan', 'Undang-Undang Lalu Lintas'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Apa itu Phishing?',
        options: ['Memancing ikan di laut', 'Upaya mendapatkan informasi rahasia melalui link/website palsu', 'Mencuri laptop orang lain', 'Mengirim email massal promosi'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Menggunakan foto produk orang lain tanpa izin dalam berbisnis adalah pelanggaran...',
        options: ['Lalu lintas', 'Etika dan Hak Cipta', 'Tata boga', 'Kearsipan'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Data Pribadi yang harus dilindungi dalam bisnis adalah berikut, kecuali...',
        options: ['NIK/KTP', 'Nomor HP Pelanggan', 'Alamat Kantor Pusat Perusahaan', 'Riwayat Transaksi'],
        correctAnswer: 2,
        timeLimit: 25
      },
      {
        question: 'Ransomware adalah jenis malware yang...',
        options: ['Menghapus virus di komputer', 'Menyandera (mengenkripsi) data dan meminta tebusan', 'Mempercepat koneksi internet', 'Memberikan hadiah pulsa'],
        correctAnswer: 1,
        timeLimit: 25
      },
      {
        question: 'Netiket (Netiquette) adalah istilah untuk...',
        options: ['Jaringan internet cepat', 'Etika atau tata krama dalam berkomunikasi di internet', 'Sistem operasi baru', 'Toko hobi di internet'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Jika terjadi kebocoran data pelanggan, kewajiban perusahaan adalah...',
        options: ['Diam saja agar tidak panik', 'Memberitahu otoritas dan pelanggan serta memperbaiki lubang keamanan', 'Menutup perusahaan seketika', 'Menyalahkan pelanggan'],
        correctAnswer: 1,
        timeLimit: 25
      },
       {
        question: 'Apa langkah pencegahan Social Engineering?',
        options: ['Memberikan password ke orang yang mengaku petugas bank', 'Jangan mudah percaya pada verifikasi lewat telepon/chat tidak resmi', 'Selalu klik link diskon di email tidak dikenal', 'Menyimpan password di status WA'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Hukuman bagi penyebar berita bohong (Hoaks) dalam bisnis digital diatur dalam...',
        options: ['UU Pendidikan', 'UU ITE', 'UU Perbankan', 'UU Kelautan'],
        correctAnswer: 1,
        timeLimit: 15
      }
    ]
  },
  {
    id: 'm6',
    title: 'Analitik Data dan Business Intelligence',
    description: 'Cara "membaca masa depan" bisnis lewat data dan angka agar keputusanmu nggak asal tebak.',
    duration: '80 Menit',
    content: 'Data adalah "emas baru" di era digital. Tapi data cuma gundukan angka kalau nggak diolah. Business Intelligence (BI) adalah cara kita mengolah data masa lalu untuk dijadikan dasar keputusan di masa depan. Misalnya: produk apa yang harus ditambah stoknya berdasarkan data bulan lalu?',
    subTopics: [
      {
        title: 'Mengenal Big Data (5V)',
        text: 'Big Data bukan cuma data yang banyak, tapi juga cepat dan beragam (5V: Volume, Velocity, Variety, Veracity, Value). Bayangkan jutaan komentar di medsos per detik, itu adalah data besar yang bisa diolah jadi info tren bisnis.'
      },
      {
        title: 'Visualisasi Data (Dashboard)',
        text: 'Melihat angka ribuan baris di Excel itu pusing. Makanya kita butuh Dashboard! Dengan grafik batang, lingkaran, dan warna-warni, bos perusahaan bisa langsung tahu performa jualan dalam sekali lihat pakai tools seperti Google Looker Studio.'
      },
      {
        title: 'Keputusan Berbasis Data',
        text: 'Pebisnis sukses nggak pakai "feeling", mereka pakai data (Data-Driven). Kalau data menunjukkan pelanggan paling banyak belanja di jam 8 malam, maka itulah waktu terbaik untuk pasang iklan atau live streaming jualan.'
      }
    ],
    quiz: [
      {
        question: 'Apa yang dimaksud dengan "Velocity" dalam Big Data?',
        options: ['Kecepatan pertumbuhan dan pemrosesan data', 'Jumlah total data yang disimpan', 'Tingkat akurasi data', 'Berbagai jenis format data'],
        correctAnswer: 0,
        timeLimit: 20
      },
      {
        question: 'Tool yang populer digunakan untuk visualisasi data (Dashboard) adalah...',
        options: ['Adobe Photoshop', 'Google Data Studio / Looker', 'Microsoft Word', 'WhatsApp'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Business Intelligence (BI) berfungsi untuk...',
        options: ['Membuat poster iklan', 'Menganalisis data historis untuk mendukung keputusan bisnis', 'Memperbaiki kabel jaringan', 'Menghapus data penting'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Keputusan bisnis yang tidak didasarkan pada perasaan, melainkan pada fakta data disebut...',
        options: ['Feeling-Driven', 'Data-Driven Decision Making', 'Random Choice', 'Lucky Guess'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Manakah dari berikut yang termasuk "Variety" dalam Big Data?',
        options: ['Data sensor, teks, video, dan suara', 'Kapasitas hardisk 1 Terabyte', 'Kecepatan internet 100 Mbps', 'Kejujuran informasi'],
        correctAnswer: 0,
        timeLimit: 25
      },
      {
        question: 'Tujuan utama visualisasi data adalah...',
        options: ['Agar terlihat canggih saja', 'Memudahkan manusia memahami pola dalam data besar', 'Menghabiskan tinta printer', 'Menyembunyikan fakta'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Data "Real-time" berarti data tersebut...',
        options: ['Data dari 10 tahun lalu', 'Data yang tersedia saat kejadian itu berlangsung', 'Data hasil imajinasi', 'Data yang dibeli dari pasar'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Apa fungsi "Predictive Analytics"?',
        options: ['Menghapus data masa lalu', 'Memperkirakan kemungkinan hasil di masa depan berdasarkan data historis', 'Melaporkan kejadian kemarin', 'Mencatat nama karyawan'],
        correctAnswer: 1,
        timeLimit: 25
      },
      {
        question: 'Dalam BI, istilah "Churn Rate" merujuk pada...',
        options: ['Kecepatan mesin', 'Tingkat kehilangan pelanggan atau pelanggan yang berhenti berlangganan', 'Jumlah stok di gudang', 'Harga barang per kilo'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Data yang tidak terstruktur contohnya adalah...',
        options: ['Tabel Excel', 'Database Bank', 'Postingan komentar di media sosial', 'Formulir pendaftaran'],
        correctAnswer: 2,
        timeLimit: 20
      }
    ]
  },
  {
    id: 'm7',
    title: 'Strategi E-commerce dan Marketplace',
    description: 'Membangun kerajaan bisnis online dengan optimasi toko digital dan manajemen pengiriman barang.',
    duration: '70 Menit',
    content: 'E-commerce bukan sekadar memindahkan barang dari toko ke layar HP. Ini tentang bagaimana memenangkan persaingan di tengah ribuan pelapak lainnya. Di sini kita belajar rahasia jualan laris di marketplace!',
    subTopics: [
      {
        title: 'Toko Menarik, Orderan Melirik',
        text: 'Gunakan foto produk yang estetik dan deskripsi yang jelas. Terapkan SEO Marketplace dengan riset kata kunci yang sering diketik pembeli. Jangan lupa pakai fitur "Flash Sale" atau diskon voucher untuk menarik pembeli baru.'
      },
      {
        title: 'Alur Pengiriman (Logistik)',
        text: 'Memahami sistem "Resi Otomatis" sangat penting biar kamu nggak repot tulis alamat manual. Kita juga akan bahas Dropshipping (jualan tanpa stok) dan Warehouse (gudang terintegrasi) untuk kamu yang mau skala bisnis besar.'
      },
      {
        title: 'Bintang 5 adalah Kunci',
        text: 'Rating dan ulasan adalah nyawa tokomu. Pelajari cara membalas komplain dengan sabar (Service Excellence) agar pembeli yang kecewa bisa jadi pelanggan setia. Ingat, satu ulasan buruk bisa mengusir calon pembeli lainnya.'
      }
    ],
    quiz: [
      {
        question: 'Istilah "Dropshipping" berarti...',
        options: ['Menjatuhkan kapal ke laut', 'Menjual barang tanpa stok fisik, pengiriman dilakukan oleh supplier', 'Mengirim barang lewat udara', 'Membeli barang dalam jumlah besar'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Apa fungsi utama deskripsi produk yang baik di Marketplace?',
        options: ['Memenuhi halaman saja', 'Meyakinkan pembeli dan membantu pencarian (SEO)', 'Menceritakan sejarah hidup penjual', 'Hanya formalitas'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Fungsi "Rating Bintang 5" bagi sebuah toko online adalah...',
        options: ['Mendapatkan hadiah dari pemerintah', 'Membangun kepercayaan (trust) calon pembeli baru', 'Mempermudah login aplikasi', 'Mengurangi biaya pajak'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Layanan "COD" dalam e-commerce memungkinkan pelanggan...',
        options: ['Membayar di awal lewat bank', 'Hanya melihat barang tanpa bayar', 'Membayar tunai saat barang diterima', 'Mendapatkan barang gratis'],
        correctAnswer: 2,
        timeLimit: 10
      },
      {
        question: 'Sistem "Flash Sale" biasanya digunakan untuk...',
        options: ['Menghabiskan waktu karyawan', 'Meningkatkan penjualan produk tertentu secara drastis dalam waktu singkat', 'Menjual barang rusak', 'Menaikkan harga barang'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Manakah yang termasuk strategi promosi di Marketplace?',
        options: ['Voucher Toko, Gratis Ongkir, dan Bundling', 'Hanya memasang satu foto', 'Menutup toko di hari libur', 'Menghapus ulasan buruk'],
        correctAnswer: 0,
        timeLimit: 20
      },
      {
        question: 'Apa itu "Resi Otomatis"?',
        options: ['Kode pengiriman yang dihasilkan sistem secara otomatis saat order masuk', 'Sistem pengiriman menggunakan robot', 'Surat cinta dari pembeli', 'Alat pencetak struk'],
        correctAnswer: 0,
        timeLimit: 15
      },
      {
        question: 'Istilah "Retention Rate" dalam belanja online berarti...',
        options: ['Jumlah barang yang pecah', 'Tingkat pembeli yang datang kembali untuk belanja lagi', 'Kecepatan pengiriman kurir', 'Berat barang dalam gram'],
        correctAnswer: 1,
        timeLimit: 25
      },
      {
        question: 'Fungsi fitur "Chat/Diskusi" adalah...',
        options: ['Hanya untuk menyapa', 'Menjawab keraguan pelanggan sebelum membeli', 'Untuk berjualan pulsa', 'Sarana bermain game'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Tujuan utama dekorasi toko di marketplace adalah...',
        options: ['Agar penjual tidak bosan', 'Memberikan kesan profesional dan branding yang kuat', 'Menghilangkan stok lama', 'Mendapatkan follower palsu'],
        correctAnswer: 1,
        timeLimit: 20
      }
    ]
  },
  {
    id: 'm8',
    title: 'Keamanan Siber Tingkat Lanjut',
    description: 'Lindungi aset bisnismu dari peretasan, pencurian saldo, dan serangan virus jahat.',
    duration: '90 Menit',
    content: 'Semakin besar bisnismu, semakin besar juga incaran penjahat siber. Keamanan siber bukan cuma urusan orang IT, tapi tanggung jawab semua orang di perusahaan. Satu klik sembarangan bisa bikin saldo perusahaan ludes!',
    subTopics: [
      {
        title: 'Manajemen Password Perusahaan',
        text: 'Jangan pakai password yang sama untuk semua akun! Gunakan Password Manager dan lakukan penggantian secara berkala. Ingat: Password "123456" atau "tanggal lahir" itu gampang banget ditebak peretas.'
      },
      {
        title: 'Apa itu Serangan DDoS?',
        text: 'DDoS adalah saat ribuan komputer palsu menyerang websitemu secara bersamaan sampai websitemu "pingsan" (down). Pelajari cara mitigasi menggunakan layanan seperti Cloudflare agar toko onlinemu tetap aktif melayani pembeli.'
      },
      {
        title: 'Jaringan Aman dan VPN',
        text: 'Kalau kamu kerja pakai WiFi publik (seperti di kafe), sangat disarankan pakai VPN (Virtual Private Network). VPN akan "membungkus" datamu agar nggak disadap oleh orang jahat yang ada di jaringan WiFi yang sama.'
      }
    ],
    quiz: [
      {
        question: 'Apa tujuan utama dari serangan DDoS?',
        options: ['Mencuri uang langsung dari bank', 'Melumpuhkan layanan/website dengan mengirimkan trafik palsu yang massif', 'Mengambil alih akun admin', 'Mengirim email spam ke pelanggan'],
        correctAnswer: 1,
        timeLimit: 25
      },
      {
        question: 'Layanan VPN (Virtual Private Network) berfungsi untuk...',
        options: ['Mempercepat download video', 'Mengamankan dan mengenkripsi koneksi internet', 'Menghapus virus secara otomatis', 'Membuat website secara gratis'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Metode otentikasi yang memerlukan dua bukti identitas (misalnya password dan OTP) disebut...',
        options: ['2-Factor Authentication (2FA)', 'Dual Password Control', 'Double Check System', 'Master Account'],
        correctAnswer: 0,
        timeLimit: 15
      },
      {
        question: 'Tindakan mencuri informasi penting melalui email yang terlihat resmi disebut...',
        options: ['Fishing', 'Phishing', 'Pusshing', 'Mapping'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Mengapa password "123456" sangat tidak disarankan?',
        options: ['Karena terlalu panjang', 'Karena terlalu mudah ditebak oleh peretas (Brute Force)', 'Karena dilarang oleh pemerintah', 'Karena susah diingat'],
        correctAnswer: 1,
        timeLimit: 10
      },
      {
        question: 'Malware yang mengunci data perusahaan dan meminta bayaran adalah...',
        options: ['Adware', 'Ransomware', 'Spyware', 'Bloatware'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Apa itu "Patching" pada software bisnis?',
        options: ['Menghapus seluruh program', 'Melakukan pembaruan untuk memperbaiki celah keamanan (Vulnerability)', 'Memberikan label harga', 'Mengubah logo aplikasi'],
        correctAnswer: 1,
        timeLimit: 25
      },
      {
        question: 'Siapa yang paling bertanggung jawab menjaga keamanan data di perusahaan?',
        options: ['Hanya Staff IT', 'Hanya Direktur Utama', 'Seluruh karyawan dan manajemen', 'Hanya satpam kantor'],
        correctAnswer: 2,
        timeLimit: 15
      },
      {
        question: 'Apa itu "Social Engineering" dalam siber?',
        options: ['Seni membangun jaringan pertemanan', 'Manipulasi psikologis untuk mendapatkan informasi rahasia', 'Teknik mengedit foto profil', 'Cara beriklan di sosial media'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Mengapa dilarang sembarang klik link di aplikasi pesan instan?',
        options: ['Menghabiskan kuota internet', 'Bisa mengarahkan ke website jebakan (malicious site)', 'Bisa membuat HP mati lampu', 'Hanya karena tidak sopan'],
        correctAnswer: 1,
        timeLimit: 20
      }
    ]
  },
  {
    id: 'm9',
    title: 'Artificial Intelligence (AI) dalam Bisnis',
    description: 'Manfaatkan kecerdasan buatan untuk bantu kerja jadi lebih cepat dan otomatis.',
    duration: '85 Menit',
    content: 'AI bukan lagi masa depan, AI adalah alat kerja hari ini. Dari robot chat yang balas pesan pelanggan 24 jam sampai sistem yang tahu apa yang ingin kamu beli sebelum kamu mengucapkannya. AI bikin kerja jadi lebih cerdas, bukan lebih keras.',
    subTopics: [
      {
        title: 'Chatbot: Karyawan Tanpa Lelah',
        text: 'Dengan AI, kita bisa membuat Chatbot yang melayani ribuan pertanyaan pelanggan secara bersamaan dengan jawaban instan. Ini sangat menghemat biaya gaji karyawan customer service.'
      },
      {
        title: 'Pesan Spesial Buatmu (Personalisasi)',
        text: 'Pernah merasa aplikasi belanja tahu apa yang kamu mau? Itu adalah sistem rekomendasi AI. AI mempelajari apa yang kamu klik dan beli, lalu menampilkan produk serupa agar kamu makin tertarik belanja.'
      },
      {
        title: 'Kerja Otomatis dengan AI',
        text: 'Gunakan AI untuk tugas membosankan seperti input data ribuan nota atau membuat laporan jualan bulanan. Kamu jadi punya lebih banyak waktu untuk memikirkan ide-ide besar pengembangan bisnis.'
      }
    ],
    quiz: [
      {
        question: 'Teknologi AI yang memungkinkan komputer memahami bahasa manusia disebut...',
        options: ['CNN', 'NLP (Natural Language Processing)', 'SQL', 'HTML'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Manakah contoh penerapan AI dalam bisnis sehari-hari?',
        options: ['Chatbot di website belanja', 'Menulis dengan pena', 'Menghitung belanjaan manual', 'Mengirim surat fisik'],
        correctAnswer: 0,
        timeLimit: 15
      },
      {
        question: 'Keuntungan utama menggunakan Chatbot adalah...',
        options: ['Harganya murah sekali', 'Bisa melayani pelanggan 24 jam nonstop tanpa lelah', 'Bisa diajak curhat masalah pribadi', 'Selalu memberikan diskon'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'AI bekerja berdasarkan...',
        options: ['Keberuntungan semata', 'Algoritma yang dilatih menggunakan data (Machine Learning)', 'Instruksi gaib', 'Hanya mengikuti perintah keyboard'],
        correctAnswer: 1,
        timeLimit: 25
      },
      {
        question: 'Apa itu "Recommendation Engine"?',
        options: ['Mesin untuk mencetak barang', 'Sistem AI yang memberikan saran produk sesuai minat pengguna', 'Alat untuk memindahkan barang di gudang', 'Sistem pengingat gajian'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'AI dapat membantu divisi SDM (HR) dalam hal...',
        options: ['Menyaring ribuan CV pelamar secara otomatis', 'Memaksa karyawan bekerja lembur', 'Menghapus data karyawan buruk', 'Mengatur suhu ruangan'],
        correctAnswer: 0,
        timeLimit: 20
      },
      {
        question: 'Salah satu risiko penggunaan AI dalam bisnis adalah...',
        options: ['AI menjadi bos perusahaan', 'Bias pada data yang bisa menyebabkan keputusan tidak adil', 'AI minta kenaikan gaji', 'HP menjadi cepat panas'],
        correctAnswer: 1,
        timeLimit: 25
      },
      {
        question: 'Generative AI (seperti ChatGPT) bermanfaat untuk...',
        options: ['Membayar tagihan listrik', 'Membantu membuat draf konten, ide bisnis, dan kode program', 'Mencuci piring otomatis', 'Mengendarai mobil fisik'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Otomatisasi bisnis berarti...',
        options: ['Mengganti seluruh manusia dengan robot', 'Memindahkan tugas repetitif ke sistem komputer agar efisien', 'Hanya membeli komputer baru', 'Berhenti produksi barang'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Dalam pemasaran, AI membantu menentukan...',
        options: ['Nama bayi pemilik perusahaan', 'Audiens yang paling tepat untuk melihat iklan kita', 'Berapa jumlah lampu di toko', 'Waktu istirahat karyawan'],
        correctAnswer: 1,
        timeLimit: 15
      }
    ]
  },
  {
    id: 'm10',
    title: 'Kewirausahaan Digital dan Startup',
    description: 'Langkah awal membangun perusahaan teknologi sendiri (Startup) dari nol sampai besar.',
    duration: '100 Menit',
    content: 'Siapa pun bisa jadi pengusaha di era digital! Tapi membangun bisnis yang awet butuh lebih dari sekadar ide keren. Kamu butuh eksekusi dan pembuktian bahwa ide tersebut benar-benar dibutuhkan orang banyak.',
    subTopics: [
      {
        title: 'Membangun MVP (Versi Awal)',
        text: 'MVP (Minimum Viable Product) adalah versi awal produkmu yang paling sederhana tapi sudah bisa dipakai. Jangan tunggu sempurna, luncurkan saja dulu untuk lihat apakah orang benar-benar mau beli atau pakai jasamu.'
      },
      {
        title: 'Business Model Canvas (BMC)',
        text: 'BMC adalah peta satu halaman untuk merancang bisnismu. Ada 9 kotak yang harus kamu isi, mulai dari siapa pelangganmu, gimana cara dapat untung, sampai apa yang bikin produkmu beda dari yang lain.'
      },
      {
        title: 'Menjadi "Unicorn" (Scaling Up)',
        text: 'Kalau bisnismu sudah mulai laku, saatnya membesarkan (scaling). Pelajari cara membesarkan bisnis dari 10 pengguna jadi 1 juta pengguna. Di tahap ini, kamu mungkin butuh investor untuk membantu modal pengembangan.'
      }
    ],
    quiz: [
      {
        question: 'MVP dalam dunia Startup adalah singkatan dari...',
        options: ['Most Valuable Player', 'Minimum Viable Product', 'Master Victory Program', 'Major Value Process'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Apa tujuan utama membuat MVP?',
        options: ['Mendapatkan keuntungan maksimal sejak hari pertama', 'Menguji ide bisnis dengan biaya minimal dan mendapatkan feedback', 'Membayar mahal desainer profesional', 'Menyombongkan diri ke saingan'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Business Model Canvas (BMC) terdiri dari berapa elemen utama?',
        options: ['12 Elemen', '9 Elemen', '5 Elemen', '3 Elemen'],
        correctAnswer: 1,
        timeLimit: 15
      },
      {
        question: 'Presentasi singkat dan padat untuk menarik minat investor disebut...',
        options: ['Pitching', 'Teaching', 'Chatting', 'Publishing'],
        correctAnswer: 0,
        timeLimit: 15
      },
      {
        question: 'Istilah "Unicorn" dalam dunia startup merujuk pada...',
        options: ['Startup yang sudah tutup', 'Startup dengan valuasi di atas 1 Miliar Dollar (sekitar 15 Triliun Rupiah)', 'Startup yang hanya punya satu karyawan', 'Startup yang menjual mainan kuda'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Kondisi di mana produk sudah sesuai dengan kebutuhan pasar disebut...',
        options: ['Market Lost', 'Product-Market Fit', 'Business Over', 'Company Growth'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Bootstraping dalam startup berarti...',
        options: ['Mendapatkan dana besar dari bank', 'Membangun bisnis menggunakan modal pribadi/internal tanpa investor luar', 'Membeli banyak sepatu baru', 'Menyerahkan perusahaan ke orang lain'],
        correctAnswer: 1,
        timeLimit: 25
      },
      {
        question: 'Mengapa startup seringkali gagal di tahun pertama?',
        options: ['Karena terlalu banyak karyawan', 'Karena membuat produk yang tidak dibutuhkan oleh pasar', 'Karena nama perusahaannya kurang keren', 'Karena logonya tidak berwarna'],
        correctAnswer: 1,
        timeLimit: 20
      },
      {
        question: 'Metode "Lean Startup" menekankan pada proses...',
        options: ['Build - Measure - Learn', 'Wait - See - Do', 'Plan - Design - Build', 'Think - Dream - Shop'],
        correctAnswer: 0,
        timeLimit: 25
      },
      {
        question: 'Apa peran "Venture Capital" (VC) bagi startup?',
        options: ['Hanya sebagai kompetitor', 'Perusahaan yang memberikan pendanaan modal dan bimbingan bagi startup potensial', 'Institusi pemerintah yang memungut pajak', 'Komunitas hacker'],
        correctAnswer: 1,
        timeLimit: 20
      }
    ]
  }
];

export const GLOSSARY = [
  { term: 'AIDA', definition: 'Model pemasaran yang memandu calon pembeli melalui tahapan Attention (Perhatian), Interest (Tertarik), Desire (Keinginan), dan Action (Tindakan).' },
  { term: 'Agility', definition: 'Kelincahan atau kemampuan sebuah bisnis untuk beradaptasi dengan cepat terhadap perubahan pasar dan teknologi.' },
  { term: 'B2B (Business to Business)', definition: 'Model bisnis di mana transaksi terjadi antar sesama perusahaan atau pelaku bisnis.' },
  { term: 'B2C (Business to Consumer)', definition: 'Model bisnis di mana perusahaan menjual langsung produk atau jasanya kepada konsumen akhir.' },
  { term: 'Big Data', definition: 'Kumpulan data dalam jumlah sangat besar, beragam, dan diproses dengan kecepatan tinggi (konsep 5V).' },
  { term: 'Cloud Computing', definition: 'Layanan penyewaan server, database, dan jaringan melalui internet sehingga bisnis tidak perlu membeli hardware fisik sendiri.' },
  { term: 'CRM (Customer Relationship Management)', definition: 'Sistem aplikasi untuk mengelola hubungan dengan pelanggan demi menjaga loyalitas mereka.' },
  { term: 'DDoS (Distributed Denial of Service)', definition: 'Serangan siber yang membanjiri website dengan trafik palsu agar website tersebut lumpuh atau tidak bisa diakses.' },
  { term: 'Dropshipping', definition: 'Model jualan tanpa stok barang, di mana penjual hanya meneruskan pesanan ke supplier untuk dikirim langsung ke pembeli.' },
  { term: 'ERP (Enterprise Resource Planning)', definition: 'Aplikasi terintegrasi untuk mengelola seluruh aspek operasional bisnis seperti keuangan, stok, dan SDM.' },
  { term: 'Fintech (Financial Technology)', definition: 'Penggunaan teknologi untuk memberikan layanan keuangan yang lebih praktis, seperti dompet digital dan pinjaman online.' },
  { term: 'HTTPS', definition: 'Protokol internet yang aman untuk mengirim data, ditandai dengan ikon gembok pada alamat website.' },
  { term: 'Insight', definition: 'Data atau informasi mendalam mengenai perilaku audiens yang bisa digunakan untuk menyusun strategi bisnis.' },
  { term: 'Marketplace', definition: 'Pasar digital tempat berkumpulnya banyak penjual untuk menjangkau pembeli (Contoh: Shopee, Tokopedia).' },
  { term: 'MVP (Minimum Viable Product)', definition: 'Versi paling sederhana dari sebuah produk yang sudah bisa diluncurkan untuk mendapatkan masukan dari pengguna.' },
  { term: 'Netiket', definition: 'Etika atau tata krama dalam berkomunikasi dan berinteraksi di dunia digital.' },
  { term: 'OTP (One-Time Password)', definition: 'Kode rahasia sementara yang dikirimkan untuk memverifikasi bahwa pengakses adalah pemilik akun yang sah.' },
  { term: 'Payment Gateway', definition: 'Layanan perantara yang memproses pembayaran digital dari pembeli ke rekening penjual secara aman.' },
  { term: 'Phishing', definition: 'Teknik penipuan untuk mencuri data pribadi (seperti password) lewat website atau link palsu yang terlihat resmi.' },
  { term: 'QRIS', definition: 'Standar kode QR nasional dari Bank Indonesia untuk menyatukan berbagai metode pembayaran digital.' },
  { term: 'SEO (Search Engine Optimization)', definition: 'Teknik optimasi agar website muncul di peringkat atas hasil pencarian Google secara gratis (organik).' },
  { term: 'SEM (Search Engine Marketing)', definition: 'Strategi pemasaran berbayar (iklan) agar website muncul di posisi teratas mesin pencari.' },
  { term: 'SaaS (Software as a Service)', definition: 'Aplikasi berbasis cloud yang bisa langsung dipakai pelanggan melalui sistem langganan (Contoh: Canva).' },
  { term: 'Scaling Up', definition: 'Tahapan dalam bisnis atau startup untuk memperbesar skala operasional dan jumlah pengguna secara signifikan.' },
  { term: 'VPN (Virtual Private Network)', definition: 'Layanan yang mengamankan koneksi internet dengan mengenkripsi data agar tidak bisa disadap pihak lain.' }
];
