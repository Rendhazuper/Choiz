<?php

session_start();
var_dump($_SESSION);

header("Access-Control-Allow-Origin: https://lightcoral-rat-258584.hostingersite.com");  // Sesuaikan dengan domain frontend kamu
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    // exit;
}


if (!isset($_SESSION['user'])) {
   
    http_response_code(401); // Unauthorized
    echo json_encode(["error" => "Harap login untuk mengakses halaman ini."]);
    exit;
}


echo json_encode([
    "status" => true,
    "message" => "User is logged in.",
    "username" => $_SESSION['user']['username'],
    "level" => $_SESSION['user']['level']
]);