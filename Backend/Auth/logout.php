<?php
session_start();

// Menghancurkan sesi
session_unset();
session_destroy();


// Menghapus cookie sesi
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');  // Hapus cookie sesi
}

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Kirim respons JSON yang valid
echo json_encode(['status' => 'success']);
?>
