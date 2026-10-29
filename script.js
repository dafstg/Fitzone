/* ==========================================================
   SCRIPT WEBSITE FITZONE
   Berisi 12 interaksi:
   1.  Menu mobile
   2.  Bar progres scroll + tombol ke atas
   4.  Menghitung naik angka statistik
   5.  Animasi muncul saat scroll
   6.  Filter jadwal per hari
   7.  Filter program per kategori
   8.  Modal detail program
   9.  Ganti harga bulanan/tahunan
   10. Kalkulator BMI
   11. Validasi form pendaftaran
   12. Accordion FAQ
   13. Notifikasi
   ========================================================== */

/* ---------- Fungsi pembantu ---------- */

// Mengubah angka jadi format ribuan: 350000 menjadi 350.000
function formatRupiah(angka) {
  var teks = String(angka);
  var hasil = "";
  var jumlah = 0;

  for (var i = teks.length - 1; i >= 0; i--) {
    jumlah++;
    hasil = teks[i] + hasil;
    if (jumlah % 3 === 0 && i > 0) {
      hasil = "." + hasil;
    }
  }

  return hasil;
}

// Menampilkan notifikasi sebentar di bawah layar
function tampilNotifikasi(pesan) {
  var kotak = document.getElementById('notifikasi');
  kotak.textContent = pesan;
  kotak.classList.add('tampil');

  clearTimeout(window.notifikasiTimer);
  window.notifikasiTimer = setTimeout(function () {
    kotak.classList.remove('tampil');
  }, 2500);
}


/* ==========================================================
   1. MENU MOBILE
   ========================================================== */
function menuMobile() {
  var tombol = document.getElementById('tombolMenu');
  var menu = document.getElementById('menuMobile');

  tombol.addEventListener('click', function () {
    var sedangBuka = menu.classList.contains('buka');

    if (sedangBuka) {
      menu.classList.remove('buka');
      tombol.classList.remove('menu-terbuka');
      tombol.setAttribute('aria-expanded', 'false');
    } else {
      menu.classList.add('buka');
      tombol.classList.add('menu-terbuka');
      tombol.setAttribute('aria-expanded', 'true');
    }
  });

  // Tutup menu kalau salah satu link di diklik
  var daftarLink = menu.querySelectorAll('a');
  for (var i = 0; i < daftarLink.length; i++) {
    daftarLink[i].addEventListener('click', function () {
      menu.classList.remove('buka');
      tombol.classList.remove('menu-terbuka');
    });
  }
}


/* ==========================================================
   2. GANTI MODE TERANG / GELAP
   ========================================================== */
function gantiTema() {
  var tombol = document.getElementById('tombolTema');

  tombol.addEventListener('click', function () {
    var halaman = document.documentElement;
    var sedangGelap = halaman.classList.contains('mode-gelap');

    if (sedangGelap) {
      // Ubah ke mode terang
      halaman.classList.remove('mode-gelap');
      localStorage.setItem('tema', 'terang');
      tampilNotifikasi('Mode terang aktif');
    } else {
      // Ubah ke mode gelap
      halaman.classList.add('mode-gelap');
      localStorage.setItem('tema', 'gelap');
      tampilNotifikasi('Mode gelap aktif');
    }
  });
}


/* ==========================================================
   3. BAR PROGRES SCROLL + TOMBOL KE ATAS + LINK MENU AKTIF
   ========================================================== */
function scrollHalaman() {
  var bar = document.getElementById('barProgres');
  var tombolAtas = document.getElementById('tombolAtas');
  var daftarLink = document.querySelectorAll('#menuNavigasi .link-nav');
  var semuaSection = document.querySelectorAll('main section');

  window.addEventListener('scroll', function () {
    var posisi = window.pageYOffset;
    var tinggiDoc = document.body.scrollHeight - window.innerHeight;

    // Update bar progres
    var persen = (posisi / tinggiDoc) * 100;
    bar.style.width = persen + '%';

    // Tampilkan tombol kembali ke atas
    if (posisi > 500) {
      tombolAtas.style.opacity = '1';
      tombolAtas.style.pointerEvents = 'auto';
    } else {
      tombolAtas.style.opacity = '0';
      tombolAtas.style.pointerEvents = 'none';
    }

    // Geser highlight menu sesuai section yang sedang dibaca
    for (var i = 0; i < semuaSection.length; i++) {
      if (semuaSection[i].offsetTop - 150 <= posisi) {
        for (var j = 0; j < daftarLink.length; j++) {
          daftarLink[j].classList.remove('aktif');
        }
        var idSection = semuaSection[i].getAttribute('id');
        for (var k = 0; k < daftarLink.length; k++) {
          if (daftarLink[k].getAttribute('href') === '#' + idSection) {
            daftarLink[k].classList.add('aktif');
          }
        }
      }
    }
  });

  // Klik tombol atas
  tombolAtas.addEventListener('click', function () {
    window.scrollTo(0, 0);
  });
}


