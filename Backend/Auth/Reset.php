<?php
// Mengatur header untuk mengizinkan koneksi dari frontend
header("Access-Control-Allow-Origin: https://lightcoral-rat-258584.hostingersite.com");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// koneksi ke db / helper
try {
    require_once "../Helper/DB.php";
    require_once "../Helper/Helpers.php";
} catch (Exception $err) {
    echo "Error: " . $err->getMessage();
};

$input = json_decode(file_get_contents("php://input"), true);
$token = $input['token'] ?? '';
$newPassword = $input['newPassword'] ?? '';

// Validasi input
if (empty($token) || empty($newPassword)) {
    http_response_code(400);
    echo json_encode(["error" => "Token dan password baru harus diisi."]);
    exit;
}

// Periksa token reset password
$stmt = $conn->prepare("SELECT username, expires_at FROM password_resets WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(400);
    echo json_encode(["error" => "Token reset password tidak valid."]);
    exit;
}

$resetData = $result->fetch_assoc();
$username = $resetData['username'];

// Cek apakah token sudah kedaluwarsa
$expiresAt = strtotime($resetData['expires_at']);
$currentTime = time();

if ($currentTime > $expiresAt) {
    http_response_code(401);
    echo json_encode(["error" => "Token reset password sudah kedaluwarsa."]);
    exit;
}

// Hash password baru
// $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Update password pengguna
$stmt = $conn->prepare("UPDATE users SET password = ? WHERE username = ?");
$stmt->bind_param("ss", $newPassword, $username);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Terjadi kesalahan saat mereset password."]);
    exit;
}

// Hapus token reset password setelah berhasil
$stmt = $conn->prepare("DELETE FROM password_resets WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();

// Kirim respons berhasil
http_response_code(200);
echo json_encode(["message" => "Password berhasil direset."]);

$stmt->close();
$conn->close();