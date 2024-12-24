<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../Helper/DB.php"; 


$id_produk = $_GET['id']; 

$response = ["success" => false, "message" => "Unknown error occurred"];


$conn->begin_transaction();
try {

    $sql_delete_cart = "DELETE FROM cart WHERE id_produk = ?";
    $stmt = $conn->prepare($sql_delete_cart);
    $stmt->bind_param("i", $id_produk);
    $stmt->execute();

 
    $sql_delete_stock = "DELETE FROM stok_size_produk WHERE id_size IN (SELECT id_size FROM size_produk WHERE id_produk = ?)";
    $stmt = $conn->prepare($sql_delete_stock);
    $stmt->bind_param("i", $id_produk);
    $stmt->execute();

    $sql_delete_size = "DELETE FROM size_produk WHERE id_produk = ?";
    $stmt = $conn->prepare($sql_delete_size);
    $stmt->bind_param("i", $id_produk);
    $stmt->execute();


    $sql_delete_product = "DELETE FROM produk WHERE id_produk = ?";
    $stmt = $conn->prepare($sql_delete_product);
    $stmt->bind_param("i", $id_produk);
    $stmt->execute();

   
    $conn->commit();
    $response = ["success" => true, "message" => "Product deleted successfully"];
} catch (Exception $e) {
  
    $conn->rollback();
    $response = ["success" => false, "message" => $e->getMessage()];
}


$conn->close();

echo json_encode($response);
?>