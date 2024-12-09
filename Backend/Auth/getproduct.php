<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET,POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
include('../helper/DB.php'); 

// Ambil parameter id dari URL
$id = isset($_GET['id']) ? $_GET['id'] : null;

if ($id) {
    // Query untuk mengambil produk berdasarkan id
    $sql = "SELECT pr.nama_produk, pr.warna, pr.kategori, pr.harga, pr.gambar_produk, pr.deskripsi, 
       sz.size, st.stok
        FROM produk pr
        INNER JOIN size_produk sz ON pr.id_produk = sz.id_produk
        INNER JOIN stok_size_produk st ON sz.id_size = st.id_size
        WHERE pr.id_produk = ?";
        
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
            if ($result->num_rows > 0) {
                $produk = [];
                while ($row = $result->fetch_assoc()) {
                    $produk['nama_produk'] = $row['nama_produk'];
                    $produk['warna'] = $row['warna'];
                    $produk['kategori'] = $row['kategori'];
                    $produk['harga'] = $row['harga'];
                    $produk['gambar_produk'] = $row['gambar_produk'];
                    $produk['deskripsi'] = $row['deskripsi'];
                    // Menambahkan ukuran dan stok ke array sizes
                    $produk['sizes'][] = [
                        'size' => $row['size'],
                        'stok' => $row['stok']
                    ];
                }
            }
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
