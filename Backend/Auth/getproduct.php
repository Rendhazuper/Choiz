<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
include('../Helper/DB.php'); 

$id = isset($_GET['id']) ? $_GET['id'] : null;
$isAdmin = isset($_GET['isAdmin']) ? $_GET['isAdmin'] : false;

if ($id) {
    if ($isAdmin) {
        // Query untuk admin: tampilkan produk meskipun tidak ada di tabel stok
        $sql = "SELECT 
                    p.id_produk,
                    p.nama_produk, 
                    p.id_kategori, 
                    k.nama_kategori, 
                    p.harga, 
                    p.gambar_produk, 
                    p.deskripsi,
                    sz.size,
                    sz.id_size,
                    w.id_warna,
                    w.nama_warna,
                    COALESCE(ssp.stok, 0) as stok
                FROM produk p
                INNER JOIN kategori k ON p.id_kategori = k.id_kategori
                LEFT JOIN size_produk sz ON p.id_produk = sz.id_produk
                LEFT JOIN stok_size_produk ssp ON sz.id_size = ssp.id_size
                LEFT JOIN warna w ON ssp.id_warna = w.id_warna
                WHERE p.id_produk = ?";
    } else {
        // Query original untuk user biasa
        $sql = "SELECT 
                    p.id_produk,
                    p.nama_produk, 
                    p.id_kategori, 
                    k.nama_kategori, 
                    p.harga, 
                    p.gambar_produk, 
                    p.deskripsi,
                    sz.size,
                    sz.id_size,
                    w.id_warna,
                    w.nama_warna,
                    ssp.stok
                FROM produk p
                INNER JOIN kategori k ON p.id_kategori = k.id_kategori
                INNER JOIN size_produk sz ON p.id_produk = sz.id_produk
                INNER JOIN stok_size_produk ssp ON sz.id_size = ssp.id_size
                INNER JOIN warna w ON ssp.id_warna = w.id_warna
                WHERE p.id_produk = ?";
    }
    
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $produk = [];
        
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                if (empty($produk)) {
                    $produk = [
                        'nama_produk' => $row['nama_produk'],
                        'id_kategori' => $row['id_kategori'],
                        'nama_kategori' => $row['nama_kategori'],
                        'harga' => $row['harga'],
                        'gambar_produk' => $row['gambar_produk'],
                        'deskripsi' => $row['deskripsi'],
                        'sizes' => []
                    ];
                }
                
                // Cek apakah size sudah ada di array
                $sizeExists = false;
                foreach ($produk['sizes'] as &$size) {
                    if ($size['size'] === $row['size']) {
                        $size['warna'][] = [
                            'nama_warna' => $row['nama_warna'],
                            'stok' => $row['stok']
                        ];
                        $sizeExists = true;
                        break;
                    }
                }
                
                if (!$sizeExists) {
                    $produk['sizes'][] = [
                        'size' => $row['size'],
                        'warna' => [[
                            'nama_warna' => $row['nama_warna'],
                            'stok' => $row['stok']
                        ]]
                    ];
                }
            }
        }
        
        $stmt->close();
    }
} else {
    if ($isAdmin) {
        // Query untuk admin: tampilkan semua produk dari tabel produk
        $sql = "SELECT 
                    p.id_produk, 
                    p.nama_produk, 
                    p.id_kategori, 
                    k.nama_kategori, 
                    p.harga, 
                    p.gambar_produk, 
                    p.deskripsi,
                    0 as total_stok
                FROM produk p
                INNER JOIN kategori k ON p.id_kategori = k.id_kategori";
    } else {
        // Query untuk user biasa: hanya tampilkan produk dengan stok > 0
        $sql = "SELECT 
                    p.id_produk, 
                    p.nama_produk, 
                    p.id_kategori, 
                    k.nama_kategori, 
                    p.harga, 
                    p.gambar_produk, 
                    p.deskripsi,
                    (SELECT SUM(ssp.stok)
                     FROM stok_size_produk ssp
                     INNER JOIN size_produk sp ON ssp.id_size = sp.id_size
                     WHERE sp.id_produk = p.id_produk) as total_stok
                FROM produk p
                INNER JOIN kategori k ON p.id_kategori = k.id_kategori
                HAVING total_stok > 0";
    }
    
    $result = $conn->query($sql);
    $produk = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $produk[] = [
                'id_produk' => $row['id_produk'],
                'nama_produk' => $row['nama_produk'],
                'id_kategori' => $row['id_kategori'],
                'nama_kategori' => $row['nama_kategori'],
                'harga' => $row['harga'],
                'gambar_produk' => $row['gambar_produk'],
                'deskripsi' => $row['deskripsi'],
                'total_stok' => $row['total_stok'] ?? 0
            ];
        }
    }
}

$conn->close();
echo json_encode($produk);
?>
