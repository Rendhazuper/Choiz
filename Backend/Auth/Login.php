<?php
session_set_cookie_params(5); // 5 seconds
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (isset($_SESSION['user'])) {
    http_response_code(200);
    echo json_encode([
        "message" => "Anda sudah login.",
        "username" => $_SESSION['user']['username'],
        "level" => $_SESSION['user']['level']
    ]);
    exit;
}

try {
    require_once "../Helper/DB.php";
} catch (Exception $err) {
    echo "Error: " . $err->getMessage();
}

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input["email"]) || !isset($input["password"])) {
    http_response_code(400);
    echo json_encode(["error" => "Email dan password diperlukan"]);
    exit();
}

$email = $conn->real_escape_string($input["email"]);
$password = $input["password"];

// Query untuk memeriksa pengguna berdasarkan email
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $storedPassword = $user["password"];
    $isHashed = strlen($storedPassword) > 40; // Asumsi password hash selalu lebih panjang dari 40 karakter

    $passwordValid = false;

    if ($isHashed) {
        // Coba verifikasi dengan password_verify untuk user biasa
        $passwordValid = password_verify($password, $storedPassword);
    } else {
        // Bandingkan string biasa untuk admin
        $passwordValid = ($password === $storedPassword);
    }

    if ($passwordValid) {
        error_log('Login successful, setting up session...'); // Debug log
        
        $_SESSION['start_time'] = time();
        $_SESSION['expire_time'] = $_SESSION['start_time'] + (5); // 5 seconds
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['level'] = $user['level'];
        $_SESSION['username'] = $user['username'];
        
        error_log('Session data set: ' . print_r($_SESSION, true)); // Debug log
        
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'level' => $user['level'],
            'username' => $user['username'],
            'expire_time' => $_SESSION['expire_time']
        ]);

        // Hanya hash password jika bukan admin dan password belum di-hash
        if (!$isHashed && $user["level"] !== "admin") {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
            $updateStmt->bind_param("ss", $hashedPassword, $email);
            $updateStmt->execute();
            $updateStmt->close();
        }
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Password salah"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["error" => "Pengguna tidak ditemukan"]);
}

$stmt->close();
$conn->close();