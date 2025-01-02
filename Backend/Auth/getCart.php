<?php
require_once "../Helper/DB.php"; 
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Debug: Log request method
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);

$data = json_decode(file_get_contents("php://input"), true);

// Debug: Log received data
error_log("Received data: " . print_r($data, true));

if (!isset($data['username'])) {
    echo json_encode(['error' => 'Missing username']);
    exit;
}

$username = $data['username'];
$conn = connectToDatabase();

// Debug: Log username
error_log("Username: " . $username);

$query = "SELECT c.*, p.nama_produk, p.harga, p.gambar_produk, sp.size, w.nama_warna 
          FROM cart c
          JOIN produk p ON c.id_produk = p.id_produk
          JOIN size_produk sp ON c.id_size = sp.id_size
          JOIN warna w ON c.id_warna = w.id_warna
          JOIN users u ON c.id_user = u.id_user
          WHERE u.username = ?";

// Debug: Log query
error_log("Query: " . $query);

$stmt = $conn->prepare($query);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

// Debug: Log number of rows
error_log("Number of rows: " . $result->num_rows);

$cartData = [];
while ($cartRow = $result->fetch_assoc()) {
    $cartData[] = $cartRow;
}

// Debug: Log cart data
error_log("Cart data: " . print_r($cartData, true));

echo json_encode(['cart' => $cartData]);

$conn->close();
?>
