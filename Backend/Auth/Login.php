<?php

session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("access-Control-Allow-Credentials: true");
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
    require_once  "./Helper/DB.php";//ubah sini buat db
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

$email = $conn->real_escape_string($input["email"]);
$password = $input["password"];
$level = '';

// Query untuk memeriksa pengguna berdasarkan email
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verifikasi password
    if ($password === $user["password"]) {
        http_response_code(200);
        
        $_SESSION['user'] = [
            'username' => $user["username"],
            'level' => $user["level"]
        ];
        var_dump($_SESSION);
        
      
        echo json_encode(array(
            "message" => "Login berhasil", 
            "username" => $user["username"], 
            "level" => $user["level"]
        ));
        
    } else {
        http_response_code(401);  // Password salah
        echo json_encode(["error" => "Password salah"]);
    }
} else {
    http_response_code(404);  // Pengguna tidak ditemukan
    echo json_encode(["error" => "Pengguna tidak ditemukan"]);
}

$conn->close();