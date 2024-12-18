<?php
require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';
require_once "../Helper/DB.php"; 

header("Access-Control-Allow-Origin: *");  
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');  // Pastikan respons JSON

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);


// Periksa apakah order_id dan username ada
if (isset($data['username']) && isset($data['order_id']) && isset($data['product_id']) && isset($data['quantity']) && isset($data['total_amount'])) {
    $username = $data['username'];
    $order_id = $data['order_id'];
    $product_id = $data['product_id'];
    $quantity = $data['quantity'];
    $total_amount = $data['total_amount'];

    // Koneksi ke database
    $conn = connectToDatabase();

    // Periksa apakah koneksi berhasil
    if ($conn->connect_error) {
        echo json_encode(['error' => 'Database connection failed.']);
        exit;
    }

    // Ambil id_user berdasarkan username
    $query = "SELECT id_user FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $id_user = $row['id_user'];

        // Insert data ke tabel riwayat_transaksi
        $orderQuery = "INSERT INTO riwayat_transaksi (id_user, id_produk, jumlah, total_harga, tanggal_transaksi) 
                       VALUES (?, ?, ?, ?, NOW())";
        $orderStmt = $conn->prepare($orderQuery);
        $orderStmt->bind_param("iiis", $id_user, $product_id, $quantity, $total_amount);

        if ($orderStmt->execute()) {
            echo json_encode(['success' => 'Payment successful. Product moved to order history.']);
        } else {
            echo json_encode(['error' => 'Failed to insert into order history. SQL Error: ' . $orderStmt->error]);
        }
    } else {
        echo json_encode(['error' => 'Username not found.']);
    }
} else {
    echo json_encode(['error' => 'Invalid data received.']);
}
?>
