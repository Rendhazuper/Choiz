<?php
require_once "../Helper/DB.php"; 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$conn = connectToDatabase();


$query = "SELECT email, username, password FROM users WHERE level = 'admin'";
$result = $conn->query($query);

if ($result && $result->num_rows > 0) {
    $admins = [];
    while ($row = $result->fetch_assoc()) {
        $admins[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $admins]);
} else {
    echo json_encode(["status" => "error", "message" => "No admin users found"]);
}

$conn->close();
