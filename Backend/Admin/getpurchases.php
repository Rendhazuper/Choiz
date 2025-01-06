<?php
require_once "../Helper/DB.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

try {
    $conn = connectToDatabase();
    
    $query = "SELECT 
                rt.id_transaksi,
                u.username,
                p.nama_produk,
                p.gambar_produk,
                COALESCE(sp.size, rt.size_name) as size,
                w.nama_warna,
                rt.jumlah,
                rt.total_harga,
                rt.alamat,
                rt.tanggal_transaksi
              FROM riwayat_transaksi rt
              JOIN users u ON rt.id_user = u.id_user
              JOIN produk p ON rt.id_produk = p.id_produk
              LEFT JOIN size_produk sp ON rt.id_size = sp.id_size
              JOIN warna w ON rt.id_warna = w.id_warna
              ORDER BY rt.tanggal_transaksi DESC";
              
    $result = $conn->query($query);
    
    if ($result) {
        $purchases = array();
        while ($row = $result->fetch_assoc()) {
            $purchases[] = $row;
        }
        
        echo json_encode([
            "status" => "success",
            "data" => $purchases
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to fetch purchase history"
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?> 