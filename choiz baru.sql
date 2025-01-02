-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 02, 2025 at 07:06 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
-- Table structure for table `artikel`
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
-- Table structure for table `billing`
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
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id_cart` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_produk` int(11) NOT NULL,
  `id_size` int(11) NOT NULL,
  `jumlah` int(11) DEFAULT 1,
  `id_warna` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id_cart`, `id_user`, `id_produk`, `id_size`, `jumlah`, `id_warna`) VALUES
(59, 16, 189, 306, 1, 2),
(66, 13, 192, 322, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int(11) NOT NULL,
  `nama_kategori` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `nama_kategori`) VALUES
(9, 'Baju'),
(10, 'Celana'),
(11, 'Sweater'),
(12, 'Jacket'),
(13, 'bajubaru');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
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
-- Table structure for table `produk`
--

CREATE TABLE `produk` (
  `id_produk` int(11) NOT NULL,
  `nama_produk` varchar(255) NOT NULL,
  `id_kategori` int(11) DEFAULT NULL,
  `harga` int(11) NOT NULL,
  `gambar_produk` mediumblob DEFAULT NULL,
  `deskripsi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`id_produk`, `nama_produk`, `id_kategori`, `harga`, `gambar_produk`, `deskripsi`) VALUES
(189, 'jaket skena', 10, 1321, 0x61737365742f70726f64756b2f363737353663653765623836632e706e67, 'tes'),
(190, 'Jaket bauk', 9, 1321, 0x61737365742f70726f64756b2f363737353738643632663266332e706e67, 'tes'),
(191, 'Oversized Sweater', 10, 1231, 0x61737365742f70726f64756b2f363737353765643130383730632e706e67, 'tes'),
(192, 'tes 3', 13, 2132, 0x61737365742f70726f64756b2f363737363231663436366134372e706e67, 'tes');

-- --------------------------------------------------------

--
-- Table structure for table `riwayat_transaksi`
--

