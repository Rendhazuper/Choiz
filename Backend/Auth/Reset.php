<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../Helper/DB.php";

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$newPassword = $input['newPassword'] ?? '';

// Validasi input
if (empty($email) || empty($newPassword)) {
    http_response_code(400);
    echo json_encode(["error" => "Email dan password baru harus diisi"]);
    exit;
}

try {
    // Cek password lama
    $checkStmt = $conn->prepare("SELECT password FROM users WHERE email = ?");
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Email tidak ditemukan"]);
        exit;
    }

    $userData = $result->fetch_assoc();
    $oldPassword = $userData['password'];

    // Cek apakah password baru sama dengan password lama
    if (password_verify($newPassword, $oldPassword) || $newPassword === $oldPassword) {
        http_response_code(400);
        echo json_encode(["error" => "Password baru tidak boleh sama dengan password lama"]);
        exit;
    }

    // Hash password baru
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Update password pengguna
    $updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
    $updateStmt->bind_param("ss", $hashedPassword, $email);

    if (!$updateStmt->execute()) {
        http_response_code(500);
        echo json_encode(["error" => "Gagal mengupdate password"]);
        exit;
    }

    if ($updateStmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Email tidak ditemukan"]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Password berhasil direset"
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Terjadi kesalahan: " . $e->getMessage()
    ]);
}

$conn->close();