/* ==========================================================
   3. ANIMASI ANGKA STATISTIK NAIK
   ========================================================== */
function animasiAngka() {
  var semuaAngka = document.querySelectorAll('[data-hitung]');

  for (var i = 0; i < semuaAngka.length; i++) {
    (function (elemen) {
      var target = parseInt(elemen.getAttribute('data-hitung'), 10);
      var akhir = elemen.getAttribute('data-akhir') || '';
      var desimal = parseInt(elemen.getAttribute('data-desimal') || '0', 10);
      var nilaiSekarang = 0;
      var langkah = target / 40; // dibagi 40 supaya halus

      var timer = setInterval(function () {
        nilaiSekarang += langkah;

        if (nilaiSekarang >= target) {
          nilaiSekarang = target;
          clearInterval(timer);
        }

        var tampil;
        if (desimal > 0) {
          tampil = nilaiSekarang.toFixed(desimal);
        } else {
          tampil = formatRupiah(Math.round(nilaiSekarang));
        }

        elemen.textContent = tampil + akhir;
      }, 30);
    })(semuaAngka[i]);
  }
}


/* ==========================================================
   4. ANIMASI MUNCUL SAAT SCROLL
   ========================================================== */
function animasiScroll() {
  var elemen = document.querySelectorAll('.tampil-saat-scroll');

  // Fungsi untuk menampilkan elemen satu per satu
  function cekPosisi() {
    for (var i = 0; i < elemen.length; i++) {
      var posisi = elemen[i].getBoundingClientRect().top;

      // Kalau sudah terlihat di layar, tampilkan
      if (posisi < 600) {
        elemen[i].classList.add('tampil');
      }
    }
  }

  // Dicek saat halaman dimuat
  cekPosisi();

  // Dicek setiap kali digulir
  window.addEventListener('scroll', cekPosisi);

  // Pengaman: kalau JavaScript tidak berjalan, semua tetap tampil
  setTimeout(function () {
    for (var i = 0; i < elemen.length; i++) {
      elemen[i].classList.add('tampil');
    }
  }, 2000);
}


/* ==========================================================
   5. FILTER JADWAL PER HARI
   ========================================================== */
function filterJadwal() {
  var wadahTombol = document.getElementById('filterHari');
  var tombolSemua = wadahTombol.querySelectorAll('.tombol-filter');
  var barisJadwal = document.querySelectorAll('#isiJadwal tr');
  var angkaSesi = document.getElementById('jumlahSesi');
  var pesanKosong = document.getElementById('jadwalKosong');

  wadahTombol.addEventListener('click', function (acara) {
    var tombol = acara.target.closest('.tombol-filter');
    if (!tombol) return;

    var hariDipilih = tombol.getAttribute('data-hari');
    var jumlahTampil = 0;

    // Tandai tombol yang sedang aktif
    for (var i = 0; i < tombolSemua.length; i++) {
      tombolSemua[i].classList.remove('aktif');
    }
    tombol.classList.add('aktif');

    // Sembunyikan baris yang tidak sesuai hari
    for (var j = 0; j < barisJadwal.length; j++) {
      var hariBaris = barisJadwal[j].getAttribute('data-hari');
      var cocok = false;

      if (hariDipilih === 'semua') {
        cocok = true;
      } else if (hariBaris === hariDipilih) {
        cocok = true;
      }

      if (cocok) {
        barisJadwal[j].classList.remove('sembunyi');
        jumlahTampil++;
      } else {
        barisJadwal[j].classList.add('sembunyi');
      }
    }

    // Perbarui jumlah sesi
    angkaSesi.textContent = jumlahTampil;

    if (jumlahTampil === 0) {
      pesanKosong.classList.remove('hidden');
    } else {
      pesanKosong.classList.add('hidden');
    }

    // Notifikasi
    if (hariDipilih === 'semua') {
      tampilNotifikasi('Menampilkan semua hari, total ' + jumlahTampil + ' sesi');
    } else {
      tampilNotifikasi('Jadwal ' + hariDipilih + ', total ' + jumlahTampil + ' sesi');
    }
  });
}


