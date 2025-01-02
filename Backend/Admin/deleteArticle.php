<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../Helper/DB.php";

$id_artikel = $_GET['id'];

$response = ["status" => "error", "message" => "Unknown error occurred"];

// Mulai transaction untuk memastikan data terhapus dengan aman
$conn->begin_transaction();

try {
    // Hapus artikel berdasarkan ID
    $sql_delete_article = "DELETE FROM artikel WHERE id_artikel = ?";
    $stmt = $conn->prepare($sql_delete_article);
    $stmt->bind_param("i", $id_artikel);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            $conn->commit();
            $response = [
                "status" => "success",
                "message" => "Article deleted successfully"
            ];
        } else {
            throw new Exception("Article not found");
        }
    } else {
        throw new Exception("Error deleting article");
    }

} catch (Exception $e) {
    $conn->rollback();
    $response = [
        "status" => "error",
        "message" => $e->getMessage()
    ];
}

$stmt->close();
$conn->close();

echo json_encode($response); 