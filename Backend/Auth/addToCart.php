<?php
require_once "../Helper/DB.php"; // Sesuaikan dengan lokasi file DB.php

// Mengatur CORS untuk frontend
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Menangani request preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Membaca input JSON dari frontend
$data = json_decode(file_get_contents("php://input"), true);

// Periksa apakah data valid
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['error' => 'Invalid JSON format']);
    exit;
}

// Memeriksa apakah semua data yang dibutuhkan ada
if (!isset($data['username']) || !isset($data['id_produk']) || !isset($data['jumlah']) || !isset($data['id_size'])) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$username = $data['username'];
$id_produk = $data['id_produk'];
$jumlah = $data['jumlah'];
$size_label = $data['id_size']; 


$conn = connectToDatabase();


$query = "SELECT id_user FROM users WHERE username = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();


if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $id_user = $row['id_user'];

    // Query untuk mendapatkan id_size berdasarkan id_produk dan label ukuran
    $query = "SELECT id_size FROM size_produk WHERE id_produk = ? AND size = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("is", $id_produk, $size_label);
    $stmt->execute();
    $sizeResult = $stmt->get_result();

    // Jika id_size ditemukan
    if ($sizeResult->num_rows > 0) {
        $sizeRow = $sizeResult->fetch_assoc();
        $id_size = $sizeRow['id_size'];

        // Memeriksa apakah produk sudah ada di keranjang untuk id_user dan id_size
        $query = "SELECT * FROM cart WHERE id_user = ? AND id_produk = ? AND id_size = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("iii", $id_user, $id_produk, $id_size);
        $stmt->execute();
        $cartResult = $stmt->get_result();

        if ($cartResult->num_rows > 0) {
            // Jika produk sudah ada, update jumlah
            $cartRow = $cartResult->fetch_assoc();
            $new_quantity = $cartRow['jumlah'] + $jumlah;
            $update_query = "UPDATE cart SET jumlah = ? WHERE id_user = ? AND id_produk = ? AND id_size = ?";
            $stmt = $conn->prepare($update_query);
            $stmt->bind_param("iiii", $new_quantity, $id_user, $id_produk, $id_size);
            $stmt->execute();
            echo json_encode(['message' => 'Cart updated']);
        } else {
            // Jika produk belum ada, insert produk baru ke cart
            $insert_query = "INSERT INTO cart (id_user, id_produk, jumlah, id_size) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($insert_query);
            $stmt->bind_param("iiii", $id_user, $id_produk, $jumlah, $id_size);
            $stmt->execute();
            echo json_encode(['message' => 'Product added to cart']);
        }
    } else {
        // Jika id_size tidak ditemukan untuk produk dan ukuran tersebut
        echo json_encode(['error' => 'Size not found for the product']);
    }

    // Menutup statement
    $stmt->close();
} else {
    // Jika user tidak ditemukan
    echo json_encode(['error' => 'User not found']);
}

// Menutup koneksi ke database
$conn->close();
?>
