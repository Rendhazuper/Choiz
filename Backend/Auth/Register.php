<?php
// Mengatur header untuk mengizinkan koneksi dari frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("access-Control-Allow-Credentials: true");
// header("Content-Type: application/json; charset=UTF-8");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// koneksi ke db
try {
    require_once  "../Helper/DB.php";//ubah sini buat db
} catch (Exception $err) {
    echo "Error: " . $err->getMessage();
}


// Membaca data JSON dari body request
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
$level = $input["level"];

//query pakai prepared statement
$stmt = $conn->prepare("INSERT INTO users (email, username, name, password, level) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $email, $username, $nama, $password, $level);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "Registrasi berhasil! Silakan login."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Registrasi gagal: " . $stmt->error]);
}


$conn->close();