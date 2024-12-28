<?php
require_once "../Helper/DB.php";


header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id_cart'])) {
    $id_cart = $data['id_cart'];
    $conn = connectToDatabase();

    $query = "DELETE FROM cart WHERE id_cart = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id_cart);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Failed to delete item"]);
    }
} else {
    echo json_encode(["error" => "Invalid request"]);
}
?>
