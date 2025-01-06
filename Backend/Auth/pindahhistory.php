<?php
// Matikan error reporting untuk production
error_reporting(0);
ini_set('display_errors', 0);

require_once "../Helper/DB.php";
session_start();

// Tambahkan header CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function debug_log($step, $message, $data = null) {
    $log = [
        'step' => $step,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('H:i:s')
    ];
    error_log("DEBUG: " . json_encode($log));
    return $log;
}

try {
    $debug_logs = [];
    
    // Log raw input
    $raw_input = file_get_contents('php://input');
    error_log("Raw input: " . $raw_input);
    
    $data = json_decode($raw_input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON: ' . json_last_error_msg());
    }
    
    if (!isset($data['username']) || !isset($data['items'])) {
        throw new Exception('Missing required fields: username or items');
    }

    $conn = connectToDatabase();
    $conn->begin_transaction();

    $username = $data['username'];
    $items = $data['items'];

    $debug_logs[] = debug_log(1, "Processing order", [
        'username' => $username,
        'items' => $items
    ]);

    // Get user ID
    $query = "SELECT id_user FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user) {
        throw new Exception('User not found');
    }

    foreach ($items as $item) {
        // Get size_id from size name
        $sizeQuery = "SELECT id_size, size FROM size_produk WHERE size = ? AND id_produk = ?";
        $sizeStmt = $conn->prepare($sizeQuery);
        $sizeStmt->bind_param("si", $item['size'], $item['id_produk']);
        $sizeStmt->execute();
        $sizeResult = $sizeStmt->get_result();
        $sizeData = $sizeResult->fetch_assoc();

        if (!$sizeData) {
            throw new Exception("Size not found");
        }

        // Get warna_id from warna name
        $warnaQuery = "SELECT id_warna FROM warna WHERE nama_warna = ?";
        $warnaStmt = $conn->prepare($warnaQuery);
        $warnaStmt->bind_param("s", $item['nama_warna']);
        $warnaStmt->execute();
        $warnaResult = $warnaStmt->get_result();
        $warnaData = $warnaResult->fetch_assoc();

        if (!$warnaData) {
            throw new Exception("Color not found");
        }

        // Check stock
        $stockQuery = "SELECT stok FROM stok_size_produk WHERE id_size = ? AND id_warna = ?";
        $stockStmt = $conn->prepare($stockQuery);
        $stockStmt->bind_param("ii", $sizeData['id_size'], $warnaData['id_warna']);
        $stockStmt->execute();
        $stockResult = $stockStmt->get_result();
        $stockData = $stockResult->fetch_assoc();

        if (!$stockData) {
            throw new Exception("Stock not found");
        }

        // Insert into riwayat_transaksi with size_name
        $insertQuery = "INSERT INTO riwayat_transaksi 
                       (id_user, id_produk, id_size, size_name, id_warna, jumlah, total_harga, tanggal_transaksi, alamat) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)";
        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bind_param("iiisidds", 
            $user['id_user'], 
            $item['id_produk'], 
            $sizeData['id_size'],
            $sizeData['size'],  // Simpan nama size
            $warnaData['id_warna'],
            $item['quantity'],
            $item['price'],
            $item['alamat']
        );
        
        if (!$insertStmt->execute()) {
            throw new Exception("Failed to insert transaction: " . $insertStmt->error);
        }

        // Update stock
        $newStock = $stockData['stok'] - $item['quantity'];
        if ($newStock >= 0) {
            $updateQuery = "UPDATE stok_size_produk SET stok = ? WHERE id_size = ? AND id_warna = ?";
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bind_param("iii", $newStock, $sizeData['id_size'], $warnaData['id_warna']);
            $updateStmt->execute();
        } else {
            throw new Exception("Insufficient stock");
        }

        $debug_logs[] = debug_log("Success", "Transaction processed successfully", [
            'product_id' => $item['id_produk'],
            'new_stock' => $newStock
        ]);
    }

    $conn->commit();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Order processed successfully',
        'debug_logs' => $debug_logs
    ]);

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->rollback();
    }
    
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'debug_logs' => $debug_logs
    ]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>
