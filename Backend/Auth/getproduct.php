<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
include('../helper/DB.php'); 

// Ambil parameter id dari URL
$id = isset($_GET['id']) ? $_GET['id'] : null;

if ($id) {
    // Query untuk mengambil produk berdasarkan id
    $sql = "SELECT * FROM produk WHERE id_produk = ?";
    
    // Siapkan statement
    if ($stmt = $conn->prepare($sql)) {
        // Bind parameter
        $stmt->bind_param("i", $id); // "i" untuk integer (id_produk)
        
        // Eksekusi query
        $stmt->execute();
        
        // Ambil hasilnya
        $result = $stmt->get_result();
        $produk = [];
        
        if ($result->num_rows > 0) {
            // Jika ada produk, simpan hasil query ke dalam array
            $produk = $result->fetch_assoc();
        }
        
        // Tutup statement
        $stmt->close();
    }
} else {
    // Jika tidak ada id, ambil semua produk
    $sql = "SELECT * FROM produk";
    
    // Eksekusi query
    $result = $conn->query($sql);
    $produk = [];
    
    if ($result->num_rows > 0) {
        // Menyimpan data produk dalam array
        while($row = $result->fetch_assoc()) {
            $produk[] = $row;
        }
    }
}

$conn->close();

// Mengirimkan data produk dalam format JSON
echo json_encode($produk);
?>
