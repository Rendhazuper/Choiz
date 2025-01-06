<?php
require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';
require_once "../Helper/DB.php"; 

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

header("Access-Control-Allow-Origin: *");  
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
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
    
    $debug_logs[] = debug_log(1, "Received data", $data);

    if (!isset($data['username']) || !isset($data['order_id'])) {
        throw new Exception('Missing required fields: username or order_id');
    }

    $conn = connectToDatabase();
    $conn->begin_transaction();

    $username = $data['username'];
    $order_id = $data['order_id'];

    $debug_logs[] = debug_log(2, "Processing order", [
        'username' => $username,
        'order_id' => $order_id
    ]);

    // Get user ID
    $query = "SELECT id_user FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("User not found: $username");
    }

    $row = $result->fetch_assoc();
    $id_user = $row['id_user'];
    $debug_logs[] = debug_log(3, "User found", ['id_user' => $id_user]);

    // Get cart data with size information
    $cartQuery = "SELECT c.*, p.harga, p.nama_produk, w.nama_warna, sp.size as size_name 
                  FROM cart c 
                  JOIN produk p ON c.id_produk = p.id_produk 
                  JOIN warna w ON c.id_warna = w.id_warna
                  JOIN size_produk sp ON c.id_size = sp.id_size
                  WHERE c.id_user = ?";
    
    $cartStmt = $conn->prepare($cartQuery);
    $cartStmt->bind_param("i", $id_user);
    $cartStmt->execute();
    $cartResult = $cartStmt->get_result();
    
    if ($cartResult->num_rows === 0) {
        throw new Exception("No items found in cart");
    }

    while ($cartRow = $cartResult->fetch_assoc()) {
        $debug_logs[] = debug_log(4, "Processing cart item", $cartRow);

        $product_id = $cartRow['id_produk'];
        $size_id = $cartRow['id_size'];
        $warna_id = $cartRow['id_warna'];
        $quantity = $cartRow['jumlah'];
        $harga_produk = $cartRow['harga'];
        $total_harga = $harga_produk * $quantity;
        $alamat = $data['alamat'] ?? ''; // Get shipping address from request data

        // Check stock
        $stokQuery = "SELECT stok FROM stok_size_produk WHERE id_size = ? AND id_warna = ?";
        $stokStmt = $conn->prepare($stokQuery);
        $stokStmt->bind_param("ii", $size_id, $warna_id);
        $stokStmt->execute();
        $stokResult = $stokStmt->get_result();
        
        if ($stokResult->num_rows === 0) {
            throw new Exception("Stock not found for size_id: $size_id and warna_id: $warna_id");
        }

        $stokRow = $stokResult->fetch_assoc();
        $current_stock = $stokRow['stok'];

        if ($current_stock < $quantity) {
            throw new Exception("Insufficient stock for product_id: $product_id, size_id: $size_id, warna_id: $warna_id");
        }

        // Insert transaction record with size_name
        $orderQuery = "INSERT INTO riwayat_transaksi 
                      (id_user, id_produk, id_size, size_name, id_warna, jumlah, 
                       total_harga, tanggal_transaksi, alamat) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)";
        $orderStmt = $conn->prepare($orderQuery);
        $orderStmt->bind_param("iiisidds", 
            $id_user, 
            $product_id, 
            $size_id,
            $cartRow['size_name'], // Simpan nama size
            $warna_id,
            $quantity,
            $total_harga,
            $alamat
        );
        
        if (!$orderStmt->execute()) {
            throw new Exception("Failed to insert transaction: " . $orderStmt->error);
        }

        $debug_logs[] = debug_log(5, "Transaction recorded", [
            'id_user' => $id_user,
            'product_id' => $product_id,
            'size_id' => $size_id,
            'warna_id' => $warna_id
        ]);

        // Update stock
        $new_stock = $current_stock - $quantity;
        if ($new_stock > 0) {
            $updateQuery = "UPDATE stok_size_produk SET stok = ? WHERE id_size = ? AND id_warna = ?";
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bind_param("iii", $new_stock, $size_id, $warna_id);
            
            if (!$updateStmt->execute()) {
                throw new Exception("Failed to update stock: " . $updateStmt->error);
            }
        } else {
            $deleteQuery = "DELETE FROM stok_size_produk WHERE id_size = ? AND id_warna = ?";
            $deleteStmt = $conn->prepare($deleteQuery);
            $deleteStmt->bind_param("ii", $size_id, $warna_id);
            
            if (!$deleteStmt->execute()) {
                throw new Exception("Failed to delete stock: " . $deleteStmt->error);
            }
        }
    }

    // Clear cart
    $clearCartQuery = "DELETE FROM cart WHERE id_user = ?";
    $clearCartStmt = $conn->prepare($clearCartQuery);
    $clearCartStmt->bind_param("i", $id_user);
    
    if (!$clearCartStmt->execute()) {
        throw new Exception("Failed to clear cart: " . $clearCartStmt->error);
    }

    $conn->commit();
    $debug_logs[] = debug_log(6, "Transaction completed successfully");

    echo json_encode([
        'status' => 'success',
        'message' => 'Order processed successfully',
        'debug_logs' => $debug_logs
    ]);

} catch (Exception $e) {
    error_log("Error in MoveToHistory: " . $e->getMessage());
    if (isset($conn)) {
        $conn->rollback();
    }
    $debug_logs[] = debug_log('ERROR', $e->getMessage());
    
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
