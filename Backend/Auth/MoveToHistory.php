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


if (isset($data['username']) && isset($data['order_id'])) {
    $username = $data['username'];
    $order_id = $data['order_id'];

 
    $conn = connectToDatabase();


    $query = "SELECT id_user FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $id_user = $row['id_user'];

        $cartQuery = "SELECT c.id_produk, c.id_size, c.jumlah, p.harga 
        FROM cart c 
        JOIN produk p ON c.id_produk = p.id_produk 
        WHERE c.id_user = ?";
        $cartStmt = $conn->prepare($cartQuery);
        $cartStmt->bind_param("i", $id_user);
        $cartStmt->execute();
        $cartResult = $cartStmt->get_result();

        $conn->begin_transaction();

        // Pindahkan setiap item dari cart ke riwayat_transaksi
        try {
            while ($cartRow = $cartResult->fetch_assoc()) {
                $product_id = $cartRow['id_produk'];
                $size_id = $cartRow['id_size'];
                $quantity = $cartRow['jumlah'];
                $harga_produk = $cartRow['harga'];
                $total_harga = $harga_produk * $quantity;

                // Kurangi stok berdasarkan ukuran produk
                $stokQuery = "SELECT stok FROM stok_size_produk WHERE id_size = ?";
                $stokStmt = $conn->prepare($stokQuery);
                $stokStmt->bind_param("i", $size_id);
                $stokStmt->execute();
                $stokResult = $stokStmt->get_result();

                if ($stokResult->num_rows > 0) {
                    $stokRow = $stokResult->fetch_assoc();
                    $current_stock = $stokRow['stok'];

                    if ($current_stock >= $quantity) {
                        $new_stock = $current_stock - $quantity;

       
                        $updateStokQuery = "UPDATE stok_size_produk SET stok = ? WHERE id_size = ?";
                        $updateStokStmt = $conn->prepare($updateStokQuery);
                        $updateStokStmt->bind_param("ii", $new_stock, $size_id);
                        $updateStokStmt->execute();

                      
                        $orderQuery = "INSERT INTO riwayat_transaksi (id_user, id_produk, jumlah, total_harga, tanggal_transaksi) 
                                       VALUES (?, ?, ?, ?, NOW())";
                        $orderStmt = $conn->prepare($orderQuery);
                        $orderStmt->bind_param("iiii", $id_user, $product_id, $quantity, $total_harga);
                        $orderStmt->execute();
                    } else {
                        throw new Exception("Stok tidak mencukupi untuk produk ID: $product_id, Size ID: $size_id");
                    }
                } else {
                    throw new Exception("Produk dengan ID $product_id dan Size ID $size_id tidak ditemukan.");
                }
            }

            // Hapus data dari cart setelah dipindahkan
            $deleteQuery = "DELETE FROM cart WHERE id_user = ?";
            $deleteStmt = $conn->prepare($deleteQuery);
            $deleteStmt->bind_param("i", $id_user);
            $deleteStmt->execute();

            // Commit transaksi
            $conn->commit();
            echo json_encode(['success' => 'Payment successful. Products moved to order history and cart cleared.']);
        } catch (Exception $e) {
            $conn->rollback(); // Rollback jika ada kesalahan
            echo json_encode(['error' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'User not found']);
    }
} else {
    echo json_encode(['error' => 'Invalid request data']);
}
?>
