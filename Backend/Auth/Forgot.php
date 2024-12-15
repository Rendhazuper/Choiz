<?php
// Mengatur header untuk mengizinkan koneksi dari frontend
header("Access-Control-Allow-Origin: https://lightcoral-rat-258584.hostingersite.com");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("access-Control-Allow-Credentials: true");
// header("Content-Type: application/json; charset=UTF-8");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
// koneksi ke db / helper
try {
    require_once "../Helper/DB.php"; //ubah sini buat db
    require_once "../Helper/Helpers.php";
} catch (Exception $err) {
    echo "Error: " . $err->getMessage();
};

$input = json_decode(file_get_contents("php://input"), true);
$email = $input['email'] ?? '';

// Validasi input
if (empty($email)) {
    http_response_code(400);
    echo json_encode(["error" => "Email harus diisi."]);
    exit;
}

// Periksa apakah email ada di database
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Email tidak ditemukan."]);
    exit;
}

// Ambil data pengguna
$user = $result->fetch_assoc();
$username = $user['username'];

// Buat token reset password
$token = GenerateToken64();
$tokenExpiry = date("Y-m-d H:i:s", strtotime("+1 hour"));

// Simpan token ke database
$stmt = $conn->prepare("INSERT INTO password_resets (username, token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, expires_at = ?");
$stmt->bind_param("sssss", $username, $token, $tokenExpiry, $token, $tokenExpiry);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Terjadi kesalahan saat menyimpan token reset."]);
    exit;
}else{
    $sendEmail = sendResetEmail($email, $token);
    //print email dan token
    echo json_encode($sendEmail);
}


$stmt->close();
$conn->close();
