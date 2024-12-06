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

if (!isset($input["email"]) || !isset($input["password"])) {
    http_response_code(400);
    echo json_encode(["error" => "Email dan password diperlukan"]);
    exit();
}

$email = $input["email"];
$password = $input["password"];

// Query menggunakan prepared statement untuk memeriksa pengguna berdasarkan email
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verifikasi password
    if ($password === $user["password"]) {
        http_response_code(200);
        echo json_encode(["message" => "Login berhasil", "username" => $user["username"]]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Password salah"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["error" => "Pengguna tidak ditemukan"]);
}

$conn->close();