/* ==========================================================
   6. FILTER PROGRAM PER KATEGORI
   ========================================================== */
function filterProgram() {
  var tombolFilter = document.querySelectorAll('[data-filter-program]');
  var kartuProgram = document.querySelectorAll('#daftarProgram .kartu');
  var pesanKosong = document.getElementById('programKosong');

  for (var i = 0; i < tombolFilter.length; i++) {
    tombolFilter[i].addEventListener('click', function () {
      var kategori = this.getAttribute('data-filter-program');
      var jumlahTampil = 0;

      for (var j = 0; j < tombolFilter.length; j++) {
        tombolFilter[j].classList.remove('aktif');
      }
      this.classList.add('aktif');

      for (var k = 0; k < kartuProgram.length; k++) {
        var kategoriKartu = kartuProgram[k].getAttribute('data-kategori');

        if (kategori === 'semua' || kategoriKartu === kategori) {
          kartuProgram[k].classList.remove('hidden');
          jumlahTampil++;
        } else {
          kartuProgram[k].classList.add('hidden');
        }
      }

      if (jumlahTampil === 0) {
        pesanKosong.classList.remove('hidden');
      } else {
        pesanKosong.classList.add('hidden');
      }

      tampilNotifikasi(jumlahTampil + ' program ditampilkan');
    });
  }
}


/* ==========================================================
   7. MODAL DETAIL PROGRAM
   ========================================================== */
function modalProgram() {
  var tombolDetail = document.querySelectorAll('.detail-program');
  var modal = document.getElementById('modalProgram');
  var latar = document.getElementById('latarModal');
  var judul = document.getElementById('modalJudul');
  var info = document.getElementById('modalInfo');
  var teks = document.getElementById('modalTeks');

  function bukaModal() {
    modal.classList.add('buka');
    document.body.style.overflow = 'hidden';
  }

  function tutupModal() {
    modal.classList.remove('buka');
    document.body.style.overflow = '';
  }

  for (var i = 0; i < tombolDetail.length; i++) {
    tombolDetail[i].addEventListener('click', function () {
      judul.textContent = this.getAttribute('data-judul');
      info.textContent = this.getAttribute('data-info');
      teks.textContent = this.getAttribute('data-teks');
      bukaModal();
    });
  }

  // Menutup modal
  document.getElementById('tombolTutup').addEventListener('click', tutupModal);
  document.getElementById('tombolModalTutup').addEventListener('click', tutupModal);
  document.getElementById('tombolModalDaftar').addEventListener('click', tutupModal);
  latar.addEventListener('click', tutupModal);

  document.addEventListener('keydown', function (acara) {
    if (acara.key === 'Escape') {
      tutupModal();
    }
  });
}


/* ==========================================================
   8. GANTI HARGA BULANAN / TAHUNAN
   ========================================================== */
