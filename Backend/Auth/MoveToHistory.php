<?php
require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';
require_once "../Helper/DB.php"; 

header("Access-Control-Allow-Origin: *");  
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}


$data = json_decode(file_get_contents('php://input'), true);

// Periksa apakah order_id dan username ada
if (isset($data['username']) && isset($data['order_id'])) {
    $username = $data['username'];
    $order_id = $data['order_id'];

    // Koneksi database
    $conn = connectToDatabase();

    // Ambil id_user dari username
    $query = "SELECT id_user FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $id_user = $row['id_user'];

        // Ambil data cart berdasarkan id_user
        $cartQuery = "SELECT c.id_produk, c.jumlah, p.harga 
                      FROM cart c 
                      JOIN produk p ON c.id_produk = p.id_produk 
                      WHERE c.id_user = ?";
        $cartStmt = $conn->prepare($cartQuery);
        $cartStmt->bind_param("i", $id_user);
        $cartStmt->execute();
        $cartResult = $cartStmt->get_result();

        // Pindahkan setiap item dari cart ke riwayat_transaksi
        while ($cartRow = $cartResult->fetch_assoc()) {
            $product_id = $cartRow['id_produk'];
            $quantity = $cartRow['jumlah'];
            $harga_produk = $cartRow['harga'];
            $total_harga = $harga_produk * $quantity;

            // Insert data ke tabel riwayat_transaksi
            $orderQuery = "INSERT INTO riwayat_transaksi (id_user, id_produk, jumlah, total_harga, tanggal_transaksi) 
                           VALUES (?, ?, ?, ?, NOW())";
            $orderStmt = $conn->prepare($orderQuery);
            $orderStmt->bind_param("iiis", $id_user, $product_id, $quantity, $total_harga);
            $orderStmt->execute();
        }

        // Hapus data dari cart setelah dipindahkan
        $deleteQuery = "DELETE FROM cart WHERE id_user = ?";
        $deleteStmt = $conn->prepare($deleteQuery);
        $deleteStmt->bind_param("i", $id_user);
        $deleteStmt->execute();

        // Respons sukses
        echo json_encode(['success' => 'Payment successful. Products moved to order history and cart cleared.']);
    } else {
        echo json_encode(['error' => 'User not found']);
    }
} else {
    echo json_encode(['error' => 'Invalid request data']);
}
?>