CREATE TABLE `riwayat_transaksi` (
  `id_transaksi` int(11) NOT NULL,
  `id_user` varchar(255) NOT NULL,
  `id_produk` int(11) NOT NULL,
  `id_size` int(11) DEFAULT NULL,
  `id_warna` int(11) DEFAULT NULL,
  `jumlah` int(11) NOT NULL,
  `total_harga` int(11) NOT NULL,
  `tanggal_transaksi` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `riwayat_transaksi`
--

INSERT INTO `riwayat_transaksi` (`id_transaksi`, `id_user`, `id_produk`, `id_size`, `id_warna`, `jumlah`, `total_harga`, `tanggal_transaksi`) VALUES
(37, '13', 190, 307, 2, 2, 2642, '2025-01-01 17:18:34'),
(38, '13', 191, NULL, 1, 3, 3693, '2025-01-01 17:47:19'),
(39, '13', 191, NULL, 1, 1, 1231, '2025-01-01 17:55:05');

-- --------------------------------------------------------

--
-- Table structure for table `size_produk`
--

CREATE TABLE `size_produk` (
  `id_size` int(11) NOT NULL,
  `id_produk` int(11) NOT NULL,
  `size` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `size_produk`
--

INSERT INTO `size_produk` (`id_size`, `id_produk`, `size`) VALUES
(307, 190, 'XS'),
(320, 191, 'XS'),
(321, 191, 'S'),
(322, 192, 'XS');

-- --------------------------------------------------------

--
-- Table structure for table `stok_size_produk`
--

CREATE TABLE `stok_size_produk` (
  `id_size` int(11) NOT NULL,
  `stok` int(11) NOT NULL,
  `id_warna` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stok_size_produk`
--

INSERT INTO `stok_size_produk` (`id_size`, `stok`, `id_warna`) VALUES
(307, 1, 1),
(320, 10, 1),
(320, 5, 2),
(320, 1, 5),
(320, 5, 3),
(321, 1, 1),
(322, 1, 1),
(322, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
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
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `email`, `username`, `name`, `password`, `level`) VALUES
(12, 'giojio936@gmail.com', 'gio', 'gio', 'gio', 'user'),
(13, 'ge@gmail.com', 'ge', 'ge', 'ge', 'user'),
(14, 'giovanoalkandri@gmail.com', 'giovanoalkandri', 'Giovano Alkandri', 'asd', 'user'),
(15, 'giojio825@gmail.com', 'geoooo', 'geoooo', 'geo', 'user'),
(16, 'a@g.com', 'a', 'a', 'a', 'user'),
(17, 'admin', 'admin', 'admin', 'admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `warna`
--

CREATE TABLE `warna` (
  `id_warna` int(11) NOT NULL,
  `nama_warna` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `warna`
--

INSERT INTO `warna` (`id_warna`, `nama_warna`) VALUES
(1, 'Merah'),
(2, 'Putih'),
(3, 'Cokelat'),
(4, 'Hitam'),
(5, 'Kuning');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `artikel`
--
ALTER TABLE `artikel`
  ADD PRIMARY KEY (`id_artikel`);

--
-- Indexes for table `billing`
--
ALTER TABLE `billing`
  ADD PRIMARY KEY (`id_bill`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id_cart`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_produk` (`id_produk`),
  ADD KEY `id_size` (`id_size`),
  ADD KEY `id_warna` (`id_warna`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id_produk`);

--
-- Indexes for table `riwayat_transaksi`
--
ALTER TABLE `riwayat_transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `riwayat_transaksi_size_fk` (`id_size`),
  ADD KEY `riwayat_transaksi_warna_fk` (`id_warna`);

--
-- Indexes for table `size_produk`
--
ALTER TABLE `size_produk`
  ADD PRIMARY KEY (`id_size`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indexes for table `stok_size_produk`
--
ALTER TABLE `stok_size_produk`
  ADD KEY `id_size` (`id_size`),
  ADD KEY `fk_warna` (`id_warna`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `warna`
--
ALTER TABLE `warna`
  ADD PRIMARY KEY (`id_warna`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `artikel`
--
ALTER TABLE `artikel`
  MODIFY `id_artikel` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `billing`
--
ALTER TABLE `billing`
  MODIFY `id_bill` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id_cart` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `produk`
--
ALTER TABLE `produk`
  MODIFY `id_produk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=193;

--
-- AUTO_INCREMENT for table `riwayat_transaksi`
--
ALTER TABLE `riwayat_transaksi`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `size_produk`
--
ALTER TABLE `size_produk`
  MODIFY `id_size` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=323;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `warna`
--
ALTER TABLE `warna`
  MODIFY `id_warna` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `billing`
--
ALTER TABLE `billing`
  ADD CONSTRAINT `billing_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`),
  ADD CONSTRAINT `cart_ibfk_3` FOREIGN KEY (`id_warna`) REFERENCES `warna` (`id_warna`),
  ADD CONSTRAINT `fk_produk_id` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`) ON UPDATE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE;

--
-- Constraints for table `riwayat_transaksi`
--
ALTER TABLE `riwayat_transaksi`
  ADD CONSTRAINT `riwayat_transaksi_size_fk` FOREIGN KEY (`id_size`) REFERENCES `size_produk` (`id_size`) ON DELETE SET NULL,
  ADD CONSTRAINT `riwayat_transaksi_warna_fk` FOREIGN KEY (`id_warna`) REFERENCES `warna` (`id_warna`) ON DELETE SET NULL;

--
-- Constraints for table `size_produk`
--
ALTER TABLE `size_produk`
  ADD CONSTRAINT `size_produk_ibfk_1` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`);

--
-- Constraints for table `stok_size_produk`
--
ALTER TABLE `stok_size_produk`
  ADD CONSTRAINT `fk_size_produk` FOREIGN KEY (`id_size`) REFERENCES `size_produk` (`id_size`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_warna` FOREIGN KEY (`id_warna`) REFERENCES `warna` (`id_warna`),
  ADD CONSTRAINT `stok_size_produk_ibfk_1` FOREIGN KEY (`id_size`) REFERENCES `size_produk` (`id_size`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