function gantiHarga() {
  var tombolPeriode = document.querySelectorAll('[data-periode]');
  var semuaHarga = document.querySelectorAll('.harga');
  var labelPeriode = document.querySelectorAll('[data-teks-periode]');
  var labelHemat = document.querySelectorAll('[data-teks-hemat]');

  for (var i = 0; i < tombolPeriode.length; i++) {
    tombolPeriode[i].addEventListener('click', function () {
      var periode = this.getAttribute('data-periode');

      for (var j = 0; j < tombolPeriode.length; j++) {
        tombolPeriode[j].classList.remove('aktif');
      }
      this.classList.add('aktif');

      // Efek hilangnya angka dulu, lalu diganti
      for (var k = 0; k < semuaHarga.length; k++) {
        semuaHarga[k].classList.add('ganti');
      }

      setTimeout(function () {
        for (var m = 0; m < semuaHarga.length; m++) {
          var harga = parseInt(semuaHarga[m].getAttribute('data-harga-' + periode), 10);
          var hargaBulanan = parseInt(semuaHarga[m].getAttribute('data-harga-bulan'), 10);
          var selisih = hargaBulanan * 12 - harga;

          semuaHarga[m].textContent = formatRupiah(harga);

          // Tulis keterangan hemat
          for (var n = 0; n < labelHemat.length; n++) {
            if (periode === 'tahun' && selisih > 0) {
              labelHemat[n].textContent = 'Hemat Rp ' + formatRupiah(selisih) + ' per tahun';
            } else {
              labelHemat[n].textContent = '';
            }
          }
        }

        // Ubah label /bulan jadi /tahun
        for (var p = 0; p < labelPeriode.length; p++) {
          if (periode === 'tahun') {
            labelPeriode[p].textContent = '/tahun';
          } else {
            labelPeriode[p].textContent = '/bulan';
          }
        }

        for (var q = 0; q < semuaHarga.length; q++) {
          semuaHarga[q].classList.remove('ganti');
        }

        if (periode === 'tahun') {
          tampilNotifikasi('Menampilkan harga tahunan, hemat 20 persen');
        } else {
          tampilNotifikasi('Menampilkan harga bulanan');
        }
      }, 200);
    });
  }
}



// BMI

function hitungBMI(berat, tinggi) {
  var tinggiMeter = tinggi / 100;
  var bmi = berat / (tinggiMeter * tinggiMeter);
  return bmi;
}

// Fungsi menentukan kategori BMI dan sarannya
function kategoriBMI(bmi) {
  if (bmi < 18.5) {
    return {
      nama: 'Kurus',
      warna: '#dc2626',
      saran: 'BMI Anda di bawah batas normal. Fokus pada makanan tinggi protein dan latihan kekuatan untuk membentuk massa otot. Program yang cocok: Strength Forge dan Power Yoga.'
    };
  } else if (bmi < 25) {
    return {
      nama: 'Normal',
      warna: '#16a34a',
      saran: 'BMI Anda berada pada kategori normal. Pertahankan kebiasaan dengan latihan rutin 3 sampai 4 kali seminggu. Program yang cocok: CrossFit Blast dan Power Yoga.'
    };
  } else if (bmi < 30) {
    return {
      nama: 'Gemuk',
      warna: '#d97706',
      saran: 'BMI Anda sedikit di atas batas normal. Perbanyak latihan kardio dan kurangi lemak. Program yang cocok: HIIT Turbo dan Spin and Ride.'
    };
  } else {
    return {
      nama: 'Obesitas',
      warna: '#dc2626',
      saran: 'BMI Anda di kategori obesitas. Mulai dari kardio intensitas rendah secara bertahap dan konsultasikan ke dokter. Program yang cocok: Spin and Ride dan Power Yoga.'
    };
  }
}

// Fungsi mengubah nilai BMI menjadi sudut jarum (derajat)
function sudutJarum(bmi) {
  var batasMinimum = 10;
  var batasMaksimum = 40;
  var nilai = bmi;

  // Batasi nilai supaya tidak keluar dari grafik
  if (nilai < batasMinimum) nilai = batasMinimum;
  if (nilai > batasMaksimum) nilai = batasMaksimum;

  var sudut = ((nilai - 25) / 15) * 90;
  return sudut;
}

// Fungsi mengubah nilai BMI menjadi posisi penanda pada bar skala
function posisiPenanda(bmi) {
  var batasMinimum = 14;
  var batasMaksimum = 36;
  var nilai = bmi;

  if (nilai < batasMinimum) nilai = batasMinimum;
  if (nilai > batasMaksimum) nilai = batasMaksimum;

  var posisi = ((nilai - batasMinimum) / (batasMaksimum - batasMinimum)) * 100;
  return posisi;
}

