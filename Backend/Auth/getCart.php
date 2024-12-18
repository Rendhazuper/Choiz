<?php
require_once "../Helper/DB.php"; 
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username'])) {
    echo json_encode(['error' => 'Missing username']);
    exit;
}

$username = $data['username'];
$conn = connectToDatabase();
$query = "SELECT id_user FROM users WHERE username = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();


if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $id_user = $row['id_user'];


    $query = "SELECT c.id_cart, p.nama_produk, p.gambar_produk, p.harga, sp.size, c.jumlah 
              FROM cart c
              JOIN produk p ON c.id_produk = p.id_produk
              JOIN size_produk sp ON c.id_size = sp.id_size
              WHERE c.id_user = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id_user);
    $stmt->execute();
    $cartResult = $stmt->get_result();


    $cartData = [];
    while ($cartRow = $cartResult->fetch_assoc()) {
        $cartData[] = $cartRow;
    }

    echo json_encode(['cart' => $cartData]);
} else {
    
    echo json_encode(['error' => 'User not found']);
}


$conn->close();
?>
