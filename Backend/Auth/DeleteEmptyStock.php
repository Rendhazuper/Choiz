<?php
require_once "../Helper/DB.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

try {
    $conn = connectToDatabase();
    $conn->begin_transaction();

    // 1. Hapus dari stok_size_produk yang stoknya 0 atau kurang
    $deleteStockQuery = "DELETE FROM stok_size_produk WHERE stok <= 0";
    if (!$conn->query($deleteStockQuery)) {
        throw new Exception("Failed to delete empty stock");
    }

    // 2. Hapus size_produk yang tidak memiliki stok
    $deleteSizeQuery = "DELETE sp FROM size_produk sp 
                       LEFT JOIN stok_size_produk ssp ON sp.id_size = ssp.id_size 
                       WHERE ssp.id_size IS NULL";
    if (!$conn->query($deleteSizeQuery)) {
        throw new Exception("Failed to delete sizes without stock");
    }

    // 3. Hapus produk yang tidak memiliki size
    $deleteProductQuery = "DELETE p FROM produk p 
                         LEFT JOIN size_produk sp ON p.id_produk = sp.id_produk 
                         WHERE sp.id_produk IS NULL";
    if (!$conn->query($deleteProductQuery)) {
        throw new Exception("Failed to delete products without sizes");
    }

    $conn->commit();
    echo json_encode([
        'status' => 'success',
        'message' => 'Empty stock data cleaned successfully'
    ]);

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->rollback();
    }
    error_log("Error in DeleteEmptyStock.php: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?> 