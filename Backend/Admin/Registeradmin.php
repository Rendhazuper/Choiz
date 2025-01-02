<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    require_once "../Helper/DB.php";
} catch (Exception $err) {
    echo "Error: " . $err->getMessage();
}

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input["email"]) || !isset($input["username"]) || !isset($input["name"]) || !isset($input["password"])) {
    http_response_code(400);
    echo json_encode(["error" => "Email, username, name, dan password diperlukan"]);
    exit();
}

$email = $input["email"];
$password = $input["password"]; 
$nama = $input["name"];
$username = $input["username"];
$level = "admin";

// Query pakai prepared statement
$stmt = $conn->prepare("INSERT INTO users (email, username, name, password, level) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $email, $username, $nama, $password, $level);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "Registrasi admin berhasil!"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Registrasi gagal: " . $stmt->error]);
}

$stmt->close();
$conn->close();