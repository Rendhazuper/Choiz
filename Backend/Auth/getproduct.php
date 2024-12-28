<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
include('../Helper/DB.php'); 


$id = isset($_GET['id']) ? $_GET['id'] : null;

if ($id) {
    $sql = "SELECT pr.nama_produk, pr.warna, pr.kategori, pr.harga, pr.gambar_produk, pr.deskripsi, 
       sz.size, st.stok
        FROM produk pr
        INNER JOIN size_produk sz ON pr.id_produk = sz.id_produk
        INNER JOIN stok_size_produk st ON sz.id_size = st.id_size
        WHERE pr.id_produk = ?";
        
    
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("i", $id); 
        $stmt->execute();
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
    $sql = "SELECT p.*, 
        (SELECT SUM(ssp.stok) 
         FROM stok_size_produk ssp 
         INNER JOIN size_produk sp ON ssp.id_size = sp.id_size 
         WHERE sp.id_produk = p.id_produk) as total_stok 
        FROM produk p 
        HAVING total_stok > 0";
    
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
