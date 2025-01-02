<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Pastikan tidak ada output sebelum JSON
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once "../Helper/DB.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Debug
        error_log("Received data: " . print_r($data, true));

        if (isset($data['username']) && isset($data['id_produk']) && isset($data['jumlah']) && isset($data['size']) && isset($data['warna'])) {
            $username = $data['username'];
            $id_produk = $data['id_produk'];
            $jumlah = $data['jumlah'];
            $size = $data['size'];
            $warna = $data['warna'];

            // Get user ID
            $stmt = $conn->prepare("SELECT id_user FROM users WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                throw new Exception("User not found");
            }
            
            $user = $result->fetch_assoc();
            $id_user = $user['id_user'];

            // Get size ID
            $stmt = $conn->prepare("SELECT id_size FROM size_produk WHERE id_produk = ? AND size = ?");
            $stmt->bind_param("is", $id_produk, $size);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                throw new Exception("Size not found");
            }
            
            $sizeData = $result->fetch_assoc();
            $id_size = $sizeData['id_size'];

            // Get warna ID
            $stmt = $conn->prepare("SELECT id_warna FROM warna WHERE nama_warna = ?");
            $stmt->bind_param("s", $warna);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                throw new Exception("Color not found");
            }
            
            $warnaData = $result->fetch_assoc();
            $id_warna = $warnaData['id_warna'];

            // Check current stock
            $stmt = $conn->prepare("SELECT stok FROM stok_size_produk WHERE id_size = ? AND id_warna = ?");
            $stmt->bind_param("ii", $id_size, $id_warna);
            $stmt->execute();
            $result = $stmt->get_result();
            $stockData = $result->fetch_assoc();

            // Check existing items in cart
            $stmt = $conn->prepare("SELECT SUM(jumlah) as total_in_cart FROM cart WHERE id_user = ? AND id_produk = ? AND id_size = ? AND id_warna = ?");
            $stmt->bind_param("iiii", $id_user, $id_produk, $id_size, $id_warna);
            $stmt->execute();
            $cartResult = $stmt->get_result();
            $cartData = $cartResult->fetch_assoc();
            $totalInCart = $cartData['total_in_cart'] ?? 0;

            // Check if adding new quantity would exceed stock
            if (($totalInCart + $jumlah) > $stockData['stok']) {
                throw new Exception("Not enough stock available. Available stock: " . ($stockData['stok'] - $totalInCart));
            }

            // Add to cart
            $stmt = $conn->prepare("INSERT INTO cart (id_user, id_produk, id_size, id_warna, jumlah) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("iiiii", $id_user, $id_produk, $id_size, $id_warna, $jumlah);
            
            if ($stmt->execute()) {
                echo json_encode(["message" => "Successfully added to cart"]);
            } else {
                throw new Exception("Failed to add to cart");
            }
        } else {
            throw new Exception("Incomplete data");
        }
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