function kalkulatorBMI() {
  var form = document.getElementById('formBmi');
  var inputBerat = document.getElementById('berat');
  var inputTinggi = document.getElementById('tinggi');
  var barisBerat = document.getElementById('barisBerat');
  var barisTinggi = document.getElementById('barisTinggi');
  var nilaiBmi = document.getElementById('nilaiBmi');
  var kategori = document.getElementById('kategoriBmi');
  var beratIdeal = document.getElementById('beratIdeal');
  var jarum = document.getElementById('jarumBmi');
  var penanda = document.getElementById('penandaBmi');
  var teksSaran = document.getElementById('teksSaran');
  var tombolReset = document.getElementById('tombolResetBmi');

  form.addEventListener('submit', function (acara) {
    acara.preventDefault();

    var berat = parseFloat(inputBerat.value);
    var tinggi = parseFloat(inputTinggi.value);

    // Validasi input
    var beratValid = (berat >= 20 && berat <= 300);
    var tinggiValid = (tinggi >= 100 && tinggi <= 250);

    if (!beratValid) {
      barisBerat.classList.add('error');
    } else {
      barisBerat.classList.remove('error');
    }

    if (!tinggiValid) {
      barisTinggi.classList.add('error');
    } else {
      barisTinggi.classList.remove('error');
    }

    if (!beratValid || !tinggiValid) {
      tampilNotifikasi('Data belum benar, periksa kembali');
      return;
    }

    // Menghitung BMI
    var bmi = hitungBMI(berat, tinggi);
    var hasil = kategoriBMI(bmi);

    // Menghitung berat ideal
    var tinggiMeter = tinggi / 100;
    var idealMinimum = 18.5 * tinggiMeter * tinggiMeter;
    var idealMaksimum = 24.9 * tinggiMeter * tinggiMeter;

    // Menampilkan hasil
    nilaiBmi.textContent = bmi.toFixed(1);
    nilaiBmi.style.color = hasil.warna;

    kategori.textContent = hasil.nama;
    kategori.style.backgroundColor = '#f3f4f6';
    kategori.style.color = hasil.warna;

    beratIdeal.textContent = Math.round(idealMinimum) + ' - ' + Math.round(idealMaksimum) + ' kg';

    // Gerakkan jarum dan penanda
    jarum.style.color = hasil.warna;
    jarum.style.transform = 'rotate(' + sudutJarum(bmi) + 'deg)';
    penanda.style.left = posisiPenanda(bmi) + '%';
    penanda.style.backgroundColor = hasil.warna;

    // Tampilkan saran
    teksSaran.textContent = hasil.saran;

    tampilNotifikasi('BMI Anda ' + bmi.toFixed(1) + ', kategori ' + hasil.nama);
  });

  // Tombol reset
  tombolReset.addEventListener('click', function () {
    form.reset();
    barisBerat.classList.remove('error');
    barisTinggi.classList.remove('error');

    nilaiBmi.textContent = '-';
    nilaiBmi.style.color = '#2563eb';
    kategori.textContent = 'Menunggu input';
    kategori.style.color = '#6b7280';
    beratIdeal.textContent = '- kg';
    jarum.style.color = '#111827';
    jarum.style.transform = 'rotate(-90deg)';
    penanda.style.left = '0%';
    penanda.style.backgroundColor = '#111827';

    teksSaran.textContent = 'Isi berat dan tinggi badan Anda, lalu klik tombol Hitung BMI untuk melihat hasilnya.';

    tampilNotifikasi('Kalkulator dikosongkan');
  });
}


/* ==========================================================
   10. VALIDASI FORM PENDAFTARAN
   ========================================================== */

// Fungsi mengecek format email
function cekEmail(teks) {
  var pola = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return pola.test(teks);
}

// Fungsi mengecek nomor telepon
function cekTelepon(teks) {
  var angka = teks.replace(/[^0-9]/g, '');

  if (angka.length < 10) {
    return false;
  }
  if (angka.length > 15) {
    return false;
  }
  return true;
}

