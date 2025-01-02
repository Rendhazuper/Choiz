<?php
// Backend/Admin/deleteuser.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once "../Helper/DB.php";

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conn = connectToDatabase();

// Get the email from the POST request
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email']) && !empty($data['email'])) {
    $email = $conn->real_escape_string($data['email']);

    // SQL to delete a record
    $sql = "DELETE FROM users WHERE email = ? AND level = 'admin'";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(["status" => "success", "message" => "User deleted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "User not found or not an admin"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error deleting user: " . $conn->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}

$conn->close();
?>