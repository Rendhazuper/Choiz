<?php
require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
// Set your Merchant Server Key

\Midtrans\Config::$serverKey = 'SB-Mid-server-_OP9yDfGv3I4qAISo9ZupEN2';
\Midtrans\Config::$isProduction = false;
\Midtrans\Config::$isSanitized = true;
\Midtrans\Config::$is3ds = true;

$data = json_decode(file_get_contents('php://input'), true);


if (isset($data['username']) && isset($data['totalAmount'])) {
    $username = $data['username'];
    $totalAmount = $data['totalAmount'];
} else {
    echo json_encode(['error' => 'Username or Total Amount is missing.']);
    exit;
}
// Buat order ID yang unik (misalnya menggunakan timestamp atau UUID)
$order_id =  rand();

$params = array(
    'transaction_details' => array(
        'order_id' => $order_id,
        'gross_amount' => $totalAmount,
    ),
    'customer_details' => array(
        'first_name' => $username,
        'email' => 'user@example.com', // Ganti dengan email pengguna sesungguhnya
    ),
);

$snapToken = \Midtrans\Snap::getSnapToken($params);

if (!$snapToken) {
    echo json_encode(['error' => 'Failed to generate Snap token']);
} else {
    echo json_encode([
        'username' => $username,
        'totalAmount' => $totalAmount,
        'token' => $snapToken
    ]);
}
?>