function validasiGabung() {
  var form = document.getElementById('formGabung');
  var pesanSukses = document.getElementById('pesanSukses');
  var teksSukses = document.getElementById('teksSukses');
  var tombolDaftarLagi = document.getElementById('tombolDaftarLagi');

  form.addEventListener('submit', function (acara) {
    acara.preventDefault();

    // Mengambil nilai dari setiap isian
    var nama = form.nama.value.trim();
    var email = form.email.value.trim();
    var telepon = form.hp.value.trim();
    var umur = parseInt(form.umur.value, 10);
    var paket = form.paket.value;
    var minat = form.minat.value;
    var setuju = form.setuju.checked;

    // Daftar isian yang salah
    var salah = [];

    // Cek nama
    if (nama.length < 3) {
      document.getElementById('barisNama').classList.add('error');
      salah.push('nama');
    } else {
      document.getElementById('barisNama').classList.remove('error');
    }

    // Cek email
    if (cekEmail(email) === false) {
      document.getElementById('barisEmail').classList.add('error');
      salah.push('email');
    } else {
      document.getElementById('barisEmail').classList.remove('error');
    }

    // Cek nomor telepon
    if (cekTelepon(telepon) === false) {
      document.getElementById('barisHp').classList.add('error');
      salah.push('nomor telepon');
    } else {
      document.getElementById('barisHp').classList.remove('error');
    }

    // Cek umur
    if (isNaN(umur) || umur < 15 || umur > 70) {
      document.getElementById('barisUmur').classList.add('error');
      salah.push('umur');
    } else {
      document.getElementById('barisUmur').classList.remove('error');
    }

    // Cek paket
    if (paket === '') {
      document.getElementById('barisPaket').classList.add('error');
      salah.push('paket');
    } else {
      document.getElementById('barisPaket').classList.remove('error');
    }

    // Cek program favorit
    if (minat === '') {
      document.getElementById('barisMinat').classList.add('error');
      salah.push('program favorit');
    } else {
      document.getElementById('barisMinat').classList.remove('error');
    }

    // Cek persetujuan
    if (setuju === false) {
      document.getElementById('barisSetuju').classList.add('error');
      salah.push('persetujuan');
    } else {
      document.getElementById('barisSetuju').classList.remove('error');
    }

    // Kalau ada yang salah, hentikan
    if (salah.length > 0) {
      tampilNotifikasi('Periksa lagi: ' + salah.join(', '));
      return;
    }

    // Kalau semua benar, tampilkan pesan sukses
    teksSukses.textContent = 'Terima kasih ' + nama + '. Pendaftaran paket ' + paket +
      ' dengan program ' + minat + ' sudah kami terima. Tim FitZone akan menghubungi ' +
      telepon + ' maksimal satu hari kerja.';

    form.classList.add('hidden');
    pesanSukses.classList.remove('hidden');
    pesanSukses.scrollIntoView({ behavior: 'smooth', block: 'center' });

    tampilNotifikasi('Pendaftaran berhasil dikirim');
  });

  // Hilangkan tanda error saat isian diperbaiki
  var semuaIsian = form.querySelectorAll('input, select, textarea');
  for (var i = 0; i < semuaIsian.length; i++) {
    semuaIsian[i].addEventListener('input', function () {
      var baris = this.closest('.baris-input');
      if (baris) {
        baris.classList.remove('error');
      }
    });
  }

  // Tombol daftar lagi
  tombolDaftarLagi.addEventListener('click', function () {
    form.reset();
    pesanSukses.classList.add('hidden');
    form.classList.remove('hidden');
  });
}


/* ==========================================================
   11. ACCORDION FAQ
   ========================================================== */
function accordionFaq() {
  var semuaItem = document.querySelectorAll('.item-faq');

  for (var i = 0; i < semuaItem.length; i++) {
    (function (item) {
      var tombol = item.querySelector('.tombol-faq');
      var panel = item.querySelector('.pesan-faq');

      // Panel pertama langsung dibuka
      if (item.classList.contains('buka')) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }

      tombol.addEventListener('click', function () {
        var sedangBuka = item.classList.contains('buka');

        // Tutup semua panel lain
        for (var j = 0; j < semuaItem.length; j++) {
          semuaItem[j].classList.remove('buka');
          var panelLain = semuaItem[j].querySelector('.pesan-faq');
          panelLain.style.maxHeight = '0px';
        }

        // Buka panel yang dipilih
        if (!sedangBuka) {
          item.classList.add('buka');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    })(semuaItem[i]);
  }
}


/* ==========================================================
   TAHUN DI FOOTER
   ========================================================== */
function isiTahun() {
  document.getElementById('tahun').textContent = new Date().getFullYear();
}


/* ==========================================================
   MENJALANKAN SEMUA FUNGSI
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  menuMobile();
  gantiTema();
  scrollHalaman();
  animasiAngka();
  animasiScroll();
  filterJadwal();
  filterProgram();
  modalProgram();
  gantiHarga();
  kalkulatorBMI();
  validasiGabung();
  accordionFaq();
  isiTahun();
});
