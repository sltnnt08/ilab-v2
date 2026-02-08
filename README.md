# LABIFY (ilab-v2)

Dokumentasi singkat untuk menjalankan aplikasi ini di komputer lokal (local development). Ditulis untuk orang yang belum familiar dengan Laravel / Node.js.

## Gambaran singkat

- Ini adalah aplikasi web berbasis **Laravel 12 (PHP)**.
- Frontend pakai **Inertia + React** dan build tool **Vite**.
- Saat development, biasanya ada 2 hal yang harus jalan bersamaan:
	- Server Laravel (backend)
	- Vite dev server (frontend assets)

## Yang dibutuhkan (prasyarat)

Minimal:

- PHP 8.2+ (project ini cocok di PHP 8.3)
- Composer (untuk install dependency PHP)
- Node.js + npm (untuk dependency frontend & Vite)

Catatan Windows:

- Semua perintah di bawah diasumsikan dijalankan dari folder project ini.
- Kalau kamu pakai stack seperti PhpWebStudy/Laragon/XAMPP, pastikan perintah `php`, `composer`, dan `npm` bisa dipanggil dari Terminal (PATH).

## Cara paling gampang: 2 perintah

Project ini sudah menyiapkan script Composer.

1) Setup pertama kali (install dependency + env + migrate + build)

```bash
composer run setup
```

Catatan penting: script di atas akan menyalin `.env.example` menjadi `.env`. Setelah itu, kamu biasanya perlu **mengubah `.env` untuk mode lokal** (APP_ENV/APP_DEBUG/APP_URL) dan **menyesuaikan database** (mis. MySQL) sebelum aplikasi dipakai.

2) Jalankan mode development (backend + queue + Vite)

```bash
composer run dev
```

Setelah itu buka:

- http://127.0.0.1:8000

Kalau halaman belum tampil normal, baca bagian “Troubleshooting” di bawah.

## Setup manual (kalau 2 perintah di atas gagal)

### 1) Install dependency PHP

```bash
composer install
```

### 2) Buat file `.env`

Project ini punya contoh env: `.env.example`.

Di Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Lalu ubah beberapa nilai di file `.env` (paling penting):

- `APP_ENV=local`
- `APP_DEBUG=true`
- `APP_URL=http://127.0.0.1:8000`

### 3) Generate APP_KEY

```bash
php artisan key:generate
```

### 4) Set database (pilih salah satu)

#### Opsi A (paling mudah): SQLite (tanpa install database server)

1) Buat file database:

```powershell
New-Item -ItemType File -Force database\database.sqlite
```

2) Ubah `.env`:

```env
DB_CONNECTION=sqlite
```

3) Jalankan migrasi:

```bash
php artisan migrate
```

#### Opsi B: MySQL / MariaDB

1) Buat database kosong dulu di MySQL (misal: `labify`).

2) Ubah `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=labify
DB_USERNAME=root
DB_PASSWORD=
```

3) Migrasi:

```bash
php artisan migrate
```

#### Opsi C: PostgreSQL

1) Buat database kosong dulu di Postgres.

2) Ubah `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=labify
DB_USERNAME=postgres
DB_PASSWORD=
```

3) Migrasi:

```bash
php artisan migrate
```

### 5) (Opsional tapi sering perlu) storage link

Kalau aplikasi menyimpan file (misalnya avatar), jalankan:

```bash
php artisan storage:link
```

### 6) Install dependency frontend

```bash
npm install
```

## Menjalankan aplikasi (manual)

Jalankan ini di 2 terminal terpisah:

Terminal 1 (Laravel):

```bash
php artisan serve
```

Terminal 2 (Vite):

```bash
npm run dev
```

Lalu buka:

- http://127.0.0.1:8000

## Akun login

Belum ada akun default yang didokumentasikan di repo.

- Kalau halaman login/register tersedia, gunakan fitur register untuk buat akun.
- Kalau kamu butuh data contoh (seed), biasanya bisa pakai:

```bash
php artisan db:seed
```

Jika seed butuh konfigurasi khusus, beri tahu aku error-nya (copy/paste) biar aku sesuaikan langkahnya.

## Troubleshooting (yang paling sering)

### 1) Halaman putih / error 500

- Pastikan `.env` sudah ada dan `APP_KEY` sudah digenerate.
- Coba bersihkan cache:

```bash
php artisan config:clear
php artisan cache:clear
```

Lihat detail error di:

- `storage/logs/laravel.log`

### 2) `Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest`

Biasanya karena Vite belum jalan atau belum build.

- Untuk development: jalankan `npm run dev` (atau `composer run dev`).
- Untuk produksi/build: jalankan `npm run build`.

### 3) Error koneksi database

- Pastikan `DB_CONNECTION` sesuai (sqlite/mysql/pgsql).
- Pastikan port benar (MySQL 3306, Postgres 5432).
- Setelah ganti `.env`, jalankan `php artisan config:clear`.

### 4) Queue tidak jalan (fitur tertentu “nyangkut”)

Project ini pakai queue berbasis database.

- Pakai `composer run dev` (sudah termasuk queue listener), atau jalankan manual:

```bash
php artisan queue:listen --tries=1
```

## Perintah berguna

- Jalankan test: `composer test`
- Jalankan formatter: `vendor/bin/pint`

