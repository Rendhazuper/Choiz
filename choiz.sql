-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 08 Des 2024 pada 17.58
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `choiz`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `artikel`
--

CREATE TABLE `artikel` (
  `id_artikel` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `kategori` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `billing`
--

CREATE TABLE `billing` (
  `id_bill` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `total_harga` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','canceled') NOT NULL,
  `tanggal_transaksi` datetime DEFAULT current_timestamp(),
  `alamat_pengiriman` text DEFAULT NULL,
  `metode_pembayaran` enum('transfer','cod','credit_card') NOT NULL,
  `resi_pengiriman` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `cart`
--

CREATE TABLE `cart` (
  `id_cart` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_produk` int(11) NOT NULL,
  `jumlah` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `token` varchar(128) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `produk`
--

CREATE TABLE `produk` (
  `id_produk` int(11) NOT NULL,
  `nama_produk` varchar(255) NOT NULL,
  `warna` varchar(50) DEFAULT NULL,
  `kategori` varchar(100) DEFAULT NULL,
  `harga` int(11) NOT NULL,
  `gambar_produk` mediumblob DEFAULT NULL,
  `deskripsi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `produk`
--

INSERT INTO `produk` (`id_produk`, `nama_produk`, `warna`, `kategori`, `harga`, `gambar_produk`, `deskripsi`) VALUES
(121, 'Polo Shirt', 'Navy Blue', 'Pakaian', 149000, 0x61737365742f70726f64756b2f363735356336306363396361302e706e67, 'Cotton polo shirt with classic styling'),
(122, 'Skinny Jeans', 'Black', 'Pakaian', 199000, 0x61737365742f70726f64756b2f363735356336356434396366372e706e67, 'Slim fit stretch denim jeans'),
(123, 'Hiking Backpack', 'Olive Green', 'Perlengkapan Outdoor', 399000, 0x61737365742f70726f64756b2f363735356336373734386162332e706e67, 'Durable backpack with multiple compartments'),
(124, 'Ceramic Mug', 'White', 'Perlengkapan Rumah', 40000, 0x61737365742f70726f64756b2f363735356336393731613132382e706e67, '12oz ceramic mug with minimalist design'),
(125, 'Running Shoes', 'Gray', 'Olahraga', 498999, 0x61737365742f70726f64756b2f363735356336616361316338652e706e67, 'Lightweight, breathable running shoes with cushioned sole');

-- --------------------------------------------------------

--
-- Struktur dari tabel `size_produk`
--

CREATE TABLE `size_produk` (
  `id_size` int(11) NOT NULL,
  `id_produk` int(11) NOT NULL,
  `size` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `size_produk`
--

INSERT INTO `size_produk` (`id_size`, `id_produk`, `size`) VALUES
(123, 121, 'S'),
(124, 121, 'M'),
(125, 121, 'L'),
(126, 121, 'XL'),
(127, 122, 'L'),
(128, 122, 'XL'),
(129, 122, 'XXL'),
(130, 122, 'M'),
(131, 123, 'M'),
(132, 123, 'L'),
(133, 124, 'L'),
(134, 125, 'L'),
(135, 125, 'XL');

-- --------------------------------------------------------

--
-- Struktur dari tabel `stok_size_produk`
--

CREATE TABLE `stok_size_produk` (
  `id_size` int(11) NOT NULL,
  `stok` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `stok_size_produk`
--

INSERT INTO `stok_size_produk` (`id_size`, `stok`) VALUES
(123, 20),
(124, 11),
(125, 25),
(126, 12),
(127, 12),
(128, 35),
(129, 23),
(130, 21),
(131, 23),
(132, 23),
(133, 1),
(134, 12),
(135, 2);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `level` enum('user','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id_user`, `email`, `username`, `name`, `password`, `level`) VALUES
(12, 'giojio936@gmail.com', 'gio', 'gio', 'gio', 'user'),
(13, 'ge@gmail.com', 'ge', 'ge', 'ge', 'user'),
(14, 'giovanoalkandri@gmail.com', 'giovanoalkandri', 'Giovano Alkandri', 'asd', 'user'),
(15, 'giojio825@gmail.com', 'geoooo', 'geoooo', 'geo', 'user'),
(16, 'a@g.com', 'a', 'a', 'a', 'user');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `artikel`
--
ALTER TABLE `artikel`
  ADD PRIMARY KEY (`id_artikel`);

--
-- Indeks untuk tabel `billing`
--
ALTER TABLE `billing`
  ADD PRIMARY KEY (`id_bill`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id_cart`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indeks untuk tabel `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `username` (`username`);

--
-- Indeks untuk tabel `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id_produk`);

--
-- Indeks untuk tabel `size_produk`
--
ALTER TABLE `size_produk`
  ADD PRIMARY KEY (`id_size`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indeks untuk tabel `stok_size_produk`
--
ALTER TABLE `stok_size_produk`
  ADD KEY `id_size` (`id_size`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `artikel`
--
ALTER TABLE `artikel`
  MODIFY `id_artikel` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `billing`
--
ALTER TABLE `billing`
  MODIFY `id_bill` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `cart`
--
ALTER TABLE `cart`
  MODIFY `id_cart` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `produk`
--
ALTER TABLE `produk`
  MODIFY `id_produk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT untuk tabel `size_produk`
--
ALTER TABLE `size_produk`
  MODIFY `id_size` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `billing`
--
ALTER TABLE `billing`
  ADD CONSTRAINT `billing_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Ketidakleluasaan untuk tabel `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`);

--
-- Ketidakleluasaan untuk tabel `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `size_produk`
--
ALTER TABLE `size_produk`
  ADD CONSTRAINT `size_produk_ibfk_1` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`);

--
-- Ketidakleluasaan untuk tabel `stok_size_produk`
--
ALTER TABLE `stok_size_produk`
  ADD CONSTRAINT `stok_size_produk_ibfk_1` FOREIGN KEY (`id_size`) REFERENCES `size_produk` (`id_size`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
